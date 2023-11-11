<script setup>
import { connectWallet } from 'src/helpers/walletFunctions';

const buttons = [
  {
    link: 'home',
    label: 'Home',
  },
  {
    link: 'properties',
    label: 'Properties',
  },
  {
    link: 'profile',
    label: 'Profile',
  },
];
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary q-pa-md">
      <q-toolbar>
        <q-toolbar-title class="text-black"> header</q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm">
          <q-btn
            v-for="button in buttons"
            no-wrap
            :key="button"
            :label="button.label"
            :to="button.link"
            outline
            flat
            :ripple="false"
            text-color="black"
            color="red"
            no-caps
            rounded
          />
          <q-btn @click="connectWallet" no-caps no-wrap rounded push :ripple="false" label="Connect Wallet" color="pink-5" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
