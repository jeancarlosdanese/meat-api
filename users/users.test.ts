import 'jest'
import * as request from 'supertest'
import {Server} from '../server/server'
import {environment} from '../common/environment'
import {usersRouter} from './users.router'
import {User} from './users.model'

let address: string = (<any>global).address

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

test('get /users/aaaaa - not found', () => {
  return request(address)
     .get('/users/aaaaa')
     .then(response => {
      expect(response.status).toBe(404)
     }).catch(fail)
})

test('patch /users/:id', () => {
  return request(address)
     .post('/users')
     .send({
       name: 'Maria',
       email: 'mario@andrade.com.br',
       gender: 'Female',
       password: '12345667',
       cpf: '962.116.531-82'
     })
     .then(response => {
        request(address)
          .patch(`/users/${response.body._id}`)
          .send({
            name: 'Maria Madalena',
            email: 'maria@madalena.com.br',
            password: '12345678'
          })
          .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Maria Madalena')
            expect(response.body.email).toBe('maria@madalena.com.br')
            expect(response.body.gender).toBe('Female')
            expect(response.body.cpf).toBe('962.116.531-82')
            expect(response.body.password).toBeUndefined()
          })
     }).catch(fail)
})
