import 'dotenv/config'

const requiredVars = [
  'NODE_ENV',
  'PORT',
  'ACCESS_TOKEN_SECRET',
  'ACCESS_TOKEN_PUBLIC',
  'REFRESH_TOKEN_SECRET',
  'REFRESH_TOKEN_PUBLIC'
]

const missing = requiredVars.filter((v) => !process.env[v])
if (missing.length > 0) {
  throw new Error(`Missing required env vars: ${missing.join(', ')}`)
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV as 'development' | 'production',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'info',

  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC!,
  accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC!,
  refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET!,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'app',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password'
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,POST,PUT,PATCH,DELETE'
  }
} as const

console.log(`
╔══════════════════════════════════════════════════╗
║           ENVIRONMENT CONFIGURATION              ║
╠══════════════════════════════════════════════════╣
║ Environment:  ${env.nodeEnv.toUpperCase().padEnd(35)}║
║ Port:         ${env.port.toString().padEnd(35)}║
║ Log Level:    ${env.logLevel.padEnd(35)}║
║ CORS Origin:  ${env.cors.origin.padEnd(35)}║
║ DB Host:      ${env.db.host.padEnd(35)}║
║ DB Port:      ${env.db.port.toString().padEnd(35)}║
║ DB Name:      ${env.db.name.padEnd(35)}║
║ API URL:      ${env.apiUrl.padEnd(35)}║
╚══════════════════════════════════════════════════╝
`)
