<template>
  <router-link :to="{ name: 'Home' }">Voltar</router-link>
  <div v-if="loading">Loading...</div>
  <div v-if="item">
    <h1>
      {{ item.title }}
    </h1>
    Description: {{ item.description }}<br />
    Rating: {{ item.rating.toFixed(2) }}<br />
    Rated {{ item.ratingsCount }} times<br />
    <br />
    <hr />
    <h2>
      Ratings
    </h2>
    <div class="rating" v-for="rating of item.ratings" :key="rating.createdAt">
      {{ rating.headline }}<br />
      {{ rating.text }} <br /><br />
      ---- <br /><br />
    </div>
    <div class="error" v-if="error">{{ error }}</div>
    <rate-item-form :id="id" />
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent } from 'vue'
import { getFullFormat } from '@roziscoding/format'
import RateItemForm from '@/components/RateItemForm.vue'

const format = getFullFormat({ locale: 'pt-BR' })

const GET_ITEM_QUERY = gql`
  query loadSpecificItem($id: String!) {
    item: getItems(id: $id) {
      id
      title
      description
      rating
      ratingsCount
      ratings {
        createdAt
        text
        rating
      }
    }
  }
`

export default defineComponent({
  name: 'Item',
  props: {
    id: String
  },
  components: {
    RateItemForm
  },
  setup(props) {
    const { result, loading, error } = useQuery(GET_ITEM_QUERY, props)

    const item = useResult(result, null, data => {
      const itemResult = data.item[0]

      return {
        ...itemResult,
        ratings: itemResult.ratings.map((rating: any) => ({
          ...rating,
          headline: format`${rating.rating} stars given on ${{
            date: new Date(rating.createdAt)
          }} at ${{ time: new Date(rating.createdAt) }}`
        }))
      }
    })

    return {
      item,
      loading,
      error,
      format
    }
  }
})
</script>
