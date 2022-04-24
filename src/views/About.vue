<template>
  <q-scroll-area class="about-container">
    <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
      <q-card-section horizontal>
        <q-card-section class="col-7 col-md-8">
          <div class="text-overline">About Dietary</div>
          <div class="text-body2 q-mx-md q-my-xs">
            Body 2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aliquid ad
             quas sunt voluptatum officia dolorum cumque, possimus nihil molestias sapiente necessitatibus
              dolor saepe inventore, soluta id accusantium voluptas beatae.
          </div>
        </q-card-section>

        <div class="col-5 col-md-4 self-center">
          <q-img
            src="@/assets/logo-with-word.png"
            :ratio="1"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
      <q-card-section>
        <div class="text-overline">Our Team</div>
        <div class="row justify-center items-center">
          <div v-for="member in teamInfo" :key="member.name" class="col-4 col-md-2 text-center q-my-sm">
            <q-avatar :color="member.color" text-color="white" size="60px">
              {{ member.avatar }}
              <q-tooltip anchor="top middle" self="bottom middle">
                {{ member.mail }}
              </q-tooltip>
            </q-avatar>
            <div class="text-weight-bold q-mt-sm">{{ member.name }}</div>
            <div class="text-caption">{{ member.work }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'About',
  setup() {
    return {
      teamInfo: [
        { name: 'Zhuo Chen', avatar: 'ZC', work: 'Developer', mail: 'zc13n21@soton.ac.uk', color: 'primary' },
        { name: 'Haoran Yang', avatar: 'HY', work: 'UX designer', mail: 'hy10n21@soton.ac.uk', color: 'light-green' },
        { name: 'Yichen Li', avatar: 'YL', work: 'UX designer', mail: 'yl36g21@soton.ac.uk', color: 'lime' },
        { name: 'Qinchun Zhang', avatar: 'QZ', work: 'Researcher', mail: 'qz1n21@soton.ac.uk', color: 'green' },
        { name: 'Xiao Cheng', avatar: 'XC', work: 'Researcher', mail: 'xc1u20@soton.ac.uk', color: 'green-8' }
      ]
    }
  }
})
</script>

<style lang="sass" scoped>
.about
  &-container
    height: calc(100vh - 64px)
</style>