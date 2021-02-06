import { AuthenticationError } from 'apollo-server-express'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import { AppConfig } from '../config'

export const verifyToken = (ctx: { config: { jwt: AppConfig['jwt'] } }, token: string) => {
  const {
    config: { jwt: config }
  } = ctx

  const options: VerifyOptions = {
    algorithms: [config.algorithm],
    audience: config.audience,
    issuer: config.issuer
  }

  try {
    const payload = jwt.verify(token, config.secret, options)

    if (typeof payload === 'string') {
      throw new AuthenticationError('Token payload is invalid')
    }

    return payload
  } catch (err) {
    throw new AuthenticationError(err.message)
  }
}

export const createToken = (config: AppConfig['jwt']) => (subject: string, payload: any) => {
  const options: SignOptions = {
    algorithm: config.algorithm,
    audience: config.audience,
    issuer: config.issuer,
    subject,
    expiresIn: config.ttl
  }

  return jwt.sign(payload, config.secret, options)
}

export const getJwtLib = (config: AppConfig['jwt']) => ({
  createToken: createToken(config),
  verifyToken: (token: string) => verifyToken({ config: { jwt: config } }, token)
})

export type JwtLib = ReturnType<typeof getJwtLib>
