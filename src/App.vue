<template>
  <router-view />
</template>

<script setup lang="ts">
  import {useWalletStore} from 'stores/wallet-store';

  const walletStore = useWalletStore();
  walletStore.checkMetamask();
</script>
