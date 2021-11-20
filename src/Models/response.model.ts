import * as mongoose from 'mongoose'
import Response from '../Interfaces/model/response.interface'

const responseSchema = new mongoose.Schema<Response>({
    form_id: mongoose.Schema.Types.ObjectId,
    time_spent: String,
    submit_date: mongoose.Schema.Types.Date,
    auditor_phone_number: Number,
    answers: [
        {
            question_id: mongoose.Schema.Types.ObjectId,
            value: String,
        },
    ],
})

const responseModel = mongoose.model<Response>('Response', responseSchema)

export default responseModel
