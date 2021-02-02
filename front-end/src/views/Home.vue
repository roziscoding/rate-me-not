<template>
  <div class="home">
    <div v-if="loading">Loading...</div>
    <div v-if="items && items.length">
      <h1>Items</h1>
      <ul>
        <li v-for="item of items" :key="item.id">
          Title: {{ item.title }}<br />
          Description: {{ item.description }}<br />
          Rating: {{ item.rating }}<br />
          Rated {{ item.ratingsCount }} times<br />
          <router-link :to="{ name: 'viewItem', params: { id: item.id } }">
            See ratings
          </router-link>
          <br /><br />
        </li>
      </ul>
    </div>
  </div>
  <hr />
  <create-item-form />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import CreateItemForm from '@/components/CreateItemForm.vue'

export const ITEMS_QUERY = gql`
  query loadAllItems {
    items: getItems {
      id
      title
      description
      rating
      ratingsCount
    }
  }
`

export default defineComponent({
  name: 'Home',
  components: {
    CreateItemForm
  },
  setup() {
    const { result, loading } = useQuery(ITEMS_QUERY, { id: null })

    const items = useResult(result, null, data => data.items)

    return {
      items,
      loading
    }
  }
})
</script>
