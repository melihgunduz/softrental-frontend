import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Property } from 'components/models';

export const usePropertiesStore = defineStore('properties-store', () => {
  const properties = ref<Property[]>([]);

  function addProperty(info: any) {
    properties.value.push({
      owner: info[0],
      hirer: info[1],
      isAvailable: info[2],
      id: info[3],
      adres: info[4],
      name: info[5],
      sort: info[6],
      end: info[7],
      price: info[8],
      start: info[9],
      votes: info[10],
    });
  }

  function clearProperties() {
    properties.value = [];
  }

  return { properties, addProperty, clearProperties };
});
