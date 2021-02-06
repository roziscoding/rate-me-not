import { ApolloError, AuthenticationError } from 'apollo-server-express'
import { CreateUserInput, UserDbObject } from '../../generated/graphql'
import { Crypto } from '../../lib/crypto'
import { JwtLib } from '../../lib/jwt'
import { UserRepository } from './repository'

const login = (repository: UserRepository, crypto: Crypto, jwt: JwtLib) => async (
  usernameOrEmail: string,
  password: string
) => {
  const user = await repository.findByUsernameOrEmail(usernameOrEmail)

  const isPasswordValid = user && crypto.verifyHash(password, user.password)

  if (!user || !isPasswordValid) throw new AuthenticationError('Invalid login or password')

  const { password: _, ...userWithoutPassword } = user

  return jwt.createToken(user._id.toHexString(), userWithoutPassword)
}

const create = (repository: UserRepository, crypto: Crypto) => async (
  userData: CreateUserInput
) => {
  const { email, username, password } = userData

  if (await repository.existsByEmail(email)) {
    throw new ApolloError(`user with email ${email} already exists`, 'EMAIL_EXISTS')
  }

  if (await repository.existsByUsername(username)) {
    throw new ApolloError(`user with username ${username} already exists`, 'USERNAME_EXISTS')
  }

  const hashedPassword = crypto.createHash(password)

  await repository.create({
    email,
    username,
    password: hashedPassword
  })

  return true
}

const renew = (repository: UserRepository, jwt: JwtLib) => async (token: string) => {
  const tokenPayload = jwt.verifyToken(token) as Omit<UserDbObject, 'password' | '_id'> & {
    _id: string
  }

  const user = await repository.findByUsernameOrEmail(tokenPayload.username)

  if (!user) throw new AuthenticationError('unkown user')

  const { password: _, ...userWithoutPassword } = user

  return jwt.createToken(user._id.toHexString(), userWithoutPassword)
}

export const factory = (repository: UserRepository, crypto: Crypto, jwt: JwtLib) => ({
  create: create(repository, crypto),
  login: login(repository, crypto, jwt),
  renew: renew(repository, jwt)
})

export type UserService = ReturnType<typeof factory>
