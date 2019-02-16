import {Router} from './common/router'
import * as restify from 'restify'

class MainRouter extends Router {
  
  applyRouters(apllication: restify.Server) {
    throw new Error("Method not implemented.");
  }
  
  applyRoutes(application: restify.Server) {
    application.get('/', (req, resp, next)=>{
      resp.json({
        users: '/users',
        restaurants: '/restaurants',
        reviews: '/reviews'
      })
    })
  }
}

export const mainRouter = new MainRouter()
