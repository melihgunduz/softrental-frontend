<script setup lang="ts">
import { Property } from 'components/models';
import { ref } from 'vue';
import { getEthereumContract } from 'src/helpers/contractFunctions';

const rent = async () => {
  console.log('test');
};

interface Props {
  property?: Property;
}

const props = defineProps<Props>();
</script>

<template>
  <div v-if="props.property" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 overflow-auto">
    <q-card>
      <q-card-section horizontal>
        <q-card-section>{{ props.property.isAvailable }}</q-card-section>
        <q-card-section>{{ props.property.id }}</q-card-section>
      </q-card-section>
      <q-card-section>{{ props.property.adres }}</q-card-section>
      <q-card-section>{{ props.property.name }}</q-card-section>
      <q-card-actions class="justify-center">
        <q-btn label="Rent" class="full-width" no-caps color="positive" @click="rent" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped></style>
