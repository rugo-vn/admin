import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', {
  state:  () => ({
    info: [],
    isLoading: false
  }),
  
  actions: {
    setInfo(data){
      this.info = data;
    },

    setIsLoading(value){
      this.isLoading = value
    }
  }
})