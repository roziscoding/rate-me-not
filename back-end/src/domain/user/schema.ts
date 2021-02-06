import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type User @entity {
    id: ID! @id
    email: String! @column
    username: String! @column
    password: String! @column
  }

  input CreateUserInput {
    email: String!
    username: String!
    password: String!
  }

  extend type Mutation {
    signup(userData: CreateUserInput!): Boolean!
  }

  extend type Query {
    login(username: String!, password: String!): String!
    renew(token: String!): String!
  }
`
