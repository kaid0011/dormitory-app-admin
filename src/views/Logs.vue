<template>
  <div class="logs-page">
    <h1>Change Logs</h1>
    <q-table :rows="logs" :columns="columns" row-key="id" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent } from "vue";
import { QTable } from "quasar";
import { fetchLogs } from "@/../supabase/api/logs.js"; // Adjust path as needed

const columns = [
  {
    name: "table_name",
    align: "left",
    label: "Table",
    field: "table_name",
    sortable: true,
  },
  {
    name: "operation",
    align: "left",
    label: "Operation",
    field: "operation",
    sortable: true,
  },
  {
    name: "old_data",
    align: "left",
    label: "Old Data",
    sortable: false,
    field: row => JSON.stringify(row.old_data),
  },
  {
    name: "new_data",
    align: "left",
    label: "New Data",
    sortable: false,
    field: row => JSON.stringify(row.new_data),
  },
  {
    name: "changed_at",
    align: "left",
    label: "Changed At",
    field: "changed_at",
    sortable: true,
  },
];

const logs = ref([]);

onMounted(async () => {
  logs.value = await fetchLogs();
});

const LogsPage = defineComponent({
  name: "LogsPage",
});
</script>

<style scoped>
/* Add any scoped styles for your logs page here */
.logs-page {
  padding: 20px;
}
</style>
