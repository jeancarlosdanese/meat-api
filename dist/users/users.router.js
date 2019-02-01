"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
const restify_errors_1 = require("restify-errors");
class UserRouter extends router_1.Router {
    applyRouters(application) {
        application.get('/users', (req, resp, next) => {
            users_model_1.User.find()
                .then(users => {
                resp.json(users);
                return next();
            });
        });
        application.get('/users/:id', (req, resp, next) => {
            users_model_1.User.findById(req.params.id)
                .then(user => {
                resp.json(user);
                return next();
            });
        });
        application.post('/users', (req, resp, next) => {
            const user = new users_model_1.User(req.body);
            user.save()
                .then(user => {
                user.password = undefined;
                resp.json(user);
                return next();
            });
        });
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true };
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(result => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    resp.status(404);
                    resp.send({ message: 'Resource not found' });
                }
            })
                .then(user => {
                resp.json(user);
                return next();
            });
        });
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                if (user) {
                    resp.json(user);
                }
                else {
                    resp.status(404);
                    resp.send({ message: 'Resource not found' });
                }
                return next();
            });
        });
        application.del('/users/:id', (req, resp, next) => {
            users_model_1.User.deleteOne({ _id: req.params.id })
                .exec()
                .then(result => {
                if (result) {
                    console.log(result);
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            })
                .catch(next);
        });
    }
}
exports.userRouter = new UserRouter();
//# sourceMappingURL=users.router.js.map