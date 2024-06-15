<template>
  <div id="nav">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Dormitory Application Management System
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left" class="menu">
        <router-link to="/" custom v-slot="{ navigate, href, isActive }">
          <q-btn
            :class="{ 'active-navigation': isActive }"
            stretch
            flat
            clickable
            @click="navigate"
            :href="href"
            label="Dashboard"
          />
        </router-link>

        <q-btn-dropdown
          auto-close
          stretch
          flat
          label="Client Management"
          style="height: 50px"
          :class="{ 'active-navigation': isClientManagementActive }"
        >
          <q-list>
            <router-link to="/clients" custom v-slot="{ navigate, href, isActive }">
              <q-item
                clickable
                @click="navigate"
                :href="href"
                :class="{ 'active-navigation': isActive }"
              >
                <q-item-section>Accounts Management</q-item-section>
              </q-item>
            </router-link>
            <router-link to="/coupons" custom v-slot="{ navigate, href, isActive }">
              <q-item
                clickable
                @click="navigate"
                :href="href"
                :class="{ 'active-navigation': isActive, 'coupons-active': isActive }"
              >
                <q-item-section>Coupons Management</q-item-section>
              </q-item>
            </router-link>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown
          auto-close
          stretch
          flat
          label="Invoice Management"
          :class="{ 'active-navigation': isInvoiceManagementActive }"
        >
          <q-list>
            <router-link to="/invoice" custom v-slot="{ navigate, href, isActive }">
              <q-item
                clickable
                @click="navigate"
                :href="href"
                :class="{ 'active-navigation': isActive }"
              >
                <q-item-section>Invoice List</q-item-section>
              </q-item>
            </router-link>
          </q-list>
        </q-btn-dropdown>

        <router-link to="/users" custom v-slot="{ navigate, href, isActive }">
          <q-btn
            :class="{ 'active-navigation': isActive }"
            stretch
            flat
            clickable
            @click="navigate"
            :href="href"
            label="Users Management"
          />
        </router-link>

        <router-link to="/logs" custom v-slot="{ navigate, href, isActive }">
          <q-btn
            :class="{ 'active-navigation': isActive }"
            stretch
            flat
            clickable
            @click="navigate"
            :href="href"
            label="Logs"
          />
        </router-link>

        <q-btn
            :class="{ 'active-navigation': isActive }"
            stretch
            flat
            clickable
            @click="handleSignOut"
            :href="href"
            label="Sign Out"
          />
      </q-tabs>
    </q-header>
  </div>
</template>

<style lang="css">
#nav .active-navigation {
  color: rebeccapurple;
  border-bottom: 2px solid black;
}
#nav .coupons-active {
  border-right: 2px solid black;
}
</style>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { signOut } from '@/../supabase/api/authentication.js'; // Import signOut function

const route = useRoute();

const isClientManagementActive = computed(() => {
  return route.path.startsWith('/clients') || route.path.startsWith('/coupons');
});

const isInvoiceManagementActive = computed(() => {
  return route.path.startsWith('/invoice');
});

async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.error('Sign out error:', error.message);
   }
}
</script>