import { ApolloError } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { CommentInput } from '../../generated/graphql'
import { Context } from '../../types/Contex'
import type { ItemRepository } from './repository'

export const find = (repository: ItemRepository) => async (id?: string | null) => {
  if (id) {
    const item = await repository.findById(id)

    if (!item) throw new ApolloError(`Item with ID ${id} was not found`)

    return [item]
  }

  return repository.getAll()
}

export const create = (repository: ItemRepository) => async (
  title: string,
  description: string,
  user: Context['user']
) =>
  repository.create(new ObjectId(), title, description, user._id).then((item) => {
    if (!item) throw new ApolloError('Error creating item')

    return item
  })

export const rate = (repository: ItemRepository) => async (
  id: string,
  rating: CommentInput,
  user: Context['user']
) => {
  return repository
    .addRating(id, {
      _id: new ObjectId(),
      createdAt: new Date(),
      createdBy: user._id,
      ...rating
    })
    .then((item) => {
      if (!item) throw new GraphQLError('Item not found')
      return item
    })
}

export const factory = (repository: ItemRepository) => ({
  find: find(repository),
  create: create(repository),
  rate: rate(repository)
})

export type ItemService = ReturnType<typeof factory>
