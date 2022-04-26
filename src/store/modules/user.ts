import { Commit } from "vuex";

interface State {
  isLogin: boolean
  userInfo: {
    firstName?: string
    lastName?: string
    _id?: string
    mail?: string
  }
  basicInfo: {
    birthday: Date
    height: number
    weight: number
    gender: 'male' | 'female'
  }
}

interface EditBaiscInfoPayload {
  birthday: Date | string
  height: number
  weight: number
  gender: 'male' | 'female'
}

const state: State = {
  isLogin: false,
  userInfo: {},
  basicInfo: {
    birthday: new Date(1990, 0, 1),
    height: 175, // cm
    weight: 70, // kg
    gender: 'male'
  }
}

const mutations = {
  CHANGE_BASIC_INFO(state: State, payload: EditBaiscInfoPayload) {
    state.basicInfo = { ...payload, birthday: new Date(payload.birthday) }
  }
}

const actions = {
  async ASYNC_CHANGE_BASIC_INFO({ commit }: { commit: Commit }, data: EditBaiscInfoPayload) {
    commit('CHANGE_BASIC_INFO', data)
  }
}

const getters = {
  getCalorieBudget: (state: State) => {
    // Harris-Benedict Equation
    let res = 0
    const now = new Date()
    const age = Math.ceil(now.getFullYear() - state.basicInfo.birthday.getFullYear())
    if (state.basicInfo.gender === 'male') {
      res = 1.2 * (66.5 + (13.75 * state.basicInfo.weight) + (5.003 * state.basicInfo.height) - (6.775 * age))
    } else {
      res = 1.2 * (655.1 + (9.563 * state.basicInfo.weight) + (1.85 * state.basicInfo.height) - (4.676 * age))
    }
    return Math.floor(res)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
