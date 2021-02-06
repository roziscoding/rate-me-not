import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { ApolloServer, IResolvers, makeExecutableSchema } from 'apollo-server-express'
import express from 'express'
import { MongoClient } from 'mongodb'
import { AppConfig } from './config'
import auth, { authDirective } from './directives/auth'
import * as Item from './domain/item'
import * as User from './domain/user'
import { getCrypto } from './lib/crypto'
import { getJwtLib } from './lib/jwt'

export const start = async (config: AppConfig) => {
  const db = await MongoClient.connect(config.database.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((connection) => connection.db(config.database.dbName))

  const items = Item.factory(db)
  const users = User.factory(db, getCrypto(config.crypto), getJwtLib(config.jwt))

  const schema = makeExecutableSchema({
    typeDefs: [DIRECTIVES, authDirective, items.typeDefs, users.typeDefs],
    resolvers: [items.resolvers, users.resolvers] as IResolvers[],
    schemaDirectives: {
      ...auth
    }
  })

  const server = new ApolloServer({
    schema,
    tracing: true,
    introspection: true,
    context: ({ req, res }) => ({ req, res, config }),
    formatError: (err: any) => {
      delete err.extensions.exception
      return err
    }
  })

  const app = express()

  server.applyMiddleware({ app })

  app.listen({ port: config.server.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${config.server.port}${server.graphqlPath}`)
  })
}
