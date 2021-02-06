import { Algorithm } from 'jsonwebtoken'
import env from 'sugar-env'

export type AppConfig = {
  database: {
    uri: string
    dbName: string
  }
  server: {
    port: number
  }
  jwt: {
    algorithm: Algorithm
    audience: string
    issuer: string
    ttl: string
    secret: string
  }
  crypto: {
    algorithm: string
    key: string
  }
}

export const config: AppConfig = {
  database: {
    uri: env.get('DATABASE_URI', 'mongodb://localhost:27017/rate-me-not'),
    dbName: env.get('DATABASE_DBNAME', 'rate-me-not')
  },
  server: {
    port: env.get.int('SERVER_PORT', 3000)
  },
  jwt: {
    algorithm: env.get('JWT_ALGORITHM', 'HS256'),
    audience: env.get('JWT_AUDIENCE', 'rate-me-not'),
    issuer: env.get('JWT_ISSUER', 'rate-me-not'),
    ttl: env.get('JWT_TTL', '5m'),
    secret: env.get('JWT_SECRET', 'jwtsecret')
  },
  crypto: {
    algorithm: env.get('CRYPTO_ALGORITHM', 'sha512'),
    key: env.get('CRYPTO_KEY', 'secret')
  }
}
