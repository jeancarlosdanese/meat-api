"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const environment_1 = require("../common/environment");
const mongoose = require("mongoose");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error-handler");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 10,
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip trying IPv6
        };
        return mongoose.connect(environment_1.environment.db.url, options);
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
                this.application.on('restifyError', error_handler_1.handleError);
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
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map