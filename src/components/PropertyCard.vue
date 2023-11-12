<script setup lang="ts">
import { Property } from 'components/models';
import { getRentRequests, rent, sendRentRequest } from 'src/helpers/contractFunctions';
import { computed, ref } from 'vue';
import { useWalletStore } from 'stores/wallet-store';
import { usePropertiesStore } from 'stores/properties-store';

const userStore = useWalletStore();
const propertiesStore = usePropertiesStore();

interface Props {
  property?: Property;
}

const props = defineProps<Props>();

const requestsModal = ref(false);

const owner = computed(() => {
  return props.property?.owner === userStore.User.address;
});

const hirer = computed(() => {
  return props.property?.hirer === userStore.User.address;
});

const requests = computed(() => {
  return propertiesStore.propertyRequests;
});

const sendRequest = async () => {
  if (props.property?.id) {
    const id: string = props.property?.id.toString();
    await sendRentRequest(id)
      .then((val) => {
        console.log(val);
      })
      .catch((err) => {
        console.error(err.reason);
      });
  }
};

const getRequests = async () => {
  if (props.property?.id) {
    const id: string = props.property?.id.toString();
    await getRentRequests(id)
      .then((requests) => {
        propertiesStore.setPropertyRequests(requests);
        requestsModal.value = true;
      })
      .catch((err) => {
        console.error(err.reason);
      });
  }
};

const rentTo = ref<string>('');
const rentalTime = ref<number>(0);

const rentProperty = async () => {
  if (props.property?.id && typeof rentTo.value !== 'undefined' && typeof rentalTime.value !== 'undefined') {
    const id: string = props.property?.id.toString();
    await rent(id, rentTo.value, rentalTime.value).then(() => {
      requestsModal.value = false;
      rentTo.value = '';
      rentalTime.value = 0;
    });
  }
};
</script>

<template>
  <q-dialog v-model="requestsModal" persistent transition-show="fade" transition-hide="fade">
    <q-card class="bg-secondary">
      <q-card-section>
        <div class="text-h6">Rent requests for {{ props.property.name }}</div>
      </q-card-section>
      <!--users will chosen by option-->
      <q-card-section class="q-pt-none">
        <q-radio v-for="request in requests" :key="request" v-model="rentTo" :val="request" :label="request" color="positive" />
        <q-input type="number" label="Rental time as day" color="positive" v-model="rentalTime" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Cancel"
          no-caps
          flat
          :ripple="false"
          @click="
            requestsModal = false;
            rentTo = '';
            rentalTime = 0;
          "
          color="negative"
        />
        <q-btn label="Rent" no-caps flat :ripple="false" color="positive" @click="rentProperty" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div v-if="props.property" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 overflow-auto">
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
      <q-card-section>
        <q-icon name="person" />
        <div class="flex inline q-pl-xs">{{ props.property.owner.slice(0, 6) }}...{{ props.property.owner.slice(39, 42) }}</div>
      </q-card-section>
      <q-card-actions v-if="!props.property.isAvailable" :align="hirer || owner ? 'right' : 'center'">
        <q-badge v-if="!hirer && !owner" class="text-bold q-pa-sm q-ma-xs" label="Rented" rounded text-color="black" color="secondary" multi-line />
        <q-badge v-else class="text-bold q-pa-sm q-ma-xs" :label="owner ? 'Owner' : 'Hirer'" rounded text-color="black" color="accent" multi-line />
        <div v-if="hirer || owner">
          <q-btn label="Break" no-caps flat :ripple="false" color="negative" />
          <q-btn label="Create Complaint" no-caps flat :ripple="false" color="negative" />
        </div>
      </q-card-actions>
      <q-card-actions v-else-if="!owner" align="center">
        <q-btn label="Rent" class="full-width" no-caps color="positive" @click="sendRequest" />
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn label="Delete" no-caps flat :ripple="false" color="negative" />
        <q-btn label="Get rent requests" no-caps flat :ripple="false" color="positive" @click="getRequests" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped></style>
