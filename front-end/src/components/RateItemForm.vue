<template>
  <div class="ratingForm">
    <hr />
    <h2>Rate it yourself</h2>
    <form>
      <label for="ratingRating">Rating: </label>
      <input
        type="number"
        max="5"
        min="1"
        step="0.1"
        name="ratingRating"
        id="ratingRating"
        v-model="commentInput.rating"
      /><br /><br />
      <label for="" form="ratingText">Comment:</label><br />
      <textarea
        name="ratingText"
        id="ratingText"
        cols="40"
        rows="3"
        v-model="commentInput.text"
      ></textarea>
      <br /><br />
      <button @click.prevent="mutate" :disabled="loading">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, reactive } from 'vue'

const RATE_ITEM_MUTATION = gql`
  mutation addItemRating($id: String!, $rating: CommentInput!) {
    rateItem(id: $id, rating: $rating) {
      id
      rating
      ratings {
        createdAt
        text
        rating
      }
    }
  }
`

export default defineComponent({
  name: 'RateItemForm',
  props: {
    id: String
  },
  setup(props) {
    const commentInput = reactive({
      rating: '5',
      text: ''
    })

    const { mutate, loading, error, onDone } = useMutation(RATE_ITEM_MUTATION, () => ({
      variables: {
        id: props.id,
        rating: { text: commentInput.text, rating: parseFloat(commentInput.rating) }
      }
    }))

    onDone(() => {
      commentInput.rating = ''
      commentInput.text = ''
    })

    return {
      commentInput,
      mutate,
      loading,
      error
    }
  }
})
</script>
