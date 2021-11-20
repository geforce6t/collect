import * as mongoose from 'mongoose'

interface Form {
    questions: Array<mongoose.Types.ObjectId>
    is_open: boolean
    title: string
    description: string
}

export default Form
