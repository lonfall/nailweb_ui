import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * 要设置的全局访问的state对象
 */
const state = {
  pathList: []
}

const getters = {
  getPathList (state) {
    return state.pathList
  }
}

const mutations = {
  setPathList (state, pathList) {
    state.pathList = pathList
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default store
