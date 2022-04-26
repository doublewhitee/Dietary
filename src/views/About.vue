<template>
  <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
    <q-card-section horizontal>
      <q-card-section class="col-xs-12 col-sm-7 col-md-8 col-lg-9">
        <div class="text-overline">About Dietary</div>
        <div class="text-body2 q-mx-md q-my-xs">
          <p>
            Dietary is a mobile and online sport and calorie tracker that helps people live healthier lives through better nutrition. 
            It shows daily calorie intake and consumption in easy-to-understand dashboard and sets nutrition goals scientifically based 
            on your situations. Dietary leads your health life journey with accurate calorie counting, food calorie searching and 
            personalized daily insights. You can view and compare the proportion distribution of your daily nutrition in DIET ANALYSIS.
          </p>
          <p>
            Dietary was founded in 2022 by a collective of creative minds based Southampton. We aim to use open health data to redesign 
            the way of our dietary and lifestyle. 
          </p>
        </div>
      </q-card-section>

      <div class="col-xs-0 col-sm-5 col-md-4 col-lg-3 self-center">
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
</style>