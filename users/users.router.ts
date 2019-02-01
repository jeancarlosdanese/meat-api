import * as restify from 'restify'
import { Router } from "../common/router"
import {User} from './users.model'

class UserRouter extends Router {
  
  applyRouters(application: restify.Server) {

    application.get('/users', [(req, resp, next) => {
      User.findAll()
        .then(users => {
          resp.json(users)
          return next()
        })
      }
    ])
  
    application.get('/users/:id', (req, resp, next) => {
      User.findById(req.params.id)
        .then(user => {
          if (user) {
            resp.json(user)
            return next()
          }

          resp.status(404)
          resp.send({error: 'Resource not found'})
          return next()
        })
    })
}

}

export const userRouter = new UserRouter()