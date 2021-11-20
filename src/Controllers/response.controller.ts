import { Router, Request, Response, NextFunction } from 'express'
import logger from '../Utils/logger'

import responseModel from '../Models/response.model'
import questionModel from '../Models/question.model'
import { PostResponsePlugins } from '../server';

import Controller from '../Interfaces/controller/controller.interface'
import HttpException from '../Classes/HttpException'
import validationMiddleware from '../Middlewares/validation.middleware'
import createResponseDto from '../DataTransferObjects/Response/createResponse.dto'

class ResponseController implements Controller {
    public path = ''
    public router = Router()
    public isProtected = false

    private readonly logger = logger.getNamedLogger('Controller [Response]') 
    private response = responseModel
    private question = questionModel

    constructor() {
        this.initialiseRoutes()
    }

    private initialiseRoutes() {
        // Route to create a form
        this.router.post(`${this.path}/createResponse`, validationMiddleware(createResponseDto), this.createResponse)
    }

    private createResponse = async (req: Request, res: Response, next: NextFunction) => {
        const { submit_date, form_id, time_spent, answers, auditor_phone_number, plugins }: createResponseDto = req.body;
        // the validation middleware takes care of the request validation.

        try {
            const response_data = new this.response({
                answers,
                form_id,
                submit_date,
                time_spent,
                auditor_phone_number,
            });

            const response_doc = await this.response.create(response_data);
            // the core part of the controller is done 


            // modify data that is to be fed into the plugin
            const reply = await Promise.all(answers.map(async (item)=> {
                const resp = await this.question.findById(item.question_id).lean().exec();
                return {question: resp, answer: item.value};
            }))

            const plugin_data = {reply, auditor_phone_number, time_spent, form_id};


            //activate all the plugins that are applied 
            await Promise.all(plugins.map(async plugin => {
                switch (plugin) {
                    case 'sheets':
                        await PostResponsePlugins.sheetPlugin.queuePlugin(plugin_data);
                        break;
                    default:
                        break;
                }
            }))

            return res.status(200).jsonp({
                status: 200,
                success: true,
                result: response_doc,
                msg: "Sucessfully created response for the form",
            });

        } catch (err) {
            console.log(err)
            return next(
                new HttpException({
                    status: 500,
                    message: `Internal Server error!`,
                    logger: this.logger,
                })
            )
        }
    }
}

export default ResponseController
