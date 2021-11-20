import * as mongoose from 'mongoose'
import Form from '../Interfaces/model/form.interface'

const formSchema = new mongoose.Schema<Form>({
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
    ],
    is_open: {
        type: Boolean,
        default: false,
    },
    title: String,
    description: String,
})

const formModel = mongoose.model<Form>('Form', formSchema)

export default formModel
