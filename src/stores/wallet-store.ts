import { defineStore } from 'pinia'
import {reactive} from 'vue';

export const useWalletStore = defineStore('wallet-store', () => {

  const User = reactive({
    address: "",

  })
  function checkMetamask () {
    window.ethereum.on('accountsChanged', () => {
      console.log("address changed")
    });
  }
  return {checkMetamask}
})
