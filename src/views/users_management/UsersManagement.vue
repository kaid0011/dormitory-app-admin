<template>
  <SignUp></SignUp>
  <div class="user-management">
    <h1>USER MANAGEMENT</h1>
    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="id">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              label="Recover Account"
              color="primary"
              @click="showPasswordDialog(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isDialogOpen" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div>
            <h5>New Password</h5>
            <p>{{ newPassword }}</p>
          </div>
          <q-btn
            class="q-ml-sm"
            label="Copy"
            @click="copyToClipboard(newPassword)"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="isDialogOpen = false" />
          <q-btn
            flat
            label="Update Password"
            color="primary"
            @click="updatePassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { QBtn, QTable, QTd, QDialog, QCard, QCardSection, QCardActions } from "quasar";
import SignUp from "@/components/SignUp.vue";
import { fetchAllUsers, updateAuthUserPassword } from "@/../supabase/api/user_accounts.js"; // Adjust import path as per your API structure

const columns = [
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  { name: "email", align: "left", label: "Email", field: "email", sortable: true },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const rows = ref([]);
const isDialogOpen = ref(false);
const newPassword = ref("");
const selectedUser = ref(null);

async function fetchData() {
  try {
    const users = await fetchAllUsers(); // Fetch users data from your API
    rows.value = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      actions: "Recover Account", // Update button text to "Recover Account"
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function showPasswordDialog(user) {
  selectedUser.value = user;
  newPassword.value = await fetchRandomWord();
  isDialogOpen.value = true;
}

async function fetchRandomWord() {
  try {
    const response = await fetch("https://random-word-api.herokuapp.com/word?number=1");
    const words = await response.json();
    return words[0];
  } catch (error) {
    console.error("Error fetching random word:", error);
    return "defaultpassword"; // Fallback password
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Copied to clipboard:", text);
  });
}

async function updatePassword() {
  if (!selectedUser.value) return;

  try {
    await updateAuthUserPassword(selectedUser.value.id, newPassword.value);
    console.log("Password updated successfully for user:", selectedUser.value.email);
    isDialogOpen.value = false;
  } catch (error) {
    console.error("Error updating password:", error.message);
  }
}

onMounted(fetchData);
</script>

<style scoped>
/* Add scoped styles here if needed */
</style>
