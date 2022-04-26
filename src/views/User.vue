<template>
  <q-card flat :class="$q.dark.isActive ? 'bg-grey-8 q-ma-md' : 'bg-white q-ma-md'">
    <q-card-section class="row justify-between items-center">
      <div class="text-overline">Basic Info</div>
      <q-btn @click="handleChangeBasicEdit(true)" v-if="!isBasicEditMode" color="primary" unelevated>Edit</q-btn>
      <div v-else>
        <q-btn class="q-mr-md" @click="handleChangeBasicEdit(false)" outline>Cancel</q-btn>
        <q-btn color="primary" unelevated @click="handleSaveBasicEdit">Save</q-btn>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list>
        <q-item>
          <q-item-section>Gender</q-item-section>
          <q-item-section side v-if="!isBasicEditMode">{{ user.basicInfo.gender }}</q-item-section>
          <q-item-section side v-else>
            <q-btn-toggle
              v-model="basicEditInfo.gender"
              class="btn-toggle"
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              :color="$q.dark.isActive ? 'bg-grey-8' : 'white'"
              text-color="primary"
              :options="[
                {label: 'male', value: 'male'},
                {label: 'female', value: 'female'}
              ]"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Birthday</q-item-section>
          <q-item-section side v-if="!isBasicEditMode">{{ formatDate(user.basicInfo.birthday) }}</q-item-section>
          <q-item-section side v-else>
            <q-input
              outlined
              ref="birthdayInputRef"
              v-model="basicEditInfo.birthday"
              mask="date"
              :rules="['date']"
              style="width: 100%; max-width: 200px"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="basicEditInfo.birthday"
                      :options="date => {
                        return date >= '1950/01/01' && date <= formatDate(new Date(), 'yyyy/MM/dd')
                      }"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Height</q-item-section>
          <q-item-section side v-if="!isBasicEditMode">{{ `${user.basicInfo.height} cm` }}</q-item-section>
          <q-item-section side v-else>
            <q-input
              ref="heightInputRef"
              v-model.number="basicEditInfo.height"
              outlined
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              suffix="cm"
              :rules="[val => val <= 220 || 'The value must less than 220',
                val => val >= 100 || 'The value must larger than 100']"
              style="width: 100%; max-width: 200px"
            />
          </q-item-section>
        </q-item>

        <q-item class="row items-center">
          <q-item-section>Weight</q-item-section>
          <q-item-section side v-if="!isBasicEditMode">{{ `${user.basicInfo.weight} kg` }}</q-item-section>
          <q-item-section side v-else>
            <q-input
              ref="weightInputRef"
              v-model.number="basicEditInfo.weight"
              outlined
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              suffix="kg"
              :rules="[val => val <= 300 || 'The value must less than 300',
                val => val >= 20 || 'The value must larger than 20']"
              style="width: 100%; max-width: 200px"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { formatDate } from '../utils/time'

interface BasicInfo {
  birthday: string
  height: number
  weight: number
  gender: 'male' | 'female'
}

export default defineComponent({
  name: 'User',
  setup() {
    const $q = useQuasar()
    const store = useStore()
    const user = computed(() => store.state.user)

    // basic info edit
    const isBasicEditMode = ref(false)
    const birthdayInputRef = ref()
    const heightInputRef = ref()
    const weightInputRef = ref()

    const basicEditInfo = reactive<BasicInfo>({
      birthday: '1990/01/01',
      height: 175,
      weight: 70,
      gender: 'male'
    })

    const handleChangeBasicEdit = (state: boolean) => {
      isBasicEditMode.value = state
      const keys = Object.keys(user.value.basicInfo) as Array<keyof BasicInfo>
      keys.map(i => {
        (basicEditInfo as any)[i] = user.value.basicInfo[i]
      })
      basicEditInfo.birthday = formatDate(user.value.basicInfo.birthday, 'yyyy/MM/dd')
    }

    const handleSaveBasicEdit = () => {
      if (birthdayInputRef.value.validate() && heightInputRef.value.validate() && weightInputRef.value.validate()) {
        store.dispatch('ASYNC_CHANGE_BASIC_INFO', basicEditInfo).then(() => {
          $q.notify({
            message: 'Update user basic info successfully!',
            position: 'top'
          })
          isBasicEditMode.value = false
        })
      } else {
        $q.notify({
          message: 'Input data is not valid!',
          position: 'top'
        })
      }
    }

    return {
      user,
      formatDate,
      isBasicEditMode,
      birthdayInputRef,
      heightInputRef,
      weightInputRef,
      basicEditInfo,
      handleChangeBasicEdit,
      handleSaveBasicEdit
    }
  }
})
</script>

<style lang="sass" scoped>
.btn-toggle
  border: 1px solid $primary
</style>