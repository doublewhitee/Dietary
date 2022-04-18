<template>
  <div :class="$q.dark.isActive ? 'calc-container text-grey-4' : 'calc-container text-grey-8'">
    <div class="calc-content">
      <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
        <q-card-section>
          <div class="row justify-center items-center">
            <div class="col-3 calc-card-info">
              <div>Intake</div>
              <div class="calc-card-info-detail">0</div>
            </div>
            <q-knob
              readonly
              v-model="calorieValue"
              show-value
              size="90px"
              :thickness="0.2"
              color="light-green"
              track-color="grey-4"
              class="text-light-green q-ma-md col-4 col-md-3"
            />
            <div class="col-3 calc-card-info">
              <div>Consumption</div>
              <div class="calc-card-info-detail">0</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <Empty />
      <div class="row justify-center q-my-md">
        <q-btn unelevated rounded color="primary" label="Diet Analysis" />
      </div>
    </div>
    <BottomBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BottomBar from '@components/BottomBar.vue'
import Empty from '@components/Empty.vue'

export default defineComponent({
  name: 'Calc',
  components: {
    BottomBar,
    Empty
  },
  setup() {
    const calorieValue = ref(10)
    return {
      calorieValue
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
</style>