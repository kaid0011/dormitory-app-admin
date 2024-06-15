<template>
  <div v-if="session" :session="session">
    <q-layout view="hHh lpR lFf" styles="min-height: 100vh;">
      <TheNavigation />
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
  <AuthenticationPage v-else />
</template>

<script setup>
import TheNavigation from "@/components/TheNavigation.vue";
import AuthenticationPage from "@/views/authentication/AuthenticationPage.vue";
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabase/config.js'

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>
