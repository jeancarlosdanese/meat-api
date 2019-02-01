import * as restify from 'restify'
import { Router } from "../common/router"
import {User} from './users.model'
import {NotFoundError} from 'restify-errors'

class UserRouter extends Router {
  
  applyRouters(application: restify.Server) {

    application.get('/users', (req, resp, next) => {
      User.find()
        .then(this.render(resp,next))
    })

    application.get('/users/:id', (req, resp, next) => {
      User.findById(req.params.id)
        .then(this.render(resp,next))
    })

    application.post('/users', (req, resp, next) => {
      const user = new User(req.body)
      user.save()
        .then(this.render(resp,next))
    })

    application.put('/users/:id', (req, resp, next) => {
      const options = { overwrite: true }

      User.update({_id: req.params.id}, req.body, options)
        .exec()
        .then(result => {
          if(result.n) {
            return User.findById(req.params.id)
          } else {
            resp.status(404)
            resp.send({message: 'Resource not found'})
          }
        })
        .then(this.render(resp,next))
    })

    application.patch('/users/:id', (req, resp, next) => {

      const options = { new: true }

      User.findByIdAndUpdate(req.params.id, req.body, options)
        .then(this.render(resp,next))
    })

    application.del('/users/:id', (req, resp, next) => {

      User.deleteOne({_id: req.params.id})
      .exec()
      .then(result => {
        if (result) {
          console.log(result);
          
          resp.send(204)
        } else {
          throw new NotFoundError('Documento não encontrado')
        }

        return next()
      })
      .catch(next)
    })
  
  }

}

export const userRouter = new UserRouter()