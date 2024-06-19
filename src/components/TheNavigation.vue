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
            <img src="@/assets/images/logo.png" alt="Logo" width="40" height="40" />
          </q-item-section>
          <q-item-section><strong>CC Dormitory Admin</strong></q-item-section>
        </q-item>
        <q-separator/>
        <NavItem to="/" icon="dashboard" label="Dashboard" />
        <NavItem to="/clients" icon="group" label="Clients Management" />
        <NavItem to="/coupons" icon="confirmation_number" label="Coupons Management" />
        <NavItem to="/invoice" icon="receipt" label="Invoice Management" />
        <NavItem to="/items" icon="inventory" label="Items Management" />
        <NavItem to="/users" icon="people" label="Users Management" />
        <NavItem to="/logs" icon="history" label="Logs" />
        <q-separator/>
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
import { ref, computed } from "vue";
import NavItem from './NavItem.vue';
import { useQuasar } from "quasar";
import { signOut } from "@/../supabase/api/authentication.js";

const $q = useQuasar();
const drawer = ref(true);
const miniState = ref(true);

const drawerClass = computed(() => {
  return $q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3';
});

async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.error('Sign out error:', error.message);
  }
}
</script>
