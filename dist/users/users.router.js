"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
class UserRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(resp, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            // delete document.password
            document.password = undefined;
        });
    }
    applyRouters(application) {
        // application.get({path: '/users', version: '2.0.0'}, [this.findByEmail, this.findAll])
        // application.get({path: '/users', version: '1.0.0'}, this.findAll)
        application.get('/users', restify.plugins.conditionalHandler([
            {
                version: '1.0.0',
                handler: this.findAll
            },
            {
                version: '2.0.0',
                handler: [this.findByEmail, this.findAll]
            }
        ]));
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId, this.replace]);
        application.patch('/users/:id', [this.validateId, this.update]);
        application.del('/users/:id', [this.validateId, this.delete]);
    }
}
exports.usersRouter = new UserRouter();
//# sourceMappingURL=users.router.js.map