"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: {
        host: process.env.SERVER_HOST || 'localhost',
        port: process.env.SERVER_PORT || 3000
    },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost/meat-api'
    },
};
//# sourceMappingURL=environment.js.map