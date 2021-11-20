import { Router, Request, Response, NextFunction } from 'express'
import logger from '../Utils/logger'

import QuestionModel from '../Models/question.model'
import FormModel from '../Models/form.model'


import Controller from '../Interfaces/controller/controller.interface'
import HttpException from '../Classes/HttpException'
import validationMiddleware from '../Middlewares/validation.middleware'
import createFormDto from '../DataTransferObjects/Form/createForm.dto'

class FormController implements Controller {
    public path = ''
    public router = Router()
    public isProtected = false

    private readonly logger = logger.getNamedLogger('Controller [Form]') 
    private question = QuestionModel
    private form = FormModel

    constructor() {
        this.initialiseRoutes()
    }

    private initialiseRoutes() {
        // Route to create a form
        this.router.post(`${this.path}/createForm`, validationMiddleware(createFormDto), this.createForm)
    }

    private createForm = async (req: Request, res: Response, next: NextFunction) => {
        const { questions, is_open, title, description }: createFormDto = req.body;
        // the validation middleware takes care of the request validation.

        try {
            const questions_doc = await this.question.insertMany(questions);

            const arr = questions_doc.map((doc) => doc._id);

            const form_data = new this.form({
                questions: arr,
                is_open,
                title,
                description,
            })

            const form_doc = await this.form.create(form_data);

            return res.status(200).jsonp({
                status: 200,
                success: true,
                result: form_doc,
                msg: "Sucessfully created form with the questions",
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

export default FormController
