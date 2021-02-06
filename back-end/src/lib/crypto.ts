import crypto from 'crypto'
import { AppConfig } from '../config'

export const verifyHash = (config: AppConfig['crypto']) => (
  password: string,
  storedPassword: string
) => {
  const [salt, storedHash] = storedPassword.split('.')

  return createHash(config)(password, salt) === `${salt}.${storedHash}`
}

export const createHash = (config: AppConfig['crypto']) => (password: string, salt?: string) => {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex')

  return finalSalt.concat(
    '.',
    crypto
      .createHmac(config.algorithm, config.key)
      .update(`${finalSalt}${password}`)
      .digest('base64')
  )
}

export const getCrypto = (config: AppConfig['crypto']) => ({
  verifyHash: verifyHash(config),
  createHash: createHash(config)
})

export type Crypto = ReturnType<typeof getCrypto>
