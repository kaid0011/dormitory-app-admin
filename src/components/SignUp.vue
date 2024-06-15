<template>
  <form class="row flex-center flex" @submit.prevent="handleSignUp">
    <div class="col-6 form-widget">
      <h1 class="header">Sign Up</h1>
      <div>
        <input
          class="inputField"
          required
          type="text"
          placeholder="Name"
          v-model="name"
        />
      </div>
      <div>
        <input
          class="inputField"
          required
          type="email"
          placeholder="Email"
          v-model="email"
        />
      </div>
      <div>
        <input
          class="inputField"
          required
          type="password"
          placeholder="Your password"
          v-model="password"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Sign Up'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { signUpNewUser } from '@/../supabase/api/authentication.js';

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleSignUp() {
  try {
    loading.value = true;
    await signUpNewUser(name.value, email.value, password.value);
    console.log('Sign up successful!');
    // Redirect or perform any necessary action upon successful sign-up
  } catch (error) {
    console.error('Sign up error:', error.message);
    // Handle sign-up error
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Add scoped styles here if needed */
</style>
