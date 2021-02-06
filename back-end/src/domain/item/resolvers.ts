import { Resolvers } from '../../generated/graphql'
import { Context } from '../../types/Contex'
import { DeepPartial } from '../../types/DeepPartial'
import { ItemService } from './service'

const getAverage = (items: number[]) =>
  items.length ? items.reduce((total, item) => item + total, 0) / items.length : 0

export const factory = (service: ItemService): DeepPartial<Resolvers> => ({
  Item: {
    id: (parent) => parent._id,
    rating: (parent) => getAverage(parent.ratings.map(({ rating }: { rating: number }) => rating)),
    ratingsCount: (parent) => parent.ratings.length
  },
  Query: {
    getItems: (_, { id }) => service.find(id)
  },
  Mutation: {
    addItem: (_, { itemData: { title, description } }, ctx: Context) => {
      return service.create(title, description, ctx.user)
    },
    rateItem: (_, { id, rating }, ctx: Context) => service.rate(id, rating, ctx.user)
  }
})
