import Controller from '../controller/controller.interface'
import Logger from 'bunyan'
interface AppInitialiser {
    baseUrl: string
    controllers: Controller[]
    dbUrl: string
    logger: Logger
    port: number
}

export default AppInitialiser
