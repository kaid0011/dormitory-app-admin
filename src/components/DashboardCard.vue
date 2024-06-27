<template>
    <q-btn class="q-pa-none" :flat="true">
      <q-card
        :class="{ 'disabled-card': !enabled, 'hoverable-card': enabled }"
        @click="enabled ? navigate() : null"
        class="dashboard-card q-pa-md bg-accent text-white"
      >
        <q-card-section>
          <div class="text-h6">{{ label }}</div>
        </q-card-section>
        <q-card-section>
          <q-icon class="q-pt-sm" :name="icon" size="lg" />
        </q-card-section>
      </q-card>
    </q-btn>
  </template>
  
  <script setup>
  import { defineProps } from "vue";
  import { useRouter } from "vue-router";
  
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
    enabled: {
      type: Boolean,
      required: true,
    },
  });
  
  const router = useRouter();
  
  function navigate() {
    router.push(props.to);
  }
  </script>
  
  <style scoped>
  .disabled-card {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .hoverable-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .hoverable-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .dashboard-card {
    width: 250px;
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .q-card__section.q-card__section--vert {
    padding: 0;
  }
  </style>
  