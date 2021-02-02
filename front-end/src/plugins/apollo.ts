import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { App } from 'vue'

export default {
  install(app: App, config: any) {
    // HTTP connection to the API
    const httpLink = createHttpLink({
      // You should use an absolute URL here
      uri: 'http://localhost:3000/graphql'
    })

    // Cache implementation
    const cache = new InMemoryCache()

    // Create the apollo client
    const apolloClient = new ApolloClient({
      link: httpLink,
      cache
    })

    app.provide(DefaultApolloClient, apolloClient)
  }
}
