<script setup lang="ts">
import PropertyCard from 'components/PropertyCard.vue';
import { ref } from 'vue';
import { Property } from 'components/models';

const property = ref<Property>({
  owner: 'string',
  hirer: 'string',
  isAvailable: true,
  id: 1,
  adres: 'string',
  name: 'string',
  sort: 'string',
  end: 1,
  price: 1,
  start: 1,
  votes: 1,
});
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-sm wrap justify-start items-start content-start">
      <PropertyCard v-for="prop of 20" :key="prop" :property="property" />
    </div>
  </q-page>
</template>
