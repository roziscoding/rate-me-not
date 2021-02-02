import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { CommentInput } from '../../generated/graphql'
import type { ItemRepository } from './repository'

export const find = (repository: ItemRepository) => async (id?: string | null) => {
  if (id) return [await repository.findById(id)]

  return repository.getAll()
}

export const create = (repository: ItemRepository) => async (title: string, description: string) =>
  repository.create(new ObjectId(), title, description)

export const rate = (repository: ItemRepository) => async (id: string, rating: CommentInput) => {
  return repository.addRating(id, { createdAt: new Date(), ...rating }).then((item) => {
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
