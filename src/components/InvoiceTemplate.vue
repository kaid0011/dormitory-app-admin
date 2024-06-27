<template>
  <!-- invoiceTemplate.html -->
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
      <h2 class="html_cardNo">{{coupon_no}}</h2>
      <div class="html_detailsContainer">
        <div class="html_detailsRow">
          <span class="html_detailLabel">Invoice No:</span>
          <span class="html_detail">{{invoice_no}}</span>
        </div>
        <div class="html_detailsRow">
          <span class="html_detailLabel">Date:</span>
          <span class="html_detail">{{formattedDate}}</span>
        </div>
        <div class="html_detailsRow">
          <span class="html_detailLabel">Time:</span>
          <span class="html_detail">{{formattedTime}}</span>
        </div>
        <div class="html_detailsRow">
          <span class="html_detailLabel">Ready By:</span>
          <span class="html_detail">{{formattedReadyBy}}</span>
        </div>
      </div>
      <div class="html_transactionContainer">
        <div class="html_row">
          <span class="html_cell html_headerCell">S/No.</span>
          <span class="html_cell html_headerCell">Item(s)</span>
          <span class="html_cell html_headerCell">Tag No.</span>
          <span class="html_cell html_headerCell">Credit(s)</span>
        </div>
        {{transactionsContent}}
        <div class="html_row">
          <span class="html_cell html_headerCell"></span>
          <span class="html_cell html_headerCell"></span>
          <span class="html_cell html_headerCell">TOTAL:</span>
          <span class="html_cell html_headerCell">{{total_credits}}</span>
        </div>
      </div>
      <div class="html_credits">
        <h2 class="html_creditsLabel">CREDITS STATUS</h2>
        <div class="html_tableCredits">
          <div class="html_rowCredits">
            <span class="html_creditsSub">FROM</span>
            <span class="html_creditsValue">{{old_balance}}</span>
          </div>
          <div class="html_rowCredits">
            <span class="html_creditsValue">
              <i class="icon"></i>
            </span>
          </div>
          <div class="html_rowCredits">
            <span class="html_creditsSub">TO</span>
            <span class="html_creditsValue">{{new_balance}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>

</template>