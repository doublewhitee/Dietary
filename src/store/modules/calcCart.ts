import { Commit } from "vuex";

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
}

interface State {
  date: Date
  Breakfast: ItemInfo[]
  Lunch: ItemInfo[]
  Dinner: ItemInfo[]
  Sport: ItemInfo[]
}

interface EditCartPayload {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Sport'
  data: ItemInfo
}

const state: State = {
  date: new Date(),
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Sport: []
}

const mutations = {
  ADD_CART (state: State, payload: EditCartPayload) {
    state[payload.type].some((i, index) => {
      if (i._id === payload.data._id) {
        state[payload.type].splice(index, 1)
        return true
      }
      return false
    })
    if (payload.data.count > 0) {
      state[payload.type].unshift(payload.data)
    }
  },
  DELETE_CART (state: State, payload: EditCartPayload) {
    state[payload.type].some((i, index) => {
      if (i._id === payload.data._id) {
        state[payload.type].splice(index, 1)
        return true
      }
      return false
    })
  }
}

const actions = {
  async ASYNC_ADD_CART({ commit }: { commit: Commit }, data: EditCartPayload) {
    commit('ADD_CART', data)
  },
  async ASYNC_DELETE_CART({ commit }: { commit: Commit }, data: EditCartPayload) {
    commit('DELETE_CART', data)
  }
}

export default {
  state,
  mutations,
  actions
}
