<script setup lang="ts">
import PropertyCard from 'components/PropertyCard.vue';
import { computed, onBeforeMount, ref } from 'vue';
import { Property } from 'components/models';
import { getProperty, getPropertyIds } from 'src/helpers/contractFunctions';
import { usePropertiesStore } from 'stores/properties-store';
import { onBeforeRouteLeave } from 'vue-router';

const propertiesStore = usePropertiesStore();
const loading = ref(true);

onBeforeMount(async () => {
  propertiesStore.clearProperties();
  await getPropertyIds()
    .then(async (propertyIds) => {
      for (let i = 0; i < propertyIds.length; ++i) {
        await getProperty(propertyIds[i]);
      }
    })
    .catch((e) => new Error(e))
    .finally(() => {
      loading.value = false;
    });
});

onBeforeRouteLeave(() => {
  propertiesStore.clearProperties();
});

const properties = computed(() => {
  return propertiesStore.properties;
});
</script>

<template>
  <q-page v-if="loading" padding>
    <div class="fixed-center">
      <q-spinner-bars size="xl" color="accent" />
    </div>
  </q-page>
  <q-page v-else padding>
    <div class="row q-col-gutter-sm wrap justify-start items-start content-start">
      <PropertyCard v-for="property in properties" :key="property" :property="property.isAvailable ? property : undefined" />
    </div>
  </q-page>
</template>
