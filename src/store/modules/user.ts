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

}

const actions = {

}

const getters = {
  getCalorieBudget: (state: State) => {
    // Harris-Benedict Equation
    let res = 0
    const now = new Date()
    const age = Math.ceil(now.getFullYear() - state.basicInfo.birthday.getFullYear())
    if (state.basicInfo.gender === 'male') {
      res = 66.5 + (13.75 * state.basicInfo.weight) + (5.003 * state.basicInfo.height) - (6.775 * age)
    } else {
      res = 655.1 + (9.563 * state.basicInfo.weight) + (1.85 * state.basicInfo.height) - (4.676 * age)
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
