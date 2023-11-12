<script setup lang="ts">
import { Property } from 'components/models';

const rent = async () => {
  console.log('test');
};

interface Props {
  property?: Property;
}

const props = defineProps<Props>();
</script>

<template>
  <div v-if="props.property && props.property.isAvailable" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 overflow-auto">
    <q-card>
      <q-card-section horizontal>
        <q-card-section class="flex items-center">
          <q-icon name="category" />
          <div class="flex inline q-pl-xs">
            {{ props.property.sort }}
          </div>
        </q-card-section>

        <q-card-section class="flex items-center">
          <q-icon name="title" />
          <div class="flex inline q-pl-xs">
            {{ props.property.name }}
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-section class="flex items-center">
        <q-icon name="location_on" />
        <div class="flex inline q-pl-xs">
          {{ props.property.adres }}
        </div>
      </q-card-section>
      <q-card-section>{{ props.property.owner.slice(0, 6) }} ... {{ props.property.owner.slice(39, 42) }}</q-card-section>
      <q-card-actions class="justify-center">
        <q-btn label="Rent" class="full-width" no-caps color="positive" @click="rent" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped></style>
