<template>
  Search
  <ItemList />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ItemList from '@components/ItemList.vue'

export default defineComponent({
  name: 'Search',
  components: {
    ItemList
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    onMounted(() => {
      if (!route.query || !route.query.type) {
        router.go(-1)
      }
    })
  }
})
</script>

<style lang="sass" scoped>

</style>