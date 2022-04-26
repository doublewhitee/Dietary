<template>
  <q-layout view="hHh lpR fFf" :class="isDarkMode ? 'bg-grey-9 App' : 'bg-grey-2 App'">
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
          <img src="@/assets/logo.png" alt="logo" class="App-logo">
          <span class="q-ml-sm">Dietary</span>
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
            v-for="link in mainLinks"
            :key="link.text"
            :active="RegExp(link.path).test(route.path)"
            @click="handleClickItem(link.path)"
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

          <q-item
            v-ripple
            v-for="link in otherLinks"
            :key="link.text"
            :active="RegExp(link.path).test(route.path)"
            @click="handleClickItem(link.path)"
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-scroll-area class="App-page-scroll">
        <router-view />
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'Layout',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
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

    // click q-list item
    const handleClickItem = (path: string) => {
      router.push({ path })
    }

    return {
      route,
      leftDrawerOpen,
      isDarkMode,
      toggleLeftDrawer,
      handleClickItem,
      mainLinks: [
        { icon: 'dashboard', text: 'Calorie Calculator', path: '/calc' },
        { icon: 'web', text: 'Food Calorie Search', path: '/category' },
        // todo
        // { icon: 'insights', text: 'Menu', path: '/calc' }
      ],
      otherLinks: [
        { icon: 'person', text: 'User Info', path: '/user' },
        { icon: 'lightbulb', text: 'About Us', path: '/about' }
      ]
    }
  }
})
</script>

<style lang="sass">
.App
  &-toolbar
    height: 64px
  &-logo
    height: 35px
    width: 35px
  &-page-scroll
    height: calc(100vh - 64px)

::selection
  background: $primary
  color: #FFF

#nprogress .bar
  z-index: 10000 !important
  background: $primary !important

#nprogress .spinner
  z-index: 10000 !important

#nprogress .spinner-icon
  border-top-color: $primary !important
  border-left-color: $primary !important
</style>
