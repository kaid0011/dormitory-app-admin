<template>
  <q-layout view="hHh lpR fFf">
    <TheNavigation />
    <q-page-container class="auth-page">
      <q-page padding>
        <SignIn />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import SignUp from "@/components/SignUp.vue";
import SignIn from "@/components/SignIn.vue";
</script>

<style scoped>
.auth-page {
  margin: 0;
  padding: 0;
  background: url("@/assets/images/auth_bg.jpg") no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
</style>
