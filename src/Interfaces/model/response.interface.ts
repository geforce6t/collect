import * as mongoose from 'mongoose'

interface Answer {
    question_id: mongoose.Schema.Types.ObjectId
    value: string
}

interface Response {
    form_id: mongoose.Schema.Types.ObjectId
    time_spent: string
    auditor_phone_number: number
    submit_date: Date
    answers: Answer[]
}

export default Response
