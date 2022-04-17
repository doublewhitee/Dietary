<template>
  <q-layout view="hHh lpR fFf" :class="isDarkMode ? 'bg-grey-9 App' : 'bg-grey-1 App'">
    <q-header
      elevated
      :class="isDarkMode ? 'bg-grey-10 text-light-green-4' : 'bg-white text-light-green-8'"
      height-hint="64"
    >
      <q-toolbar class="App-toolbar">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
          <span class="q-ml-sm">Logo</span>
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row no-wrap">
          <q-toggle
            v-model="isDarkMode"
            checked-icon="dark_mode"
            color="light-green"
            unchecked-icon="light_mode"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :class="isDarkMode ? 'bg-grey-9' : 'bg-white'"
      :width="280"
      :breakpoint="800"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-item
            v-ripple
            v-for="link in links1"
            :key="link.text"
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      Content
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Layout',
  setup () {
    const $q = useQuasar()
    // left drawer toggle
    const leftDrawerOpen = ref(false)
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    // set dark mode
    const isDarkMode = ref($q.dark.isActive)
    watch(isDarkMode, val => {
      $q.dark.toggle()
    })

    return {
      leftDrawerOpen,
      isDarkMode,
      toggleLeftDrawer,
      links1: [
        { icon: 'web', text: 'Menu' },
        { icon: 'web', text: 'Menu' },
        { icon: 'web', text: 'Menu' },
        { icon: 'web', text: 'Menu' }
      ]
    }
  }
})
</script>

<style lang="sass" scoped>
.App
  &-toolbar
    height: 64px
</style>
