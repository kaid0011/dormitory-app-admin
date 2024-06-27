<template>
  <q-page class="not-authorized-page">
    <div class="content">
      <q-icon name="lock" size="120px" color="yellow" />
      <h1 class="title">NOT AUTHORIZED</h1>
      <p class="message">You do not have access to this page.</p>
      <q-btn label="Go to Dashboard" color="secondary" @click="goToDashboard" />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { QPage, QIcon, QBtn } from 'quasar';

const router = useRouter();

function goToDashboard() {
  router.push('/');
}
</script>

<style scoped>
.not-authorized-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
}

.content {
  text-align: center;
}

.title {
  color: yellow;
  margin-top: 20px;
}

.message {
  color: white;
  margin: 20px 0;
}

.q-btn {
  margin-top: 20px;
}
</style>
