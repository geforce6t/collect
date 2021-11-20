import express, { Application, Router } from 'express'
import * as Logger from 'bunyan'

import Connect from './connect'
import errorMiddleware from './Middlewares/error.middleware'

import AppInitialiser from './Interfaces/misc/appInitialiser.interface'
import Controller from './Interfaces/controller/controller.interface'

class App {
    public app: Application
    private port: number
    private baseUrl: string
    private readonly logger: Logger

    constructor({ baseUrl, controllers, dbUrl, logger, port }: AppInitialiser) {
        this.app = express()
        this.port = port
        this.baseUrl = baseUrl
        this.logger = logger

        this.connectToDatabase(dbUrl)
        this.initialiseMiddlewares()
        this.initialiseControllers(controllers)
        this.initialiseErrorHandlerMiddleware()
    }

    private connectToDatabase(dbUrl: string) {
        Connect({ db: dbUrl })
    }

    private initialiseMiddlewares() {
        // Body Parser
        this.app.use(express.json())

        // Request Logging
        this.app.use((req, res, next) => {
            this.logger.info(`${req.method} ${req.path}`)
            next()
        })
    }

    private initialiseControllers(controllers: Controller[]) {
        const appRouter = Router()
        /**
         * ideally there should be 2 types of controllers.
         * One for the unprotected and other for protected routes
         * The protected route should be passed a middleware to check for the user in the incoming req.
         * Since the application was to be developed in a limited period the user utilities along with auth are not implemented.
         */
        controllers.forEach((controller) => appRouter.use(controller.router))

        this.app.use(this.baseUrl, appRouter)
    }

    private initialiseErrorHandlerMiddleware() {
        this.app.use(errorMiddleware)
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`)
        })
    }
}

export default App
