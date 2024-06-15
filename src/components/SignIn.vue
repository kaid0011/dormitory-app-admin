<template>
  <form class="row flex-center flex" @submit.prevent="handleSignIn">
    <div class="col-6 form-widget">
      <h1 class="header">Sign In</h1>
      <div>
        <input
          class="inputField"
          required
          type="text"
          placeholder="Your email"
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
          :value="loading ? 'Loading' : 'Sign In'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmail } from '@/../supabase/api/authentication.js'; // Import your signInWithEmail function

const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleSignIn() {
  try {
    loading.value = true;
    await signInWithEmail(email.value, password.value);
    // Redirect or perform any necessary action upon successful sign-in
  } catch (error) {
    console.error('Sign in error:', error.message);
    // Handle sign-in error
  } finally {
    loading.value = false;
  }
}
</script>
