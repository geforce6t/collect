import config from 'config'
import App from './app'
import logger from './Utils/logger'
import { initializePlugins } from './plugins'

import FormController from './Controllers/form.controller'
import ResponseController from './Controllers/response.controller'

/**
 * Create an instance of the App class to spin up an Express web server.
 */
const app = new App({
    baseUrl: config.get('server.proxy'),
    controllers: [new FormController(), new ResponseController()],
    dbUrl: config.get('db.url'),
    logger: logger.getNamedLogger('App'),
    port: config.get('server.port'),
})

// initialize all the plugins
export const PostResponsePlugins = initializePlugins();

app.listen()