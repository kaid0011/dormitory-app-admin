<template>
  <div class="clients-management">
    <h1>CLIENTS MANAGEMENT</h1>

    <!-- Add Client Button -->
    <q-btn color="primary" class="q-mb-lg" @click="openAddClientDialog" label="Add client"/>

    <!-- Clients Table -->
    <q-table
      class="table"
      :rows="clients"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            label="View Coupons"
            color="primary"
            @click="viewCoupons(props.row.account_no)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Add Client Dialog -->
    <q-dialog v-model="addClientDialog" persistent transition-show="slide-down" transition-hide="slide-up">
      <q-card style="width: 500px;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Add New Client</div>
        </q-card-section>
        <q-card-section>
          <!-- Add Client Form -->
          <q-form @submit="addClient" class="q-gutter-md">
            <q-input v-model="newClient.account_no" label="Account No" outlined required></q-input>
            <q-input v-model="newClient.name" label="Name" outlined required></q-input>
            <q-input v-model="newClient.description" label="Description" outlined required></q-input>
            <q-card-actions align="right">
              <q-btn color="primary" type="submit" label="Add Client"></q-btn>
              <q-btn color="secondary" @click="closeAddClientDialog" label="Cancel"></q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createClient, fetchAllClients } from '@/../supabase/api/clients.js';
import { useQuasar } from 'quasar';

// Define columns for q-table
const columns = [
  { name: 'account_no', label: 'Account No', align: 'left', field: 'account_no' },
  { name: 'name', label: 'Name', align: 'left', field: 'name' },
  { name: 'description', label: 'Description', align: 'left', field: 'description' },
  { name: 'actions', label: 'Actions', align: 'left', field: 'actions' },
];

// Define reactive variables
const clients = ref([]);
const newClient = ref({ account_no: '', name: '', description: '' });
const addClientDialog = ref(false);
const $q = useQuasar();
const router = useRouter();

// Fetch clients on component mount
onMounted(async () => {
  await fetchClients();
});

// Function to fetch all clients
const fetchClients = async () => {
  try {
    clients.value = await fetchAllClients();
  } catch (error) {
    console.error('Error fetching clients:', error);
    $q.notify({ type: 'negative', message: 'Failed to fetch clients' });
  }
};

// Function to open add client dialog
const openAddClientDialog = () => {
  addClientDialog.value = true;
};

// Function to close add client dialog
const closeAddClientDialog = () => {
  addClientDialog.value = false;
};

// Function to add a new client
const addClient = async () => {
  try {
    const { data, error } = await createClient(newClient.value);
    if (error) {
      $q.notify({ type: 'negative', message: 'Failed to add client: ' + error.message });
      return;
    }
    // Clear form fields
    newClient.value = { account_no: '', name: '', description: '' };
    // Refresh clients list
    await fetchClients();
    // Close dialog
    closeAddClientDialog();
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to add client: ' + error.message });
  }
};

// Function to view coupons for a client
const viewCoupons = (accountNo) => {
  router.push({ name: 'Coupons Management', query: { account_no: accountNo } });
};
</script>

<style scoped>
.clients-management {
  padding: 20px;
}

.q-dialog__inner {
  max-width: 500px; /* Ensure the dialog box width is properly set */
}

.q-card-section.bg-primary {
  background-color: #3f51b5;
  color: #ffffff;
}

</style>
