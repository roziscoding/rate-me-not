import { Resolvers } from '../../generated/graphql'
import { DeepPartial } from '../../types/DeepPartial'
import { ItemService } from './service'

const getAverage = (items: number[]) =>
  items.length ? items.reduce((total, item) => item + total, 0) / items.length : 0

export const factory = (service: ItemService): DeepPartial<Resolvers> => ({
  Item: {
    id: (parent) => parent._id.toHexString(),
    rating: (parent) => getAverage(parent.ratings.map(({ rating }: { rating: number }) => rating)),
    ratingsCount: (parent) => parent.ratings.length
  },
  Query: {
    getItems: (_, { id }) => service.find(id)
  },
  Mutation: {
    addItem: (_, { itemData: { title, description } }) => service.create(title, description),
    rateItem: (_, { id, rating }) => service.rate(id, rating)
  }
})
