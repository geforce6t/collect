interface Question {
    type: string
    title: string
    description: string
    options?: Array<string>
    max_characters: number
    required: boolean
}

export default Question
