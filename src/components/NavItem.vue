<template>
    <router-link :to="to" custom v-slot="{ navigate, href, isActive }">
      <q-item clickable v-ripple :class="{ 'active-navigation': isActive }" @click="navigate" :href="href">
        <q-item-section avatar class="nav-item">
          <q-icon :name="icon" />
        </q-item-section>
        <q-item-section>
          {{ label }}
        </q-item-section>
      </q-item>
    </router-link>
  </template>
  <script setup>
import { defineProps } from "vue";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>

</style>