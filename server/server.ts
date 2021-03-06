import * as fs from 'fs'
import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './error.handler'
import {tokenParser} from '../security/token.parser'
import {logger} from '../common/logger'


export class Server {

  application: restify.Server

  initializeDb() {
    (<any>mongoose).Promise = global.Promise

    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    return mongoose.connect(environment.db.url, options)
  }

  initRouters(routers: Router[]): Promise<any>{
    return new Promise((resolv, reject) => {
      try {

        const options: restify.ServerOptions = {
          name: 'meat-api',
          versions: ['1.0.0', '2.0.0'],
          log: logger
        }

        if (environment.security.enableHttps) {
          options.certificate = fs.readFileSync(environment.security.certificate)
          options.key = fs.readFileSync(environment.security.key)
        }

        this.application = restify.createServer(options)
        
        this.application.pre(restify.plugins.requestLogger({
          log: logger
        }))

        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)
        this.application.use(tokenParser)

        // routes
        for (const router of routers) {
          router.applyRouters(this.application)
        }

        this.application.listen(environment.server.port, environment.server.host, () => {
          resolv(this.application)
        })

        this.application.on('restifyError', handleError)
        // (req, resp, route, error)
        /* this.application.on('after', restify.plugins.auditLogger({
          log: logger,
          event: 'after',
          server: this.application
        }))

        this.application.on('audit', data => {

        }) */

      } catch (error) {
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() => 
           this.initRouters(routers).then(() => this))
  }

  shutdown(){
    return mongoose.disconnect().then(()=>this.application.close())
  }
  
}