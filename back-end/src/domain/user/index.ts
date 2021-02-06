import { Db } from 'mongodb'
import { Crypto } from '../../lib/crypto'
import { JwtLib } from '../../lib/jwt'
import * as Repository from './repository'
import * as Resolvers from './resolvers'
import { typeDefs } from './schema'
import * as Service from './service'

export const factory = (db: Db, crypto: Crypto, jwt: JwtLib) => {
  const repository = Repository.factory(db)
  const service = Service.factory(repository, crypto, jwt)
  const resolvers = Resolvers.factory(service)

  return { resolvers, typeDefs }
}
