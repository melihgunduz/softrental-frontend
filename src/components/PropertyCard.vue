<script setup lang="ts">
import { Property } from 'components/models';
import { breakAgreement, createComplaint, getRentRequests, propertyDelete, rent, sendRentRequest } from 'src/helpers/contractFunctions';
import { computed, ref } from 'vue';
import { useWalletStore } from 'stores/wallet-store';
import { usePropertiesStore } from 'stores/properties-store';
import { useQuasar } from 'quasar';

const userStore = useWalletStore();
const propertiesStore = usePropertiesStore();
const $q = useQuasar();

interface Props {
  property?: Property;
}

const props = defineProps<Props>();

const complaintModal = ref(false);
const requestsModal = ref(false);
const dialog = ref(false);

const owner = computed(() => {
  return props.property?.owner === userStore.User.address;
});

const hirer = computed(() => {
  return props.property?.hirer === userStore.User.address;
});

const requests = computed(() => {
  return propertiesStore.propertyRequests;
});

const rentTo = ref<string>('');
const rentalTime = ref<number>(0);

const complaintReason = ref<string>('');

const isComplaintReason = computed(() => {
  return complaintReason.value.length > 4;
});

const breakRenting = async () => {
  try {
    if (props.property?.id) {
      await breakAgreement(props.property?.id.toString())
        .then(() => {
          $q.notify({
            message: 'Break request sent',
            color: 'positive',
            position: 'top-right',
          });
        })
        .catch((e) => new Error(e));
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

const confirmComplaint = async () => {
  try {
    if (props.property?.id && isComplaintReason.value) {
      await createComplaint(props.property?.id.toString(), complaintReason.value, props.property?.owner === userStore.User.address)
        .then(() => {
          complaintModal.value = false;
          dialog.value = false;
          complaintReason.value = '';
          $q.notify({
            message: 'Complaint sent',
            color: 'positive',
            position: 'top-right',
          });
        })
        .catch((e) => new Error(e));
    }
  } catch (e) {}
};

const getRequests = async () => {
  if (props.property?.id) {
    const id: string = props.property?.id.toString();
    await getRentRequests(id)
      .then((requests) => {
        propertiesStore.setPropertyRequests(requests);
        requestsModal.value = true;
        dialog.value = true;
      })
      .catch((err) => {
        console.error(err.reason);
      });
  }
};
const sendRequest = async () => {
  if (props.property?.id) {
    const id: string = props.property?.id.toString();
    await sendRentRequest(id)
      .then(() => {
        $q.notify({
          message: 'Request sent to the property owner',
          color: 'positive',
          position: 'top-right',
        });
      })
      .catch((err) => {
        $q.notify({
          message: err.reason,
          color: 'negative',
          position: 'top-right',
        });
      });
  }
};

const rentProperty = async () => {
  if (props.property?.id && typeof rentTo.value !== 'undefined' && typeof rentalTime.value !== 'undefined') {
    const id: string = props.property?.id.toString();
    await rent(id, rentTo.value, rentalTime.value).then(() => {
      $q.notify({
        message: 'Rent request confirmed',
        color: 'positive',
        position: 'top-right',
      });
      requestsModal.value = false;
      dialog.value = false;
      rentTo.value = '';
      rentalTime.value = 0;
    });
  }
};

const deleteProperty = async () => {
  if (props.property?.id && typeof rentTo.value !== 'undefined' && typeof rentalTime.value !== 'undefined') {
    const id: string = props.property?.id.toString();
    await propertyDelete(id).then(() => {
      $q.notify({
        message: 'Property deleted',
        color: 'positive',
        position: 'top-right',
      });
    });
  }
};
</script>

<template>
  <q-dialog v-model="dialog" persistent transition-show="fade" transition-hide="fade">
    <q-card v-if="requestsModal" class="bg-secondary">
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
            dialog = false;
            rentTo = '';
            rentalTime = 0;
          "
          color="negative"
        />
        <q-btn label="Rent" no-caps flat :ripple="false" color="positive" @click="rentProperty" />
      </q-card-actions>
    </q-card>

    <q-card v-else-if="complaintModal" class="bg-secondary">
      <q-card-section>
        <div class="text-h6 no-pointer-events">
          Create complaint for
          {{ props.property.owner === userStore.User.address ? 'hirer' : 'owner' }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          :error="!isComplaintReason"
          error-message="Complaint reason is mandatory"
          type="textarea"
          label="Reason"
          color="black"
          v-model="complaintReason"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Cancel"
          no-caps
          flat
          :ripple="false"
          @click="
            complaintModal = false;
            dialog = false;
            complaintReason = '';
          "
          color="negative"
        />
        <q-btn label="Send" no-caps flat :ripple="false" color="positive" @click="confirmComplaint" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div v-if="props.property" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 overflow-auto">
    <q-card>
      <q-card-section horizontal class="no-pointer-events">
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
      <q-card-section class="no-pointer-events flex items-center">
        <q-icon name="location_on" />
        <div class="flex inline q-pl-xs">
          {{ props.property.adres }}
        </div>
      </q-card-section>
      <q-card-section class="no-pointer-events">
        <q-icon name="person" />
        <div class="flex inline q-pl-xs">{{ props.property.owner.slice(0, 6) }}...{{ props.property.owner.slice(39, 42) }}</div>
      </q-card-section>
      <q-card-actions v-if="!props.property.isAvailable" :align="hirer || owner ? 'right' : 'center'">
        <q-badge
          v-if="!hirer && !owner"
          class="text-bold q-pa-sm q-ma-xs no-pointer-events"
          label="Rented"
          rounded
          text-color="black"
          color="secondary"
          multi-line
        />
        <q-badge
          v-else
          class="text-bold q-pa-sm q-ma-xs no-pointer-events"
          :label="owner ? 'Owner' : 'Hirer'"
          rounded
          text-color="black"
          color="accent"
          multi-line
        />
        <div v-if="(hirer || owner) && !property?.isAvailable">
          <q-btn label="Break" no-caps flat :ripple="false" color="negative" @click="breakRenting" />
          <q-btn
            label="Create Complaint"
            no-caps
            flat
            :ripple="false"
            color="negative"
            @click="
              complaintModal = true;
              dialog = true;
            "
          />
        </div>
      </q-card-actions>
      <q-card-actions v-if="!hirer && !owner && property?.isAvailable" align="center">
        <q-btn label="Rent" class="full-width" no-caps color="positive" @click="sendRequest" />
      </q-card-actions>
      <q-card-actions v-if="owner && property?.isAvailable" align="right">
        <q-btn label="Delete" no-caps flat :ripple="false" color="negative" @click="deleteProperty" />
        <q-btn label="Get rent requests" no-caps flat :ripple="false" color="positive" @click="getRequests" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped></style>
