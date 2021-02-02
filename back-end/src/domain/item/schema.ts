import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar Date

  """
  A comment and a rating
  left by an user
  """
  type Comment {
    createdAt: Date!
    text: String!
    rating: Float!
  }

  input CommentInput {
    text: String!
    rating: Float!
  }

  """
  An Item
  """
  type Item @entity {
    """
    HEX representation of the ObjectId
    """
    id: ID! @id
    title: String! @column
    description: String! @column
    """
    Latest average of all ratings
    """
    rating: Float!
    """
    List of all ratings received up until now
    """
    ratings: [Comment!]! @column
    ratingsCount: Int!
  }

  input CreateItemInput {
    title: String!
    description: String!
  }

  type Query {
    getItems(id: String): [Item!]!
  }

  type Mutation {
    addItem(itemData: CreateItemInput!): Item!
    rateItem(id: String!, rating: CommentInput!): Item!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
