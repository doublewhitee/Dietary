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
                <q-item-label caption>{{ item.category ? item.category.name : 'Sport' }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>
                  <span class="text-light-green-6">
                    <!-- todo: Add kg -->
                    {{ item.category ? Math.floor(item.calorie * 100) : Math.floor(item.calorie * 60) }}
                  </span>
                  kcal /{{ item.unit ? ' 100 ' + item.unit : ' hour' }}
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
        <q-btn dense round flat icon="shopping_bag" @click="cartVisible = true">
          <q-badge v-if="calcCart[route.query.type].length > 0" floating>
            {{ calcCart[route.query.type].length }}
          </q-badge>
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

  <q-dialog v-model="dialogVisible">
    <q-card  style="width: 500px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ state.dialogInfo.name }}
          <q-badge align="middle" v-if="state.dialogInfo.category">
            {{ state.dialogInfo.category.name }}
          </q-badge>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span class="text-light-green-6">
          <!-- todo: Add kg -->
          {{ state.dialogInfo.unit ? Math.floor(state.dialogInfo.calorie * 100) : Math.floor(state.dialogInfo.calorie * 60) }}
        </span>{{ state.dialogInfo.unit ? ` kcal / 100 ${state.dialogInfo.unit}` : ` kcal / hour` }}
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
          :suffix="state.dialogInfo.unit ? state.dialogInfo.unit : 'min'"
          :rules="state.dialogInfo.unit ?
            [ val => val < 9999 || 'The value must less than 10000'] :
            [val => val < 999 || 'The value must less than 1000']"
          style="width: 100%;"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" @click="handleCloseDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="cartVisible">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ route.query.type }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-scroll-area style="height: 340px">
          <div
            v-if="calcCart[route.query.type].length === 0"
            class="row justify-center items-center"
            style="height: 300px"
          >
            <Empty />
          </div>
          <q-list>
            <q-item
              clickable
              v-ripple
              v-for="item in calcCart[route.query.type]"
              :key="item.name"
            >
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>
                  {{ item.count + ' '}} {{ item.unit ? item.unit : 'min' }}
                </q-item-label>
                <q-item-label caption>
                  <span class="text-light-green-6">
                    <!-- todo -->
                    {{ Math.floor(item.calorie * item.count) + ' ' }}
                  </span>kcal
                </q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="row justify-end">
                  <q-btn
                    flat
                    label="Edit"
                    class="col-5 col-md-3"
                    size="xs"
                    @click="handleClickItem(item)"
                  />
                  <q-btn
                    flat
                    label="Delete"
                    class="col-5 col-md-3"
                    size="xs"
                    text-color="red-5"
                    @click="handleDeleteCart(item)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import Empty from '@components/Empty.vue'

import { getFoodInfo } from '../request/food'
import { getSportInfo } from '../request/sport'

interface ItemInfo {
  _id: string
  name: string
  count?: number
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
    const store = useStore()
    const $q = useQuasar()

    const calcCart = computed(() => store.state.calcCart)

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
          const res = await getSportInfo(keyword, page)
          if (res) {
            if (res.data.length < 20) {
              isLoadedAll.value = true
            }
            state.dataList.push(...res.data)
          }
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
      // add count
      itemInputNumber.value = 0
      calcCart.value[route.query.type as string].some((k: ItemInfo) => {
        if (k._id === state.dialogInfo._id) {
          itemInputNumber.value = k.count ? k.count : 0 
          return true
        }
        return false
      })
    }
    
    const handleCloseDialog = () => {
      // validate
      if (dialogInputRef.value.validate()) {
        dialogVisible.value = false
        if (state.dialogInfo.count || itemInputNumber.value > 0) {
          store.dispatch('ASYNC_ADD_CART', {
            type: route.query.type,
            data: { ...state.dialogInfo, count: itemInputNumber.value }
          })
        }
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

    // cart dialog visible
    const cartVisible = ref(false)
    const handleDeleteCart = (item: ItemInfo) => {
      $q.dialog({
        title: 'Confirm',
        message: `Are you sure to delete ${item.name}?`,
        cancel: true,
      }).onOk(() => {
        store.dispatch('ASYNC_DELETE_CART', {
          type: route.query.type,
          data: item
        })
      })
    }

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
      itemInputNumber,
      cartVisible,
      calcCart,
      handleDeleteCart
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