import type { Collection, Db } from 'mongodb'
import { ObjectId } from 'mongodb'
import type { Comment, ItemDbObject } from '../../generated/graphql'

export const findById = (collection: Collection<ItemDbObject>) => async (id: string | ObjectId) =>
  ObjectId.isValid(id) ? collection.findOne(new ObjectId(id)) : null

export const getAll = (collection: Collection<ItemDbObject>) => async () =>
  collection.find().toArray()

export const create = (collection: Collection<ItemDbObject>) => async (
  id: ObjectId,
  title: string,
  description: string,
  createdBy: string
) =>
  collection
    .insertOne({
      _id: id,
      title,
      description,
      ratings: [],
      createdBy: new ObjectId(createdBy),
      createdAt: new Date()
    })
    .then((result) => result.ops[0])

export const addRating = (collection: Collection<ItemDbObject>) => async (
  id: string | ObjectId,
  rating: Comment
) => {
  if (!ObjectId.isValid(id)) return null

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $push: { ratings: rating } },
    { returnOriginal: false }
  )

  if (result.ok && result.value) return result.value

  return null
}

export const factory = (db: Db) => {
  const collection = db.collection('items')

  return {
    findById: findById(collection),
    getAll: getAll(collection),
    create: create(collection),
    addRating: addRating(collection)
  }
}

export type ItemRepository = ReturnType<typeof factory>
