<template>
  <div>
    <div>
      <q-btn @click="handlePrint" color="primary" class="q-mb-lg">Print</q-btn>
    </div>
    <div>
      <q-card class="print-container row" v-if="pdfContent">
        <div class="col-6 q-pa-lg" v-html="pdfContent"></div>
        <div class="col-6 q-pa-lg" v-html="pdfContent"></div>
      </q-card>
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
const pdfContent = ref(null);

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

const generatePdfContent = (invoiceDetails, coupon, transactions, itemList) => {
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
};

async function fetchData() {
  try {
    const invoiceNo = route.params.invoice_no;
    const [invoiceDetails, itemList] = await Promise.all([
      fetchInvoiceDetails(invoiceNo),
      fetchItemList(),
    ]);

    const coupon = await fetchCouponById(invoiceDetails.coupon_id);
    const transactions = await fetchTransactionsByInvoiceNo(invoiceNo);

    pdfContent.value = generatePdfContent(
      invoiceDetails,
      coupon,
      transactions,
      itemList
    );
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    router.push({ name: "Invoice Management" }); // Redirect to InvoiceList on error
  }
}

onMounted(fetchData);

const handlePrint = () => {
  const content = pdfContent.value;

  // Open a new print window
  const printWindow = window.open("", "_blank");
  printWindow.document.open();

  // Write the HTML content with two columns
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

  // Close the document
  printWindow.document.close();

  // Print the document
  printWindow.print();

  // Close the print window after printing
  printWindow.onafterprint = function() {
    printWindow.close();
  };
};

</script>

<style scoped>
.print-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
  margin-right: 10px; /* Adjust spacing between containers */
}

.print-container:last-child {
  margin-right: 0; /* Remove margin from last container to prevent extra space */
}
</style>
