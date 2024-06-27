<template>
  <div v-if="session" :session="session">
    <q-layout view="hHh lpR fFf">
      <TheNavigation :userEmail="session.user.email" />
      <q-page-container class="app-page">
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
  <AuthenticationPage v-else />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/../supabase/config.js';
import TheNavigation from "@/components/TheNavigation.vue";
import AuthenticationPage from "@/views/authentication/AuthenticationPage.vue";

const session = ref(null);
const router = useRouter();

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
    if (session.value) {
      localStorage.setItem('session', JSON.stringify(session.value));
    } else {
      localStorage.removeItem('session');
      router.push('/authentication');
    }
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
    if (_session) {
      localStorage.setItem('session', JSON.stringify(_session));
    } else {
      localStorage.removeItem('session');
      router.push('/authentication');
    }
  });
});
</script>

<style scoped>
.app-page {
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
}

.app-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("@/assets/images/auth_bg.jpg") no-repeat center center;
  background-size: cover;
  z-index: -1; /* Place the pseudo-element behind the content */
}
</style>
