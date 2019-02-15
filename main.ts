import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { restaurantsRouter } from './restaurants/restaurants.router'
import { reviewsRouter } from './reviews/reviews.router';
import { mainRouter } from './main.router'

const server = new Server()

server.bootstrap([
  mainRouter,
  usersRouter,
  restaurantsRouter,
  reviewsRouter
]).then(server => {
  console.log('API is running on: ', `http://${server.application.address().address}:${server.application.address().port}`)
}).catch(error => {
  console.log('Server failed to start')
  console.log(error)
  process.exit(1)
})