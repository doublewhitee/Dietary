<template>
<div class="diet-analysis-container" ref="containerRef">
  <q-scroll-area class="fit">
    <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
      <q-card-section>
        <div class="text-overline">Calories Analysis</div>
        <div class="row items-center">
          <div
            class="col-12"
            :style="`height: 200px; 
              width: ${containerRef ? containerRef.offsetWidth - 64 + 'px' : '100%'}`"
          >
            <v-chart :option="caloriesOption" ref="calorieRef" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
      <q-card-section>
        <div class="text-overline">Three Major Nutrients</div>
        <div
            class="col-12"
            :style="`height: 80px; 
              width: ${containerRef ? containerRef.offsetWidth - 64 + 'px' : '100%'}`"
          >
          <v-chart :option="majorOption" ref="majorRef" />
        </div>
        <div class="col-12 q-px-lg">
          <div v-for="item in state.majorRecommend" :key="item._id" class="q-ma-md">
            <div class="text-caption col-12 q-mb-sm">
              <span class="text-weight-bold q-mr-md">{{ item.name.substring(0, item.name.length - 5) }}</span>
              {{ `${(item.value / 100).toFixed(2)}g, 
              ${Math.floor(item.value / item.recommend * 100)}% of target (${(item.recommend / 100).toFixed(0)} g)` }}
            </div>
            <q-linear-progress
              size="md"
              rounded
              :value="item.value / item.recommend"
              :color="Math.floor(item.value / item.recommend * 100) > 100 ? 'orange' : 'primary'"
            />
          </div>
        </div>
      </q-card-section>
      </q-card>

    <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
      <q-card-section>
        <div class="text-overline">Nutrient Analysis</div>
        <q-tabs
          v-model="activeTab"
          dense
          narrow-indicator
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="radar" label="Radar" />
          <q-tab name="table" label="Table" />
          <q-tab name="analysis" label="Analysis" />
        </q-tabs>
        <q-separator />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row items-center" v-if="activeTab === 'radar'">
          <div
            class="col-12"
            :style="`height: ${$q.screen.gt.xs ? ' 300px' : '200px'}; 
              width: ${containerRef ? containerRef.offsetWidth - 64 + 'px' : '100%'}`"
            v-if="nutrient.data.length > 0"
          >
            <v-chart :option="nutrientOption" ref="nutrientRef" />
          </div>
        </div>
        <div v-else-if="activeTab === 'table'">
          <q-table
            :columns="[
              {
                name: 'name',
                required: true,
                label: 'Nutrient',
                align: 'center',
                field: 'name'
              },
              {
                name: 'value',
                required: true,
                label: 'Value',
                align: 'center',
                field: 'value',
                sortable: true,
                sort: (a, b) => a - b,
                format: val => `${val.toFixed(1)}`
              }
            ]"
            :rows="nutrient.data"
            row-key="name"
          />
        </div>

        <div v-else>
          <div class="col-12 q-px-lg">
            <div v-for="item in state.otherRecommend" :key="item._id" class="q-ma-md">
              <div class="text-caption col-12 q-mb-sm">
                <span class="text-weight-bold q-mr-md">{{ item.name.substring(0, item.name.length - 5) }}</span>
                {{ `${item.recommend >= 1000 ? (item.value / 100).toFixed(2) + ' g' : item.value.toFixed(2) + ' mg'}, ${Math.floor(item.value / item.recommend * 100)}% 
                of target (${item.recommend >= 1000 ? (item.recommend / 100).toFixed(0) + ' g' : item.recommend + ' mg'})` }}
              </div>
              <q-linear-progress
                size="md"
                rounded
                :value="item.value / item.recommend"
                :color="Math.floor(item.value / item.recommend * 100) > 100 ? 'orange' : 'primary'"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

  </q-scroll-area>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { throttle, useQuasar } from 'quasar'

import { getRecommendInfo } from '../request/recommend'

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
  nutrition: {
    name: string
    value: number
  }[]
}

interface Recommend {
  _id: string
  name: string
  recommend: number
  value: number
}

export default defineComponent({
  name: 'DietAnalysis',
  setup() {
    const store = useStore()
    const router = useRouter()
    const $q = useQuasar()
    const calcCart = computed(() => store.state.calcCart)
    const user = computed(() => store.state.user)

    // mounted
    onMounted(async () => {
      if (calcCart.value.Breakfast.length === 0 && calcCart.value.Lunch.length === 0 && calcCart.value.Dinner.length === 0) {
        router.go(-1)
      } else {
        const now = new Date()
        const age = Math.ceil(now.getFullYear() - user.value.basicInfo.birthday.getFullYear())
        const { data } = await getRecommendInfo(age, user.value.basicInfo.gender)
        // recommend info length should be 1
        if (data.length === 1) {
          const info = data[0].nutrition
          const majorData = major.value
          const nutrientData = nutrient.value.data
          for (let i = 0; i < info.length; i++) {
            if (info[i].name === 'Fat (mg)' || info[i].name === 'Protein (mg)' || info[i].name === 'Carbohydrate (mg)') {
              state.majorRecommend.push({ _id: info[i]._id, name: info[i].name, recommend: info[i].value, value: majorData[i].data[0] })
            } else {
              state.otherRecommend.push({ _id: info[i]._id, name: info[i].name, recommend: info[i].value, value: 0 })
              // find nutrient
              nutrientData.some((k: any) => {
                if (k.name === info[i].name) {
                  state.otherRecommend[state.otherRecommend.length - 1].value = k.value
                  return true
                }
                return false
              })
            }
          }
          // sort
          state.otherRecommend.sort((a, b) => Math.floor(b.value / b.recommend * 100) - Math.floor(a.value / a.recommend * 100))
        } else {
          $q.notify({
            message: 'Get recommendation data error!',
            position: 'top'
          })
        }
      }
    })

    // recommend data
    const state = reactive({
      majorRecommend: [] as Recommend[],
      otherRecommend: [] as Recommend[]
    })

    // container ref
    const containerRef = ref()

    // meal calories analysis
    const meals = computed(() => {
      const res = { Breakfast: 0, Lunch: 0, Dinner: 0 }
      for (let i of Object.keys(res)) {
        calcCart.value[i].forEach((info: ItemInfo) => {
          res[i as 'Breakfast' | 'Lunch' | 'Dinner'] += Math.floor(info.calorie * info.count)
        })
      }
      return res
    })

    // calories analysis chart
    const calorieRef = ref()
    const caloriesOption = reactive({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Meal',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false
          },
          data: [
            { value: meals.value.Breakfast, name: 'Breakfast' },
            { value: meals.value.Lunch, name: 'Lunch' },
            { value: meals.value.Dinner, name: 'Dinner' },
          ]
        }
      ]
    })

    // three major nutrients
    const major = computed(() => {
      const res = []
      const nutrientData: any = {}
      for (let i of ['Breakfast', 'Lunch', 'Dinner']) {
        calcCart.value[i].forEach((info: ItemInfo) => {
          info.nutrition.forEach(item => {
            // 3 major
            if (item.name === 'Carbohydrate (mg)' || item.name === 'Fat (mg)' || item.name === 'Protein (mg)') {
              if (!nutrientData[item.name]) nutrientData[item.name] = 0
              nutrientData[item.name] += Math.floor(item.value * info.count)
            }
          })
        })
      }
      for (let i of Object.keys(nutrientData)) {
        res.push({
          name: i,
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          barWidth: 30,
          data: [nutrientData[i]],
          itemStyle: {
            barBorderRadius: [0, 0, 0, 0]
          }
        })
      }

      if (res[0]) {
        res[0].itemStyle.barBorderRadius[0] = 20
        res[0].itemStyle.barBorderRadius[3] = 20
      }
      if (res.length > 0) {
        res[res.length - 1].itemStyle.barBorderRadius[1] = 20
        res[res.length - 1].itemStyle.barBorderRadius[2] = 20
      }
      
      return res
    })

    const majorRef = ref()
    const majorOption = reactive({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {
        bottom: '0'
      },
      grid: {
        top: '35%'
      },
      xAxis: {
        show: false,
        max: 'dataMax'
      },
      yAxis: {
        data: ['Three Major Nutrients'],
        show: false
      },
      series: major.value
    })

    // tabs
    const activeTab = ref('radar')

    // nutrient analysis
    const nutrient = computed(() => {
      const data: any = {}
      const res = []
      const nutrientData: any = {}
      for (let i of ['Breakfast', 'Lunch', 'Dinner']) {
        calcCart.value[i].forEach((info: ItemInfo) => {
          info.nutrition.forEach(item => {
            // not 3 major
            if (item.name !== 'Carbohydrate (mg)' && item.name !== 'Fat (mg)' && item.name !== 'Protein (mg)') {
              if (!nutrientData[item.name]) nutrientData[item.name] = 0
              nutrientData[item.name] += item.value * info.count
            }
          })
        })
      }
      for (let key of Object.keys(nutrientData)) {
        res.push({ name: key, value: nutrientData[key] })
      }
      data.data = res.sort((a, b) => b.value - a.value)
      data.max = data.data[0] ? data.data[0].value : 0
      data.topTenValue = [] // top 6
      data.indicator = []
      for (let i = 0; i < Math.min(6, data.data.length); i++) {
        data.topTenValue.push(data.data[i].value.toFixed(1))
        // radar max value
        data.indicator.push({ name: data.data[i].name, max: Math.ceil((data.max + 10) / 10) * 10 })
      }
      return data
    })

    // radar chart
    const nutrientRef = ref()
    const nutrientOption = {
      color: ['#689f38'],
      radar: {
        indicator: nutrient.value.indicator
      },
      tooltip: {
        trigger: 'item',
        position: 'top'
      },
      series: [
        {
          type: 'radar',
          name: 'nutrient',
          data: [
            {
              value: nutrient.value.topTenValue,
              areaStyle: {
                color: '#689f38'
              },
            },
          ]
        }
      ]
    }

    // echart resize
    const resize = throttle(() => {
      setTimeout(() => {
        if (calorieRef && calorieRef.value) {
          calorieRef.value.resize()
        }
        if (majorRef && majorRef.value) {
          majorRef.value.resize()
        }
        if (nutrientRef && nutrientRef.value) {
          nutrientRef.value.resize()
        }
      }, 500)
    }, 200)
    window.addEventListener('resize', resize)

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize)
    })

    return {
      containerRef,
      state,
      meals,
      caloriesOption,
      calorieRef,
      major,
      majorRef,
      majorOption,
      activeTab,
      nutrient,
      nutrientOption,
      nutrientRef
    }
  }
})
</script>

<style lang="sass" scoped>
.diet-analysis
  &-container
    height: calc(100vh - 64px)
</style>