"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restifyErrors = require("restify-errors");
const mpContentType = 'application/merge-patch+json';
exports.mergePatchBodyParser = (req, resp, next) => {
    if (req.contentType() === mpContentType && req.method === 'PATCH') {
        req.rawBody = req.body;
        try {
            req.body = JSON.parse(req.body);
        }
        catch (error) {
            return next(new restifyErrors.BadRequestError(`Invalid content: ${error.message}`));
        }
    }
    return next();
};
//# sourceMappingURL=merge-patch.parser.js.map