"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const environment_1 = require("../common/environment");
const mongoose = require("mongoose");
const merge_patch_parser_1 = require("./merge-patch.parser");
const handle_error_1 = require("./handle.error");
class Server {
    initializeDb() {
        return mongoose.connect(environment_1.environment.db.url, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
    }
    initRouters(routers) {
        return new Promise((resolv, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    versions: ['1.0.0', '2.0.0']
                });
                /* this.application.use(restify.plugins.conditionalHandler({
                  contentType: 'application/json',
                  version: '1.0.0',
                  handler: (req, resp, next) => {
                    next()
                  }
                })) */
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                // routes
                for (const router of routers) {
                    router.applyRouters(this.application);
                }
                this.application.listen(environment_1.environment.server.port, environment_1.environment.server.host, () => {
                    resolv(this.application);
                });
                this.application.on('restifyError', handle_error_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().
            then(() => this.initRouters(routers).then(() => this));
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map