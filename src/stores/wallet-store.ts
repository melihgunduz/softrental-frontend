import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useWalletStore = defineStore('wallet-store', () => {

  const User = ref({
    address: '',
    connected: false,
  })

  function setUser(walletAddress = '', connected = false) {
    User.value.address = walletAddress;
    User.value.connected = connected;
  }


  return {User,setUser}
})
