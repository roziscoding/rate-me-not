import { Request, Response } from 'express'
import { AppConfig } from '../config'
import { UserDbObject } from '../generated/graphql'

export type Context = {
  req: Request
  res: Response
  config: AppConfig
  user: Omit<UserDbObject, 'password' | '_id'> & { _id: string }
}
