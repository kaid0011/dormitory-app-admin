<template>
  <div class="invoice-management">
    <h1>INVOICE MANAGEMENT</h1>
    <div class="q-pa-md">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="invoice_no"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              label="View"
              color="primary"
              @click="viewInvoice(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllInvoices } from '@/../supabase/api/invoices.js';
import { fetchAllCoupons, fetchAllClients } from '@/../supabase/api/clients.js';
import { QBtn, QTable, QTd } from 'quasar';

const columns = [
  { name: 'invoice_no', align: 'left', label: 'Invoice No', field: 'invoice_no', sortable: true },
  { name: 'coupon_no', align: 'left', label: 'Coupon No', field: 'coupon_no', sortable: true },
  { name: 'client', align: 'left', label: 'Client', field: 'client', sortable: true },
  { name: 'date_time', align: 'left', label: 'Timestamp', field: 'date_time', sortable: true },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'actions', align: 'left', label: 'Actions', field: 'actions' },
];

const rows = ref([]);

async function fetchData() {
  try {
    const [invoices, coupons, clients] = await Promise.all([
      fetchAllInvoices(),
      fetchAllCoupons(),
      fetchAllClients(),
    ]);

    const couponsMap = new Map(coupons.map(coupon => [coupon.id, coupon]));
    const clientsMap = new Map(clients.map(client => [client.id, client]));

    rows.value = invoices.map(invoice => {
      const coupon = couponsMap.get(invoice.coupon_id) || {};
      const client = clientsMap.get(coupon.client_id) || {};

      return {
        ...invoice,
        coupon_no: coupon.coupon_no || 'N/A',
        client: `${client.account_no} : ${client.name}`,
      };
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const router = useRouter();

function viewInvoice(row) {
  router.push({ name: 'Invoice', params: { invoice_no: row.invoice_no } });
}

onMounted(fetchData);
</script>
