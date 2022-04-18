<template>
  <div class="empty">
    <q-icon :name="icon" size="xl" class="q-my-md" />
    <div class="empty-msg">{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Empty',
  props: {
    icon: {
      type: String,
      default: 'history'
    },
    message: {
      type: String,
      default: 'Oops! Nothing here.'
    }
  }
})
</script>

<style lang="sass" scoped>
.empty
  text-align: center
  &-msg
    font-size: 20px
</style>