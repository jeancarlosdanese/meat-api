"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const reviews_router_1 = require("./reviews/reviews.router");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurants_router_1.restaurantsRouter,
    reviews_router_1.reviewsRouter
]).then(server => {
    console.log('API is running on: ', `http://${server.application.address().address}:${server.application.address().port}`);
}).catch(error => {
    console.log('Server failed to start');
    console.log(error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map