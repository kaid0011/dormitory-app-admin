<template>
  <div class="invoice-management">
    <h1>INVOICE MANAGEMENT</h1>
    <div class="q-pa-md">
      <h4>Ongoing Invoices</h4>
      <q-table
        class="table"
        :rows="ongoingInvoices"
        :columns="columns"
        row-key="invoice_no"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-md">
            <q-btn
              label="View"
              color="primary"
              @click="viewInvoice(props.row)"
            />
            <q-btn
              label="Print"
              color="secondary"
              @click="printInvoice(props.row)"
            />
            <q-btn
              label="Update Status"
              color="accent"
              @click="openUpdateDialog(props.row)"
            />
          </q-td>
        </template>
      </q-table>

      <h4>Returned Invoices</h4>
      <q-table
        class="table"
        :rows="returnedInvoices"
        :columns="columns"
        row-key="invoice_no"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-md">
            <q-btn
              label="View"
              color="primary"
              @click="viewInvoice(props.row)"
            />
            <q-btn
              label="Print"
              color="secondary"
              @click="printInvoice(props.row)"
            />
            <q-btn
              label="Update Status"
              color="accent"
              @click="openUpdateDialog(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isUpdateDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Update Invoice Status</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            label="Select Status"
            emit-value
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Update"
            color="primary"
            @click="updateInvoiceStatus"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  fetchAllInvoices,
  fetchInvoiceDetails,
  fetchCouponById,
  fetchTransactionsByInvoiceNo,
  fetchItemList,
  updateStatus,
} from "@/../supabase/api/invoices.js";
import { fetchAllCoupons, fetchAllClients } from "@/../supabase/api/clients.js";
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
const columns = [
  {
    name: "invoice_no",
    align: "left",
    label: "Invoice No",
    field: "invoice_no",
    sortable: true,
  },
  {
    name: "coupon_no",
    align: "left",
    label: "Coupon No",
    field: "coupon_no",
    sortable: true,
  },
  {
    name: "client",
    align: "left",
    label: "Client",
    field: "client",
    sortable: true,
  },
  {
    name: "date_time",
    align: "left",
    label: "Timestamp",
    field: (row) => formatDateTime(row.date_time),
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Status",
    field: "status",
    sortable: true,
  },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const rows = ref([]);
const ongoingInvoices = ref([]);
const returnedInvoices = ref([]);
const selectedRow = ref(null);
const selectedStatus = ref("");
const isUpdateDialogOpen = ref(false);
const statusOptions = [
  { label: "Ongoing", value: "Ongoing" },
  { label: "Returned", value: "Returned" },
  // Add other status options as needed
];

async function fetchData() {
  try {
    const [invoices, coupons, clients] = await Promise.all([
      fetchAllInvoices(),
      fetchAllCoupons(),
      fetchAllClients(),
    ]);

    const couponsMap = new Map(coupons.map((coupon) => [coupon.id, coupon]));
    const clientsMap = new Map(clients.map((client) => [client.id, client]));

    rows.value = invoices.map((invoice) => {
      const coupon = couponsMap.get(invoice.coupon_id) || {};
      const client = clientsMap.get(coupon.client_id) || {};

      return {
        ...invoice,
        coupon_no: coupon.coupon_no || "N/A",
        client: `${client.account_no} : ${client.name}`,
      };
    });

    ongoingInvoices.value = rows.value.filter(
      (invoice) => invoice.status === "Ongoing"
    );
    returnedInvoices.value = rows.value.filter(
      (invoice) => invoice.status === "Returned"
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const router = useRouter();

function viewInvoice(row) {
  const url = router.resolve({
    name: "Invoice",
    params: { invoice_no: row.invoice_no },
  }).href;
  window.open(url, "_blank");
}

async function printInvoice(row) {
  try {
    const invoiceDetails = await fetchInvoiceDetails(row.invoice_no);
    const coupon = await fetchCouponById(invoiceDetails.coupon_id);
    const transactions = await fetchTransactionsByInvoiceNo(row.invoice_no);
    const itemList = await fetchItemList();

    const pdfContent = generatePdfContent(
      invoiceDetails,
      coupon,
      transactions,
      itemList
    );
    handlePrint(pdfContent);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
  }
}

function generatePdfContent(invoiceDetails, coupon, transactions, itemList) {
  const transactionsContent = transactions
    .map((transaction, index) => {
      const item = itemList.find((item) => item.id === transaction.item_id);
      return item
        ? `<div class="html_row">
           <span class="html_cell">${index + 1}</span>
           <span class="html_cell">${item.item}</span>
           <span class="html_cell">${transaction.tag_no}</span>
           <span class="html_cell">${item.credits}</span>
         </div>`
        : "";
    })
    .join("");

  const formattedDate = formatDate(new Date(invoiceDetails.date_time));
  const formattedTime = formatTime(new Date(invoiceDetails.date_time));
  const formattedReadyBy = formatDate(new Date(invoiceDetails.ready_by));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        .print-container {
          display: flex;
          width: 297mm; /* A4 width in landscape mode */
          height: 210mm; /* A4 height in landscape mode */
          flex-wrap: wrap;
        }
        .html_container {
          width: 100%; /* Two columns */
          height: 100%;
        }
        .html_title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
          padding-bottom: 8px;
          text-align: center;
          border-bottom: 1px solid #ccc;
          color: black;
        }
        .html_cardNo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
        }
        .html_detailsContainer {
          margin-bottom: 15px;
          padding: 10px;
          border-bottom: 1px solid #ccc;
          border-top: 1px solid #ccc;
        }
        .html_detailsRow {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .html_detailLabel {
          flex: 1;
          font-size: 12px;
          font-weight: bold;
          text-align: left;
          padding-left: 30px;
        }
        .html_detail {
          flex: 2;
          font-size: 12px;
        }
        .html_transactionContainer {
          margin-bottom: 10px;
        }
        .html_row {
          display: flex;
          padding: 4px 0;
          border-bottom: 1px solid #ccc;
          align-items: center;
          font-size: 10px;
        }
        .html_cell {
          flex: 1;
          text-align: center;
        }
        .html_headerCell {
          font-weight: bold;
        }
        .html_credits {
          margin-top: 15px;
          padding: 15px;
          text-align: center;
          border: 1px solid gray;
          border-radius: 5px;
        }
        .html_creditsLabel {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
          border-bottom: 1px solid #ccc;
          line-height: 2;
        }
        .html_tableCredits {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }
        .html_rowCredits {
          flex: 1;
          align-items: center;
          justify-content: center;
        }
        .html_creditsValue {
          font-size: 16px;
          font-weight: bold;
        }
        .html_creditsSub {
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div class="html_container">
        <div class="html_invoiceContainer">
          <h1 class="html_title">COTTON CARE DRY CLEANERS</h1>
          <h2 class="html_cardNo">${coupon.coupon_no}</h2>
          <div class="html_detailsContainer">
            <div class="html_detailsRow">
              <span class="html_detailLabel">Invoice No:</span>
              <span class="html_detail">${invoiceDetails.invoice_no}</span>
            </div>
            <div class="html_detailsRow">
              <span class="html_detailLabel">Date:</span>
              <span class="html_detail">${formattedDate}</span>
            </div>
            <div class="html_detailsRow">
              <span class="html_detailLabel">Time:</span>
              <span class="html_detail">${formattedTime}</span>
            </div>
            <div class="html_detailsRow">
              <span class="html_detailLabel">Ready By:</span>
              <span class="html_detail">${formattedReadyBy}</span>
            </div>
          </div>
          <div class="html_transactionContainer">
            <div class="html_row">
              <span class="html_cell html_headerCell">S/No.</span>
              <span class="html_cell html_headerCell">Item(s)</span>
              <span class="html_cell html_headerCell">Tag No.</span>
              <span class="html_cell html_headerCell">Credit(s)</span>
            </div>
            ${transactionsContent}
            <div class="html_row">
              <span class="html_cell html_headerCell"></span>
              <span class="html_cell html_headerCell"></span>
              <span class="html_cell html_headerCell">TOTAL:</span>
              <span class="html_cell html_headerCell">${invoiceDetails.total_credits}</span>
            </div>
          </div>
          <div class="html_credits">
            <h2 class="html_creditsLabel">CREDITS STATUS</h2>
            <div class="html_tableCredits">
              <div class="html_rowCredits">
                <span class="html_creditsSub">FROM</span>
                <span class="html_creditsValue">${invoiceDetails.old_balance}</span>
              </div>
              <div class="html_rowCredits">
                <span class="html_creditsValue">
                  <i class="icon"></i>
                </span>
              </div>
              <div class="html_rowCredits">
                <span class="html_creditsSub">TO</span>
                <span class="html_creditsValue">${invoiceDetails.new_balance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function handlePrint(content) {
  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Print Preview</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        body {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .column {
          width: calc(50% - 5px);
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      <div class="column">${content}</div>
      <div class="column">${content}</div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
  printWindow.onafterprint = function () {
    printWindow.close();
  };
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

function openUpdateDialog(row) {
  selectedRow.value = row;
  selectedStatus.value = row.status;
  isUpdateDialogOpen.value = true;
}

async function updateInvoiceStatus() {
  if (selectedRow.value) {
    selectedRow.value.status = selectedStatus.value;
    try {
      await updateStatus(selectedRow.value);
      isUpdateDialogOpen.value = false;
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  }
}

onMounted(fetchData);
</script>

<style scoped>
.invoice-management {
  padding: 20px;
}
</style>
