import { Resolvers } from '../../generated/graphql'
import { DeepPartial } from '../../types/DeepPartial'
import { UserService } from './service'

export const factory = (service: UserService): DeepPartial<Resolvers> => ({
  User: {
    password: () => ''
  },

  Mutation: {
    signup: (_, { userData }) => service.create(userData)
  },

  Query: {
    login: (_, { username, password }) => service.login(username, password),
    renew: (_, { token }) => service.renew(token)
  }
})
