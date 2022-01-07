import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    itemsProvisionales:[
      {
        titulo: "Everyday Of My Life",
        artista: "Third Party",
        bpm: 128,
        cover: "https://i.scdn.co/image/ab67616d00001e0240398a34052af7ebb29d6b84",
        button: false
      },
      {
        id: 2, 
        titulo: "Animals",
        artista: "Martin Garrix",
        bpm: 128,
        cover: "https://i.scdn.co/image/ab67616d00001e02eb6f61d93514dfe530616a68",
        button: false
      },
      {
        id: 3,
        titulo: "Don't You Worry Child",
        artista: "Swedish House Mafia",
        bpm: 125,
        cover: "https://i.scdn.co/image/ab67616d00001e029cfe80c0c05ce104f7bab18e",
        button: false
      }
    ],
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
