import env from 'sugar-env'

export type AppConfig = {
  database: {
    uri: string
    dbName: string
  }
  server: {
    port: number
  }
}

export const config: AppConfig = {
  database: {
    uri: env.get('DATABASE_URI', 'mongodb://localhost:27017/rate-me-not'),
    dbName: env.get('DATABASE_DBNAME', 'rate-me-not')
  },
  server: {
    port: env.get.int('SERVER_PORT', 3000)
  }
}
