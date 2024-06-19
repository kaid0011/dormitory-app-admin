<template>
    <form class="login-box" @submit.prevent="handleSignIn">
      <q-img class="user" src="@/assets/images/logo.png" width="100px" height="100px" />
      <h3>Sign In</h3>
      <div>
        <q-input v-model="email" filled type="text" placeholder="Your email" class="inputField" />
      </div>
      <div>
        <q-input v-model="password" filled type="password" placeholder="Your password" class="inputField" />
      </div>
      <div>
        <q-btn type="submit" :loading="loading" :label="loading ? 'Loading' : 'Sign In'" color="primary" />
      </div>
      <q-space />
      <!-- <q-btn flat label="Forget Password" /> -->
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmail } from '@/../supabase/api/authentication.js'; // Adjust the path as needed

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

<style scoped>
.login-page {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: sans-serif;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

@media screen and (max-width: 600px) {
  .login-page {
    background-size: cover;
  }
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  min-height: 200px;
  background: #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 40px;
  box-sizing: border-box;
  text-align: center;
}

.user {
  margin: 0 auto;
  display: block;
  margin-bottom: 20px;
}

h3 {
  margin: 0;
  padding: 0 0 20px;
  color: #59238F;
}

.inputField {
  width: 100%;
  margin-bottom: 10px;
  color: #fff;
  background: transparent;
  font-size: 16px;
  box-sizing: border-box;
}

.inputField:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.q-btn {
  margin-top: 20px;
}

.q-btn.flat {
  color: #262626;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
}

.q-btn.flat:hover {
  color: #00ffff;
}

</style>
