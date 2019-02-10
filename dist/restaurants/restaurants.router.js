"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
const restify_errors_1 = require("restify-errors");
class RestaurantRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
                .then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    resp.json(restaurant.menu);
                    return next();
                }
            })
                .catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    restaurant.menu = req.body; // Array de ManuItem
                    return restaurant.save();
                }
            })
                .then(restaurant => {
                resp.json(restaurant.menu);
                return next();
            })
                .catch(next);
        };
    }
    applyRouters(application) {
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.replace]);
        application.patch('/restaurants/:id', [this.validateId, this.update]);
        application.del('/restaurants/:id', [this.validateId, this.delete]);
        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantRouter();
//# sourceMappingURL=restaurants.router.js.map