import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    usuario: "",
    setupFinalizado: null
  },
  mutations: {
    cambiarUsuario(state, payload){
      state.usuario = payload;
    },
    finalizarSetup(state){
      state.setupFinalizado = true;
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getUsuario(state){
      return state.usuario;
    },
    getSetup(state){
      return state.setupFinalizado;
    }
  }
})
