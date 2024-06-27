<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    :min-width="auto"
    :breakpoint="500"
    bordered
    :class="drawerClass"
  >
    <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
      <q-list>
        <q-item class="q-py-lg">
          <q-item-section avatar>
            <img
              src="@/assets/images/logo.png"
              alt="Logo"
              width="40"
              height="40"
            />
          </q-item-section>
          <q-item-section><strong>CC Dormitory Admin</strong></q-item-section>
        </q-item>
        <q-separator />
        <NavItem
          to="/"
          icon="dashboard"
          label="Dashboard"
          :enabled="hasAccess('Dashboard')"
        />
        <NavItem
          to="/clients"
          icon="group"
          label="Clients Management"
          :enabled="hasAccess('Clients Management')"
        />
        <NavItem
          to="/coupons"
          icon="confirmation_number"
          label="Coupons Management"
          :enabled="hasAccess('Coupons Management')"
        />
        <NavItem
          to="/invoice"
          icon="receipt"
          label="Invoice Management"
          :enabled="hasAccess('Invoice Management')"
        />
        <NavItem
          to="/items"
          icon="inventory"
          label="Items Management"
          :enabled="hasAccess('Items Management')"
        />
        <NavItem
          to="/users"
          icon="people"
          label="Users Management"
          :enabled="hasAccess('Users Management')"
        />
        <NavItem
          to="/logs"
          icon="history"
          label="Logs"
          :enabled="hasAccess('Logs')"
        />
        <q-separator />
        <!-- Display Authenticated User Email -->
        <q-item class="q-py-lg q-mb-sm">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section
            ><strong>{{ userEmail }}</strong></q-item-section
          >
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="handleSignOut">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>Sign Out</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import NavItem from "./NavItem.vue";
import { useQuasar } from "quasar";
import { signOut } from "@/../supabase/api/authentication.js";
import { defineProps } from "vue";

const $q = useQuasar();
const drawer = ref(true);
const miniState = ref(true);
const accessAreas = ref([]);

onMounted(() => {
  accessAreas.value = JSON.parse(localStorage.getItem("accessAreas") || "[]");
});

const drawerClass = computed(() =>
  $q.dark.isActive ? "bg-grey-9" : "bg-grey-3"
);

function hasAccess(area) {
  return accessAreas.value.includes(area);
}

async function handleSignOut() {
  try {
    await signOut();
    localStorage.removeItem("accessAreas");
    localStorage.removeItem("session");
    accessAreas.value = []; // Reset the access areas
    window.location.reload(); // Ensure reactivity reset
  } catch (error) {
    console.error("Sign out error:", error.message);
  }
}

// Watch for changes in localStorage and update accessAreas accordingly
window.addEventListener("storage", () => {
  accessAreas.value = JSON.parse(localStorage.getItem("accessAreas") || "[]");
});

watch(
  () => localStorage.getItem("accessAreas"),
  (newVal) => {
    accessAreas.value = JSON.parse(newVal || "[]");
  }
);

// Define props for user email
const props = defineProps({
  userEmail: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.disabled-navigation {
  opacity: 0.5;
  pointer-events: none;
}
</style>
