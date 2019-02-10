import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './handle.error'

export class Server {

  application: restify.Server

  initializeDb() {
    return mongoose.connect(environment.db.url, {
      useNewUrlParser: true, 
      useCreateIndex: true
    })
  }

  initRouters(routers): Promise<any> {
    return new Promise((resolv, reject) => {
      try {
        this.application = restify.createServer({
          name: 'meat-api',
          versions: ['1.0.0', '2.0.0']
        })
        
        /* this.application.use(restify.plugins.conditionalHandler({
          contentType: 'application/json',
          version: '1.0.0',
          handler: (req, resp, next) => {
            next()
          }
        })) */

        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)

        // routes
        for (const router of routers) {
          router.applyRouters(this.application)
        }

        this.application.listen(environment.server.port, environment.server.host, () => {
          resolv(this.application)
        })

        this.application.on('restifyError', handleError)

      } catch (error) {
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().
      then(() => 
        this.initRouters(routers).then(() => this))
  }
  
}