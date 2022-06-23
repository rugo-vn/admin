import { defineStore } from 'pinia'

export const useRelationStore = defineStore('relation', {
  state:  () => ({
    relations: {}
  }),
  
  actions: {
    update(ref, data){
      this.relations[ref] = {
        data,
        updatedAt: new Date()
      }
    }
  }
});