import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    currentUser: null,
    isUserLoggedIn: false
  },
  mutations: {
    setCurrentUser (state, currentUser) {
      state.currentUser = currentUser
      if (currentUser) {
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
      }
    }
  },
  actions: {
    setCurrentUser ({ commit }, currentUser) {
      commit('setCurrentUser', currentUser)
    }
  }
})
