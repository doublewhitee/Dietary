<template>
  <div :class="$q.dark.isActive ? 'calc-container text-grey-4' : 'calc-container text-grey-8'">
    <div class="calc-content">
      <q-scroll-area class="fit">
        <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
          <q-card-section>
            <div class="row justify-center items-center">
              <div class="col-3 calc-card-info">
                <div>Intake</div>
                <div class="calc-card-info-detail">{{ intake }}</div>
              </div>
              <q-circular-progress
                :value="target - intake + consumption >= 0 ?
                  Math.max(Math.floor((intake - consumption) / target * 100), 0) : 100"
                show-value
                size="90px"
                :thickness="0.2"
                :color="target - intake + consumption >= 0 ? 'light-green' : 'deep-orange'"
                track-color="grey-3"
                :class="target - intake + consumption >= 0 ?
                  'text-light-green q-ma-md col-4 col-md-3' :
                  'text-deep-orange q-ma-md col-4 col-md-3'"
                style="max-width: 180px"
              >
                <div :class="$q.dark.isActive ? 'col-12 calc-progress-text text-grey-4' : 'col-12 calc-progress-text text-grey-6'">
                  {{ target - intake + consumption >= 0 ? 'Remain' : 'Exceed' }}
                </div>
                <div class="row">
                  <div>{{ Math.abs(target - intake + consumption) }}</div>
                  <q-icon name="info" style="font-size: 14px">
                    <q-tooltip :offset="[10, 10]">
                      <div class="calc-tooltip">
                      <div class="calc-tooltip-title">Calorie Budget (kcal)</div>
                      <div class="calc-tooltip-number">{{ target }}</div>
                    </div>
                    </q-tooltip>
                  </q-icon>
                </div>
              </q-circular-progress>
              <div class="col-3 calc-card-info">
                <div>Consumption</div>
                <div class="calc-card-info-detail">{{ consumption }}</div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 text-right text-caption">
                In order to get more accurate data, click 
                <a class="calc-link text-light-green-8">here</a>
                to set your basic information
              </div>
            </div>
            
          </q-card-section>
        </q-card>

        <Empty v-if="calcCart.Breakfast.length === 0 &&
          calcCart.Lunch.length === 0 &&
          calcCart.Dinner.length === 0 &&
          calcCart.Sport.length === 0"
        />
        <div v-else>
          <q-card
            flat
            :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md q-py-md' : 'bg-white q-ma-md q-py-md'"
            v-if="calcCart.Breakfast.length !== 0 ||
              calcCart.Lunch.length !== 0 ||
              calcCart.Dinner.length !== 0"
          >
            <div v-for="type in ['Breakfast', 'Lunch', 'Dinner']" :key="type">
              <q-card-section
                style="padding: 0 16px"
                v-if="calcCart[type].length > 0"
              >
                <div class="text-overline">{{ type }}</div>
                  <q-list>
                    <q-item
                      clickable
                      v-ripple
                      v-for="item in calcCart[type]"
                      :key="item.name"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.name }}</q-item-label>
                        <q-item-label caption>{{ item.category.name }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-item-label caption>
                          {{ item.count + ' ' + item.unit }}
                        </q-item-label>
                        <q-item-label caption>
                          <span class="text-light-green-6">{{ Math.floor(item.calorie * item.count) + ' ' }}</span>kcal
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
              </q-card-section>
            </div>
          </q-card>

          <q-card
            flat
            :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md q-py-md' : 'bg-white q-ma-md q-py-md'"
            v-if="calcCart.Sport.length > 0"
          >
            <q-card-section style="padding: 0 16px">
              <div class="text-overline">Sport</div>
                <q-list>
                  <q-item
                    clickable
                    v-ripple
                    v-for="item in calcCart.Sport"
                    :key="item.name"
                  >
                    <q-item-section>
                      <q-item-label>{{ item.name }}</q-item-label>
                      <q-item-label caption>Sport</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label caption>
                        {{ item.count + ' min'}}
                      </q-item-label>
                      <q-item-label caption>
                        <!-- todo -->
                        <span class="text-light-green-6">{{ Math.floor(item.calorie * item.count) + ' ' }}</span>kcal
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
            </q-card-section>
          </q-card>
        </div>

        <div class="row justify-center q-my-md">
          <q-btn
            unelevated
            rounded
            color="primary"
            label="Diet Analysis"
            :disabled="calcCart.Breakfast.length === 0 &&
              calcCart.Lunch.length === 0 &&
              calcCart.Dinner.length === 0"
            @click="handleClickDietAnalysis"
          />
        </div>
      </q-scroll-area>
    </div>
    <BottomBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BottomBar from '@components/BottomBar.vue'
import Empty from '@components/Empty.vue'

interface ItemInfo {
  _id: string
  name: string
  count: number
  category?: {
    _id: string
    name: string
  }
  calorie: number
  unit?: string
}

export default defineComponent({
  name: 'Calc',
  components: {
    BottomBar,
    Empty
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const calcCart = computed(() => store.state.calcCart)
    // intake & consumption
    const intake = computed(() => {
      let res = 0
      for (let i of ['Breakfast', 'Lunch', 'Dinner']) {
        calcCart.value[i].forEach((info: ItemInfo) => {
          res += Math.floor(info.calorie * info.count)
        })
      }
      return res
    })

    const consumption = computed(() => {
      let res = 0
      calcCart.value.Sport.forEach((info: ItemInfo) => {
        // todo
        res += Math.floor(info.calorie * info.count)
      })
      return res
    })

    // target calories
    const target = ref(1000)
    // click Diet Analysis button
    const handleClickDietAnalysis = () => {
      router.push({ path: '/calc-analysis' })
    }

    return {
      calcCart,
      intake,
      consumption,
      target,
      handleClickDietAnalysis
    }
  }
})
</script>

<style lang="sass" scoped>
.calc
  &-container
    position: relative
    width: 100%
    height: calc(100vh - 64px)
  &-content
    height: calc(100vh - 64px - 61px)
    overflow: auto
  &-card-info
    text-align: center
    font-size: 18px
    &-detail
      font-weight: bold
      font-size: 30px
  &-progress-text
    font-size: 12px
    text-align: center
    margin-top: -20px
  &-tooltip
    text-align: center
    &-number
      font-size: 15px
      font-weight: bold
  &-info
    font-size: 12px
  &-link
    cursor: pointer
</style>