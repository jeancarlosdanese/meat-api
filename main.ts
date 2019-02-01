 import { Server } from './server/server'
 import {userRouter} from './users/users.router'

const server = new Server()

server.bootstrap([userRouter]).then(server => {
  console.log('API is running on: ', `http://${server.application.address().address}:${server.application.address().port}`)
}).catch(error => {
  console.log('Server failed to start')
  console.log(error)
  process.exit(1)
})