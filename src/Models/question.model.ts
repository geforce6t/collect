import * as mongoose from 'mongoose'
import Question from '../Interfaces/model/question.interface'

const questionSchema = new mongoose.Schema<Question>({
    type: {
        type: String,
        enum: ['Multiple Choice', 'Single Choice', 'text', 'number', 'note'],
    },
    title: String,
    description: String,
    options: [String],
    max_characters: Number,
    required: {
        type: Boolean,
        default: false,
    },
})

const questionModel = mongoose.model<Question>('Question', questionSchema)

export default questionModel
