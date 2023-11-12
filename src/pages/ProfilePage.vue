<script setup lang="ts">
import PropertyCard from 'components/PropertyCard.vue';
import { createProperty, getProperty, getPropertyIds } from 'src/helpers/contractFunctions';
import { CreatePropertyInterface, Property } from 'components/models';
import { computed, onBeforeMount, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { usePropertiesStore } from 'stores/properties-store';
import { useWalletStore } from 'stores/wallet-store';

const propertiesStore = usePropertiesStore();
const userStore = useWalletStore();
const loading = ref(true);

const property = ref<CreatePropertyInterface>({
  name: '',
  sort: '',
  adres: '',
  price: 0,
});

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

const userProperties = computed(() => {
  return propertiesStore.properties.filter(
    (property: Property) => property.owner === userStore.User.address || property.hirer === userStore.User.address
  );
});

onBeforeRouteLeave(() => {
  propertiesStore.clearProperties();
});

const prompt = ref(false);

const propertyOptions = ref(['House', 'Workplace']);
const isNameValid = computed(() => {
  return property.value.name.length > 4;
});

const isSortValid = computed(() => {
  return property.value.sort;
});

const isAddressValid = computed(() => {
  return property.value.adres.length > 4;
});

const isPriceValid = computed(() => {
  return property.value.price > 4;
});

const isValid = computed(() => {
  return isNameValid.value && isSortValid.value && isAddressValid.value && isPriceValid.value;
});

const clearData = () => {
  (property.value.name = ''), (property.value.sort = ''), (property.value.adres = ''), (property.value.price = 0);
};

const closeModal = () => {
  clearData();
  prompt.value = false;
};

const create = async () => {
  await createProperty(property.value.name, property.value.sort, property.value.adres, property.value.price);
  prompt.value = false;
};
</script>

<template>
  <q-page padding class="row q-col-gutter-sm wrap justify-start items-start content-start">
    <PropertyCard v-for="property in userProperties" :key="property" :property="property" />
    <q-page-sticky position="bottom-right" :offset="[29, 18]">
      <q-btn fab icon="add" color="accent" size="sm" @click="prompt = true" />
    </q-page-sticky>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Property data</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input :error="!isNameValid" error-message="Property name is mandatory" label="Property name" v-model="property.name" autofocus />
          <q-select
            :error="!isSortValid"
            error-message="Property sort is mandatory"
            label="Property sort"
            v-model="property.sort"
            :options="propertyOptions"
          />
          <q-input :error="!isAddressValid" error-message="Property address is mandatory" label="Property address" v-model="property.adres" />
          <q-input :error="!isPriceValid" error-message="Property price is mandatory" label="Rent price" v-model="property.price" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat no-caps label="Cancel" @click="closeModal" />
          <q-btn :disable="!isValid" flat no-caps label="Add property" v-close-popup @click="create" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
