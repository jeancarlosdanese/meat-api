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
    apiSecret: process.env.API_SECRET || 'meat-api-secret',
    enableHttps: process.env.ENABLE_HTTPS || false,
    certificate: process.env.CERT_FILE || './security/keys/cert.pem',
    key: process.env.CERT_KEY_FILE || './security/keys/key.pem'
  },
  log: {
    level: process.env.LOG_LEVEL || 'debug',
    name: 'meat-api-logger'
  }
}