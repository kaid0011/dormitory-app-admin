<template>
  <div class="parent-container">
    <div class="invoice-container">
    <q-card class="" v-if="isDataLoaded">
      <div class="q-pa-lg">
        <h1 class="html_title">COTTON CARE DRY CLEANERS</h1>
        <h2 class="html_cardNo">{{ coupon.coupon_no }}</h2>
        <div class="html_detailsContainer">
          <div class="html_detailsRow">
            <span class="html_detailLabel">Invoice No:</span>
            <span class="html_detail">{{ invoiceDetails.invoice_no }}</span>
          </div>
          <div class="html_detailsRow">
            <span class="html_detailLabel">Date:</span>
            <span class="html_detail">{{ formattedDate }}</span>
          </div>
          <div class="html_detailsRow">
            <span class="html_detailLabel">Time:</span>
            <span class="html_detail">{{ formattedTime }}</span>
          </div>
          <div class="html_detailsRow">
            <span class="html_detailLabel">Ready By:</span>
            <span class="html_detail">{{ formattedReadyBy }}</span>
          </div>
        </div>

        <div class="html_transactionContainer">
          <div class="html_row">
            <span class="html_cell html_headerCell">S/No.</span>
            <span class="html_cell html_headerCell">Item(s)</span>
            <span class="html_cell html_headerCell">Tag No.</span>
            <span class="html_cell html_headerCell">Credit(s)</span>
          </div>
          <div v-for="(transaction, index) in transactions" :key="transaction.id" class="html_row">
            <span class="html_cell">{{ index + 1 }}</span>
            <span class="html_cell">{{ getItemName(transaction.item_id) }}</span>
            <span class="html_cell">{{ transaction.tag_no }}</span>
            <span class="html_cell">{{ getItemCredits(transaction.item_id) }}</span>
          </div>
          <div class="html_row">
            <span class="html_cell html_headerCell"></span>
            <span class="html_cell html_headerCell"></span>
            <span class="html_cell html_headerCell">TOTAL:</span>
            <span class="html_cell html_headerCell">{{ invoiceDetails.total_credits }}</span>
          </div>
        </div>

        <div class="html_credits">
          <h2 class="html_creditsLabel">CREDITS STATUS</h2>
          <div class="html_tableCredits">
            <div class="html_rowCredits">
              <span class="html_creditsSub">FROM</span>
              <span class="html_creditsValue">{{ invoiceDetails.old_balance }}</span>
            </div>
            <div class="html_rowCredits">
              <span class="html_creditsValue">
                <i class="icon"></i>
              </span>
            </div>
            <div class="html_rowCredits">
              <span class="html_creditsSub">TO</span>
              <span class="html_creditsValue">{{ invoiceDetails.new_balance }}</span>
            </div>
          </div>
        </div>
      </div>
    </q-card>
    <q-spinner v-else color="primary" size="40px" />
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
fetchInvoiceDetails,
fetchCouponById,
fetchTransactionsByInvoiceNo,
fetchItemList,
} from "@/../supabase/api/invoices.js";

const route = useRoute();
const router = useRouter();

const invoiceDetails = ref(null);
const coupon = ref(null);
const transactions = ref([]);
const itemList = ref([]);
const isDataLoaded = ref(false);

const formattedDate = ref("");
const formattedTime = ref("");
const formattedReadyBy = ref("");

const formatDate = (date) => {
return date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
};

const formatTime = (date) => {
return date.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
};

const getItemName = (itemId) => {
const item = itemList.value.find(item => item.id === itemId);
return item ? item.item : "";
};

const getItemCredits = (itemId) => {
const item = itemList.value.find(item => item.id === itemId);
return item ? item.credits : "";
};

async function fetchData() {
try {
  const invoiceNo = route.params.invoice_no;

  const [invoiceData, itemListData, transactionsData] = await Promise.all([
    fetchInvoiceDetails(invoiceNo),
    fetchItemList(),
    fetchTransactionsByInvoiceNo(invoiceNo)
  ]);

  invoiceDetails.value = invoiceData;
  itemList.value = itemListData;
  transactions.value = transactionsData;
  coupon.value = await fetchCouponById(invoiceDetails.value.coupon_id);

  formattedDate.value = formatDate(new Date(invoiceDetails.value.date_time));
  formattedTime.value = formatTime(new Date(invoiceDetails.value.date_time));
  formattedReadyBy.value = formatDate(new Date(invoiceDetails.value.ready_by));

  isDataLoaded.value = true;
} catch (error) {
  console.error("Error fetching invoice details:", error);
  router.push({ name: "Invoice Management" }); // Redirect to InvoiceList on error
}
}

onMounted(fetchData);
</script>

<style scoped>
.parent-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.invoice-container {
min-width: 500px;
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
