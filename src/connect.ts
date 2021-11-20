import mongoose from 'mongoose'

type DBInput = {
    db: string
}

export default ({ db }: DBInput) => {
    const connect = async () => {
        try {
            await mongoose.connect(db)

            return console.info(`Successfully connected to ${db}`)
        } catch (err) {
            console.error(`Error connecting to database :`, err)

            return process.exit(1)
        }
    }

    connect()
}
