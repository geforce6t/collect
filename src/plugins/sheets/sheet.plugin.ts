import Plugin, { PluginResponse, Reply } from '../../Interfaces/misc/plugin.interface';
import logger from '../../Utils/logger'
import { google } from 'googleapis';
import Queue from 'bull';
import config from 'config'
import path from 'path/posix';

class SheetPlugin implements Plugin {
    public type = "google sheets";
    private readonly logger = logger.getNamedLogger('Controller [Plugin-Sheets]') 
    private googleAPI = google
    private rootFolder: string = config.get('sheetPluginConfig.DriveRootFolder')
    public sheetQueue = new Queue('sheets', {
        redis: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
        }
    })

    constructor() {
        this.sheetQueue.process(async job => {

            try {
                const auth = new this.googleAPI.auth.GoogleAuth({
                    keyFile: path.resolve(__dirname, "credentials.json"),
                    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
                });

                // create client instance 
                const client = await auth.getClient();

                // create instance of apis
                const googleSheets = this.googleAPI.sheets({version: "v4", auth: client});
                const googleDrive = this.googleAPI.drive({version:"v3",auth: client});

                // root folder inside which all the files are saved
                const rootFolder = this.rootFolder;

                // look for existing spreadsheet corresponding to the form.
                const resp = await googleDrive.files.list({
                    q: `mimeType:'application/vnd.google-apps.spreadsheet' and name:'${job.data.form_id}'`,
                });

                let spreadsheetId: string | undefined = ""; 

                // if the form is not present create a form and insert the question
                if (resp.data.files?.length === 0){
                    const resp = await googleDrive.files.create({
                        requestBody: {
                            mimeType: "application/vnd.google-apps.spreadsheet",
                            name: job.data.form_id,
                            parents: [rootFolder]
                        }
                    });

                    this.logger.info(`new file created : ${resp.data}`);

                    spreadsheetId = resp.data.id!;

                    await googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: "Sheet1",
                        valueInputOption: "USER_ENTERED",
                        requestBody: {
                            values: [
                                job.data.reply.map((item: Reply) => item.question?.description)
                            ]
                        }
                    })

                    this.logger.info(`appended the questions for ${spreadsheetId}`);

                } else {
                    spreadsheetId = resp.data.files?.[0].id!;
                }


                //append the answer
                await googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: "Sheet1",
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        values: [
                            job.data.reply.map((item: Reply) => item.answer)
                        ]
                    }
                })       

                this.logger.info(`appended the answers to the sheet: ${spreadsheetId}`)
                
            } catch (error) {
                this.logger.info(`Plugin Eroor : ${error}`);
            }
        })
    }

    public queuePlugin = async(responseData: PluginResponse) => {
        await this.sheetQueue.add(responseData, {
            attempts: 2
        });
    }
}

export default SheetPlugin;