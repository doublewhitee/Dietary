<template>
  <div :class="
    $q.dark.isActive ?
    'bottom-bar bg-grey-9 row justify-center items-center' :
    'bottom-bar bg-white row justify-center items-center'"
    :style="$q.dark.isActive ?
    'border-top: 1px solid rgba(255, 255, 255, 0.28)' :
    'border-top: 1px solid rgba(0, 0, 0, 0.12)'"
  >
    <div
      v-for="item in menuList"
      :key="item.text"
      class="bottom-bar-items col-3"
      @click="handleClickItem(item.text)"
    >
      <q-icon :name="item.icon" size="sm" />
      <div>{{ item.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'BottomBar',
  setup() {
    const router = useRouter()
    const handleClickItem = (text: string) => {
      router.push({ path: '/calc-search', query: { type: text } })
    }
    return {
      menuList: [
        { icon: 'breakfast_dining', text: 'Breakfast' },
        { icon: 'lunch_dining', text: 'Lunch' },
        { icon: 'dinner_dining', text: 'Dinner' },
        { icon: 'directions_run', text: 'Sport' }
      ],
      handleClickItem
    }
  }
})
</script>

<style lang="sass">
.bottom-bar
  height: 60px
  width: 100%
  position: absolute
  bottom: 0
  right: 0
  &-items
    text-align: center
    cursor: pointer
  &-items:hover
    color: #689f38
</style>