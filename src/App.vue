<template>
  <router-view />
</template>

<script setup lang="ts">
import { useWalletStore } from 'stores/wallet-store';
import { ethers } from 'ethers';
import { checkNetwork, checkWalletIsConnected } from 'src/helpers/walletFunctions';
import { onMounted } from 'vue';

const walletStore = useWalletStore();

onMounted(() => {
  checkWalletIsConnected();
});

window.ethereum.on('accountsChanged', async (accounts: Array<string>) => {
  try {
    if (accounts.length !== 0) {
      const userAddress = ethers.getAddress(accounts[0]);
      walletStore.setUser(userAddress, true);
    } else {
      walletStore.setUser();
    }
  } catch (e) {
    throw new Error(e);
  }
});
window.ethereum.on('chainChanged', async (val: string) => {
  try {
    await checkNetwork();
  } catch (e) {
    throw new Error(e);
  }
});
</script>

<style>
main {
  background-color: #e1d7c0;
}
</style>
