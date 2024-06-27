<template>
  <div class="dashboard flex justify-center q-pa-md q-gutter-md">
    <div v-for="card in cards" :key="card.label">
      <DashboardCard
        :to="card.to"
        :icon="card.icon"
        :label="card.label"
        :enabled="hasAccess(card.accessArea)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import DashboardCard from "@/components/DashboardCard.vue";

const accessAreas = ref([]);

onMounted(() => {
  accessAreas.value = JSON.parse(localStorage.getItem("accessAreas") || "[]");
});

function hasAccess(area) {
  return accessAreas.value.includes(area);
}

watch(
  () => localStorage.getItem("accessAreas"),
  (newVal) => {
    accessAreas.value = JSON.parse(newVal || "[]");
  }
);

const cards = [
  {
    to: "/clients",
    icon: "group",
    label: "Clients Management",
    accessArea: "Clients Management",
  },
  {
    to: "/coupons",
    icon: "confirmation_number",
    label: "Coupons Management",
    accessArea: "Coupons Management",
  },
  {
    to: "/invoice",
    icon: "receipt",
    label: "Invoice Management",
    accessArea: "Invoice Management",
  },
  {
    to: "/items",
    icon: "inventory",
    label: "Items Management",
    accessArea: "Items Management",
  },
  {
    to: "/users",
    icon: "people",
    label: "Users Management",
    accessArea: "Users Management",
  },
  { to: "/logs", icon: "history", label: "Logs", accessArea: "Logs" },
];
</script>

<style scoped>
.dashboard {
  margin: 0;
  padding: 0;
}

</style>
