<template>
  <div class="user-management">
    <h1>USER MANAGEMENT</h1>
    
    <!-- Add User Button -->
    <q-btn color="primary" class="q-mb-lg" @click="openSignUpDialog" label="Add User" />

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
    
    <!-- Recover Account Dialog -->
    <q-dialog v-model="isDialogOpen" persistent transition-show="slide-down" transition-hide="slide-up">
      <q-card style="width: 500px;">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6">New Password</div>
          <!-- <q-btn dense flat round icon="close" class="absolute-top-right text-white" @click="isDialogOpen = false"></q-btn> -->
        </q-card-section>
        <q-card-section class="q-pa-md relative-position">
          <q-btn
            dense
            flat
            round
            icon="content_copy"
            class="absolute-top-right"
            @click="copyToClipboard(newPassword)"
          />
          <div>
            <h5 class="text-center">{{ newPassword }}</h5>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="secondary" label="Cancel" @click="isDialogOpen = false" />
          <q-btn
            label="Update Password"
            color="primary"
            @click="updatePassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <!-- Sign Up Dialog -->
    <q-dialog v-model="isSignUpDialogOpen" persistent transition-show="slide-down" transition-hide="slide-up">
      <q-card style="width: 500px;">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6">Add New User</div>
          <q-btn dense flat round icon="close" class="absolute-top-right text-white" @click="isSignUpDialogOpen = false"></q-btn>
        </q-card-section>
        <q-card-section>
          <SignUp />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
const isSignUpDialogOpen = ref(false);
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

function openSignUpDialog() {
  isSignUpDialogOpen.value = true;
}

onMounted(fetchData);
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.q-dialog__inner {
  max-width: 500px; /* Ensure the dialog box width is properly set */
}

.q-card-section.bg-primary {
  background-color: #3f51b5;
  color: #ffffff;
}

.absolute-top-right {
  position: absolute;
  top: 8px;
  right: 8px;
}

.absolute-top-left {
  position: absolute;
  top: 8px;
  left: 8px;
}

.relative-position {
  position: relative;
}
</style>
