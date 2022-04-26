<template>
  <div class="row">
    <div v-for="item in dataList.cate" :key="item._id" class="col-6 col-md-4 col-lg-3 q-pa-sm">
      <q-card
        @click="handleClickCard(item._id)"
        :class="$q.dark.isActive ? 'bg-grey-8 cate-card' : 'bg-white cate-card'"
      >
        <q-card-section horizontal class="row">
          <q-card-section class="q-pt-xs col-10">
            <div class="text-overline">Category</div>
            <div class="text-subtitle2 q-mt-sm q-mb-xs">{{ item.name }}</div>
            <div class="text-caption text-grey">
              Dietary Food Category
            </div>
          </q-card-section>

          <div
            class="col-2 cate-card-side-div"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { getCategory } from '../request/food'

interface Datalist {
  cate: {
    _id: string
    name: string
  }[]
}

export default defineComponent({
  name: 'Category',
  setup() {
    const router = useRouter()
    // category list
    const dataList = reactive<Datalist>({
      cate: []
    })

    onMounted(async () => {
      const res = await getCategory()
      if (res) {
        dataList.cate = { ...res.data }
      }
    })

    const handleClickCard = (id: string) => {
      router.push({ path: '/category-search', query: { id }})
    }

    return {
      dataList,
      handleClickCard
    }
  }
})
</script>

<style lang="sass" scoped>
.cate
  &-card
    cursor: pointer
  &-card-side-div
    background-color: $primary
    opacity: .6
</style>