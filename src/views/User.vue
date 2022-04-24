<template>
  <q-scroll-area class="user-container">
    <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
      <q-card-section>
        <div class="text-overline">Basic Info</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section>Gender</q-item-section>
            <q-item-section side>{{ user.basicInfo.gender }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Birthday</q-item-section>
            <q-item-section side>{{ formatDate(user.basicInfo.birthday) }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Height</q-item-section>
            <q-item-section side>{{ `${user.basicInfo.height} cm` }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Weight</q-item-section>
            <q-item-section side>{{ `${user.basicInfo.weight} kg` }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

    </q-card>
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '../utils/time'

export default defineComponent({
  name: 'User',
  setup() {
    const store = useStore()
    return {
      user: computed(() => store.state.user),
      formatDate
    }
  }
})
</script>

<style lang="sass" scoped>
.user
  &-container
    height: calc(100vh - 64px)
</style>