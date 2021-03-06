import * as restify from 'restify'
import * as restifyErrors from 'restify-errors'

const mpContentType = 'application/merge-patch+json'

export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next) => {
  if (req.contentType() === mpContentType && req.method === 'PATCH') {
    (<any>req).rawBody = req.body
    try {
      req.body = JSON.parse(req.body)
    } catch (error) {
      return next(new restifyErrors.BadRequestError(`Invalid content: ${error.message}`))      
    }
  }

  return next()
}