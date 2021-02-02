import { Db } from 'mongodb'
import * as Repository from './repository'
import * as Resolvers from './resolvers'
import { typeDefs } from './schema'
import * as Service from './service'

export const factory = (db: Db) => {
  const repository = Repository.factory(db)
  const service = Service.factory(repository)
  const resolvers = Resolvers.factory(service)

  return { resolvers, typeDefs }
}
