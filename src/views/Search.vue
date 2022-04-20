<template>
  <div :class="$q.dark.isActive ? 'text-grey-4' : 'bg-white text-grey-8'">
    <q-input
      outlined
      v-model="keyword"
      :label="`Search ${route.query.type}`"
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
                  <span class="text-light-green-6">{{ parseInt(item.calorie * 100) }}</span>
                  kcal / 100{{ item.unit }}
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

    <div
      class="search-footer row justify-center items-center q-px-md"
      :style="$q.dark.isActive ?
        'border-top: 1px solid rgba(255, 255, 255, 0.28)' :
        'border-top: 1px solid rgba(0, 0, 0, 0.12)'"
    >
      <div class="col-2">
        <q-btn dense round flat icon="shopping_bag">
          <q-badge floating>4</q-badge>
        </q-btn>
      </div>
      <div class="col-10">
        <q-btn
          unelevated
          rounded
          color="primary"
          label="Done"
          style="width: 90%"
          @click="handleClickDone"
        />
      </div>
    </div>
  </div>

  <q-dialog v-model="dialogVisible" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ state.dialogInfo.name }}
          <q-badge align="middle" v-if="state.dialogInfo.category">
            {{ state.dialogInfo.category.name }}
          </q-badge>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span class="text-light-green-6">
          {{ parseInt(state.dialogInfo.calorie * 100) }}
        </span>{{ ` kcal / 100 ${state.dialogInfo.unit}` }}
      </q-card-section>

      <q-card-section>
        <q-input
          ref="dialogInputRef"
          v-model.number="itemInputNumber"
          outlined
          min="0"
          max="9999"
          mask="#"
          fill-mask="0"
          reverse-fill-mask
          :suffix="state.dialogInfo.unit"
          :rules="[ val => val < 9999 || 'The value must less than 10000']"
          style="width: 300px"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" @click="handleCloseDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Empty from '@components/Empty.vue'

import { getFoodInfo } from '../request/food'

interface ItemInfo {
  _id: string
  name: string
  category?: {
    _id: string
    name: string
  }
  calorie: number
  unit?: string
}

export default defineComponent({
  name: 'Search',
  components: {
    Empty
  },
  setup() {
    onMounted(async () => {
      if (!route.query ||
        !route.query.type ||
        !['Breakfast', 'Lunch', 'Dinner', 'Sport'].includes(route.query.type as string)) {
        router.go(-1)
      }
    })

    const router = useRouter()
    const route = useRoute()

    const isLoadedAll = ref(false)
    const state = reactive({
      dataList: [] as ItemInfo[],
      dialogInfo: {
        _id: '',
        name: '',
        calorie: 0
      } as ItemInfo
    })
    const scrollRef = ref()

    // keyword
    const keyword = ref('')
    watch(keyword, val => {
      // clear dataList, currentPage and reset isLoadedAll
      isLoadedAll.value = false
      state.dataList = []
      scrollRef.value.setIndex(1)
      scrollRef.value.resume()
      // search
      reqLoadData(1, val)
    })

    // mainly for ItemList component scroll
    const reqLoadData = async (page: number, keyword = '') => {
      if (!isLoadedAll.value) {
        if (route.query.type !== 'Sport') {
          // food data
          const res = await getFoodInfo(keyword, page)
          if (res) {
            if (res.data.length < 20) {
              isLoadedAll.value = true
            }
            state.dataList.push(...res.data)
          }
        } else {
          // sport data
          console.log('------')
          isLoadedAll.value = true
        }
      }
    }

    const onLoad = async (page: number, done: Function) => {
      await reqLoadData(page, keyword.value)
      done(isLoadedAll.value)
    }

    const handleClickDone = () => {
      router.push({ path: '/calc' })
    }

    // show dialog
    const dialogVisible = ref(false)

    const handleClickItem = (info: ItemInfo) => {
      state.dialogInfo = info
      dialogVisible.value = true
      itemInputNumber.value = 0
    }
    
    const handleCloseDialog = () => {
      if (dialogInputRef.value.validate()) {
        dialogVisible.value = false
      }
    }

    // dialog add input
    const dialogInputRef = ref()
    const itemInputNumber = ref(0)
    watch(itemInputNumber, val => {
      if (!val) {
        itemInputNumber.value = 0
      }
    })

    return {
      route,
      isLoadedAll,
      keyword,
      state,
      scrollRef,
      reqLoadData,
      onLoad,
      handleClickDone,
      dialogVisible,
      handleClickItem,
      handleCloseDialog,
      dialogInputRef,
      itemInputNumber
    }
  }
})
</script>

<style lang="sass" scoped>
.search
  &-container
    height: calc(100vh - 64px - 61px - 88px)
  &-footer
    height: 60px
    text-align: center
</style>