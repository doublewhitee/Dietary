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
        <div v-else>
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
      </q-card-section>
    </q-card>

  </q-scroll-area>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { throttle } from 'quasar'

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

export default defineComponent({
  name: 'DietAnalysis',
  setup() {
    const store = useStore()
    const router = useRouter()
    const calcCart = computed(() => store.state.calcCart)

    // mounted
    onMounted(() => {
      if (calcCart.value.Breakfast.length === 0 && calcCart.value.Lunch.length === 0 && calcCart.value.Dinner.length === 0) {
        router.go(-1)
      }
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
            if (!nutrientData[item.name]) nutrientData[item.name] = 0
            nutrientData[item.name] += item.value * info.count
          })
        })
      }
      for (let key of Object.keys(nutrientData)) {
        res.push({ name: key, value: nutrientData[key] })
      }
      data.data = res.sort((a, b) => b.value - a.value)
      data.topTenValue = []
      data.indicator = []
      for (let i = 0; i < Math.min(10, data.data.length); i++) {
        data.topTenValue.push(data.data[i].value.toFixed(1))
        // todo: the max?
        data.indicator.push({ name: data.data[i].name, max: Math.ceil((data.data[i].value + 10) / 10) * 10 })
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
        trigger: 'item'
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
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
        if (nutrientRef && nutrientRef.value) {
          // calorieRef.value.resize()
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
      meals,
      caloriesOption,
      calorieRef,
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