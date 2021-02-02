import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { ApolloServer, IResolvers, makeExecutableSchema } from 'apollo-server-express'
import express from 'express'
import { MongoClient } from 'mongodb'
import { AppConfig } from './config'
import * as Item from './domain/item'

export const start = async (config: AppConfig) => {
  const db = await MongoClient.connect(config.database.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((connection) => connection.db(config.database.dbName))

  const items = Item.factory(db)

  const schema = makeExecutableSchema({
    typeDefs: [DIRECTIVES, items.typeDefs],
    resolvers: [items.resolvers] as IResolvers[]
  })

  const server = new ApolloServer({ schema, tracing: true })

  const app = express()

  server.applyMiddleware({ app })

  app.listen({ port: config.server.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${config.server.port}${server.graphqlPath}`)
  })
}
