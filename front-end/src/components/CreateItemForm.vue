<template>
  <div class="itemForm">
    <h2>Create new item</h2>
    <form>
      <label for="itemTitle">Title: </label>
      <input v-model="createItemInput.title" type="text" name="itemTitle" id="itemTitle" /><br />
      <label for="itemDescription">Description: </label>
      <input
        v-model="createItemInput.description"
        type="text"
        name="itemDescription"
        id="itemDescription"
      /><br />
      <button :disabled="loading" @click.prevent="mutate">Send</button>
      <div class="error" v-if="error">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ITEMS_QUERY } from '@/views/Home.vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, reactive } from 'vue'

const CREATE_ITEM_MUTATION = gql`
  mutation createNewItem($itemData: CreateItemInput!) {
    addItem(itemData: $itemData) {
      id
      title
      description
      rating
      ratingsCount
    }
  }
`

export default defineComponent({
  name: 'CreateItemForm',
  setup() {
    const createItemInput = reactive({
      title: '',
      description: ''
    })

    const { mutate, loading, error, onDone } = useMutation(CREATE_ITEM_MUTATION, () => ({
      variables: { itemData: createItemInput },
      update: (cache, { data: { addItem } }) => {
        const data = cache.readQuery<any, any>({ query: ITEMS_QUERY })
        cache.writeQuery({ query: ITEMS_QUERY, data: { items: [...data.items, addItem] } })
      }
    }))

    onDone(() => {
      createItemInput.title = ''
      createItemInput.description = ''
    })

    return {
      mutate,
      loading,
      error,
      createItemInput
    }
  }
})
</script>
