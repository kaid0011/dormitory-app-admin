<template>
  <div class="coupons-management">
    <h1>COUPONS MANAGEMENT</h1>

    <!-- Account filter -->
    <div>
      <label for="accountFilter">Filter by Account No:</label>
      <select
        id="accountFilter"
        v-model="selectedAccountNo"
        @change="filterCoupons"
      >
        <option value="">All Accounts</option>
        <option
          v-for="client in clients"
          :key="client.account_no"
          :value="client.account_no"
        >
          {{ client.account_no }}
        </option>
      </select>
    </div>

    <!-- Add Coupon button -->
    <q-btn
      v-if="selectedAccountNo"
      label="Add Coupon"
      color="primary"
      @click="openAddCouponDialog"
      class="q-mt-md"
    />

    <!-- Coupons table -->
    <div class="q-pa-md">
      <q-table
        title="Coupons"
        :rows="filteredCoupons"
        :columns="columns"
        row-key="coupon_no"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              label="Update"
              color="primary"
              @click="updateCoupon(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Update Coupon Dialog -->
    <q-dialog v-model="showUpdateCouponDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Update Coupon</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="selectedCoupon.coupon_no"
            label="Coupon No"
            :disable="true"
          />
          <q-input
            v-model="selectedCoupon.balance"
            label="Balance"
            type="number"
          />
          <!-- Other fields for updating the coupon -->
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="showUpdateCouponDialog = false"
          />
          <q-btn flat label="Save" color="primary" @click="saveUpdatedCoupon" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Coupon Dialog -->
    <q-dialog v-model="showAddCouponDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add Coupon</div>
        </q-card-section>

        <q-card-section>
          <!-- Display highest coupon_no for each client_id -->
          <div v-if="selectedAccountNo && Object.keys(highestCoupons).length > 0">
              <div v-for="(couponNo, clientId) in highestCoupons" :key="clientId">
                Account No: {{ newCoupon.account_no }}
                Account Name: {{ newCoupon.name }}
                Highest Coupon No: {{ couponNo }}
              </div>
          </div>
          <div v-else>
            <p>No coupons found for the selected account.</p>
          </div>

          <q-input
            v-model="newCoupon.fromSeries"
            label="From Series"
            type="number"
          />
          <q-input
            v-model="newCoupon.toSeries"
            label="To Series"
            type="number"
          />
          <q-input v-model="newCoupon.balance" label="Balance" type="number" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="showAddCouponDialog = false"
          />
          <q-btn flat label="Add" color="primary" @click="addCoupon" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  fetchAllClients,
  fetchAllCoupons,
  addCouponToDatabase,
  updateCouponInDatabase,
} from "@/../supabase/api/clients.js";
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QInput,
  QTable,
  QTd,
} from "quasar";

const coupons = ref([]);
const clients = ref([]);
const selectedAccountNo = ref("");
const showAddCouponDialog = ref(false);
const showUpdateCouponDialog = ref(false);
const selectedCoupon = ref(null);
const newCoupon = ref({
  fromSeries: "",
  toSeries: "",
  balance: "",
  account_no: "",
  client_id: "",
  name: "",
});

const route = useRoute();

const columns = [
  {
    name: "coupon_no",
    align: "left",
    label: "Coupon No",
    field: "coupon_no",
    sortable: true,
  },
  {
    name: "balance",
    align: "left",
    label: "Balance",
    field: "balance",
    sortable: true,
  },
  {
    name: "account_no",
    align: "left",
    label: "Account No",
    field: "account_no",
    sortable: true,
  },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const filteredCoupons = computed(() => {
  if (selectedAccountNo.value === "") {
    return coupons.value;
  } else {
    return coupons.value.filter(
      (coupon) => coupon.account_no === selectedAccountNo.value
    );
  }
});

const highestCoupons = computed(() => {
  const highestMap = {};

  filteredCoupons.value.forEach(coupon => {
    const clientId = coupon.client_id;
    const couponNo = coupon.coupon_no;

    if (!highestMap[clientId] || couponNo > highestMap[clientId]) {
      highestMap[clientId] = couponNo;
    }
  });

  return highestMap;
});

async function fetchData() {
  const [couponsData, clientsData] = await Promise.all([
    fetchAllCoupons(),
    fetchAllClients(),
  ]);

  // Join coupons with clients based on client ID
  const joinedData = couponsData.map((coupon) => {
    const client = clientsData.find((client) => client.id === coupon.client_id);
    return {
      ...coupon,
      account_no: client ? client.account_no : "N/A",
      name: client ? client.name : "N/A",
    };
  });

  coupons.value = joinedData;
  clients.value = clientsData;

  // Set the selected account number from the route query if present
  if (route.query.account_no) {
    selectedAccountNo.value = route.query.account_no;
  }
}

function openAddCouponDialog() {
  if (selectedAccountNo.value) {
    newCoupon.value.account_no = selectedAccountNo.value;
    const client = clients.value.find(
      (client) => client.account_no === selectedAccountNo.value
    );
    if (client) {
      newCoupon.value.client_id = client.id;
      newCoupon.value.name = client.name; // Set the account name
    }
    showAddCouponDialog.value = true;
  }
}

async function addCoupon() {
  if (
    newCoupon.value.fromSeries &&
    newCoupon.value.toSeries &&
    newCoupon.value.balance &&
    selectedAccountNo.value
  ) {
    const client = clients.value.find(
      (client) => client.account_no === selectedAccountNo.value
    );
    if (client) {
      const clientId = client.id;
      const fromSeries = parseInt(newCoupon.value.fromSeries);
      const toSeries = parseInt(newCoupon.value.toSeries);
      const batchCoupons = [];

      for (let series = fromSeries; series <= toSeries; series++) {
        const addedCoupon = await addCouponToDatabase({
          client_id: clientId,
          coupon_series: series.toString(),
          balance: newCoupon.value.balance,
        });
        const clientName = client.name || "N/A";
        batchCoupons.push({
          ...addedCoupon[0],
          account_no: newCoupon.value.account_no,
          name: clientName,
        });
      }

      coupons.value.push(...batchCoupons);
      showAddCouponDialog.value = false;
      newCoupon.value = {
        fromSeries: "",
        toSeries: "",
        balance: "",
        account_no: "",
        client_id: "",
        name: "",
      };
    } else {
      console.error("Client not found for selected account number.");
    }
  }
}

function updateCoupon(coupon) {
  selectedCoupon.value = { ...coupon };
  showUpdateCouponDialog.value = true;
}

async function saveUpdatedCoupon() {
  try {
    await updateCouponInDatabase(selectedCoupon.value.id, {
      balance: selectedCoupon.value.balance,
    });
    showUpdateCouponDialog.value = false;
    const index = coupons.value.findIndex(
      (coupon) => coupon.coupon_no === selectedCoupon.value.coupon_no
    );
    if (index !== -1) {
      coupons.value[index] = { ...selectedCoupon.value };
    }
  } catch (error) {
    console.error("Error updating coupon:", error);
  }
}

onMounted(fetchData);
</script>

<style scoped>
label {
  margin-right: 10px;
}

select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
