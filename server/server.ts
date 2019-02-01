import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'

export class Server {

  application: restify.Server

  initRoutes(routers): Promise<any> {
    return new Promise((resolv, reject) => {
      try {
        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })
        
        this.application.use(restify.plugins.queryParser())

        // routes
        for (const router of routers) {
          router.applyRouters(this.application)
        }

        this.application.listen(environment.server.port, environment.server.host, () => {
          resolv(this.application)
        })

      } catch (error) {
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initRoutes(routers).then(() => this)
  }
  
}