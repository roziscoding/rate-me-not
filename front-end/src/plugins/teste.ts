import gql from 'graphql-tag'

gql`
  query {
    getItems {
      id
      title
    }
  }
`
