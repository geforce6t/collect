import Question from "../model/question.interface";

export default interface Plugin {
    type: string
}

export interface PluginResponse {
    auditor_phone_number: number
    time_spent: string
    form_id: string
    reply: Array<Reply>
}

export interface Reply {
    question: Question | null
    answer: string
}