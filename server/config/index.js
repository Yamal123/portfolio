module.exports = {
  port: process.env.PORT || 8000,
  jwt: {
    secret: 'aipmym_jwt_secret_key_2026',
    expiresIn: '2h'
  },
  salt: 'aipmym_salt_2026_v1',
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
  }
}