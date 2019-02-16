import 'jest'
import * as request from 'supertest'
import {Server} from '../server/server'
import {environment} from '../common/environment'
import {usersRouter} from './users.router'
import {User} from './users.model'

let address: string
let server: Server
beforeAll(()=>{
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test'
  environment.server.port = process.env.SERVER_PORT || 3001
  address = `http://localhost:${environment.server.port}`
  server = new Server()
  return server.bootstrap([usersRouter])
               .then(() => User.remove({}).exec())
               .catch(console.error)
})

test('get /users', () => { 
  return request(address)
     .get('/users')
     .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
     }).catch(fail)
})

test('post /users', () => {
  return request(address)
     .post('/users')
     .send({
       name: 'mario',
       email: 'mario@andrade.com',
       gender: 'Male',
       password: '123456',
       cpf: '962.116.531-82'
     })
     .then(response => {
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('mario')
        expect(response.body.email).toBe('mario@andrade.com')
        expect(response.body.gender).toBe('Male')
        expect(response.body.cpf).toBe('962.116.531-82')
        expect(response.body.password).toBeUndefined()
     }).catch(fail)
})

afterAll(()=>{
  return server.shutdown()
})
