export const environment = {
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: process.env.SERVER_PORT || 3000
  },
  db: { 
    url: process.env.DB_URL || 'mongodb://localhost/meat-api'
  },
  security: {
    saltRound: process.env.SALT_ROUNDS || 10,
    apiSecret: process.env.API_SECRET || 'meat-api-secret'
  }
}