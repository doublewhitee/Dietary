<template>
  <q-input
    outlined
    v-model="keyword"
    label="Food Calorie Search"
    debounce="500"
    class="q-pa-md"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>

  <div class="search-container">
    <q-scroll-area class="fit">
      <q-infinite-scroll @load="onLoad" :offset="50" ref="scrollRef">
        <q-list>
          <q-item
            clickable
            v-ripple
            v-for="item in state.dataList"
            :key="item.name"
            @click="handleClickItem(item)"
          >
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption>{{ item.category.name }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>
                <span class="text-light-green-6">
                  {{ Math.floor(item.calorie * 100) }}
                </span>
                kcal /{{ ' 100 ' + item.unit }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="isLoadedAll" class="row justify-center q-my-md" style="font-size: 12px">
          <Empty v-if="state.dataList.length === 0" />
          <div v-else>- end -</div>
        </div>

        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-scroll-area>
  </div>

  <q-dialog v-model="dialogVisible">
    <q-card style="width: 500px; max-width: 94vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ $q.screen.gt.xs ? state.dialogInfo.name : state.dialogInfo.name + '(100g serving)' }}
          <q-badge v-if="state.dialogInfo.category">
            {{ state.dialogInfo.category.name }}
          </q-badge>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-scroll-area class="dialog-scroll-area">
          <q-table
             v-if="$q.screen.gt.xs"
            :rows="rows"
            :columns="[
              {
                name: 'name',
                required: true,
                label: 'Food (100g serving)',
                align: 'center',
                field: row => row.name,
              },
              {
                name: 'value',
                required: true,
                label: 'Value',
                align: 'center',
                field: row => row.value,
                format: val => `${val.toFixed(1)}`,
                sortable: true,
                sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
              },
            ]"
            row-key="name"
            virtual-scroll
            :pagination="pagination"
            hide-bottom
          />

          <q-table
            v-else
            virtual-scroll
            :pagination="pagination"
            hide-bottom
            hide-header
            grid
            :bordered="false"
            flat
            :columns="xsCols"
            :rows="xsRows"
          />
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Empty from '@components/Empty.vue'

import { getFoodInfo } from '../request/food'
import { computed } from '@vue/reactivity'

interface FoodInfo {
  _id: string
  name: string
  category: {
    _id: string
    name: string
  }
  calorie: number
  unit: string
  nutrition: {
    _id: string
    name: string
    value: number
  }[]
}

interface State {
  dataList: FoodInfo[]
  dialogInfo: FoodInfo
}

interface Row {
  name: string
  value: number
}

export default defineComponent({
  name: 'FoodItem',
  components: {
    Empty
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    onMounted(() => {
      if (!route.query || !route.query.id) {
        router.go(-1)
      }
    })
    // keyword
    const keyword = ref('')
    watch(keyword, val => {
      // clear dataList, currentPage and reset isLoadedAll
      isLoadedAll.value = false
      state.dataList = []
      scrollRef.value.setIndex(1)
      scrollRef.value.resume()
      // search
      reqFoodList(val, 1, route.query.id as string)
    })

    // get food list
    const isLoadedAll = ref(false)
    const state = reactive<State>({
      dataList: [],
      dialogInfo: {
        _id: '',
        name: '',
        calorie: 0,
        category: { _id: '', name: '' },
        unit: 'g',
        nutrition: []
      }
    })
    const scrollRef = ref()

    const reqFoodList = async (keyword: string, page: number, category: string) => {
      if (!isLoadedAll.value) {
        const res = await getFoodInfo(keyword, page, category)
        if (res) {
          if (res.data.length < 20) {
            isLoadedAll.value = true
          }
          state.dataList.push(...res.data)
        }
      }
    }

    const onLoad = async (page: number, done: Function) => {
      await reqFoodList(keyword.value, page, route.query.id as string)
      done(isLoadedAll.value)
    }

    // click list item
    const dialogVisible = ref(false)
    const handleClickItem = (info: FoodInfo) => {
      state.dialogInfo = { ...info }
      dialogVisible.value = true
    }

    // table rows [$q.screen.gt.xs]
    const rows = computed(() => {
      const res: Row[] = []
      res.push({ name: 'Calories (kcal)', value: state.dialogInfo.calorie * 100 })
      for (let i of state.dialogInfo.nutrition) {
        res.push({ name: i.name, value: i.value * 100 })
      }
      return res
    })
    // v-else
    const xsCols = computed(() => {
      const res = [] as ({ name: string, label: string, field: string })[]
      res.push({ name: 'Calories (kcal)', label: 'Calories (kcal)', field: 'Calories (kcal)' })
      for (let i of state.dialogInfo.nutrition) {
        res.push({ name: i.name, label: i.name, field: i.name })
      }
      return res
    })
    const xsRows = computed(() => {
      const res: { [key: string]: string } = {}
      res['Calories (kcal)'] =  (state.dialogInfo.calorie * 100).toFixed(1)
      for (let i of state.dialogInfo.nutrition) {
        res[i.name] = (i.value * 100).toFixed(1)
      }
      return [res]
    })

    return {
      keyword,
      state,
      scrollRef,
      isLoadedAll,
      onLoad,
      dialogVisible,
      handleClickItem,
      rows,
      xsCols,
      xsRows,
      pagination: ref({
        rowsPerPage: 0
      })
    }
  }
})
</script>

<style lang="sass" scoped>
.search
  &-container
    height: calc(100vh - 64px - 88px)
.dialog-scroll-area
  height: 400px
</style>