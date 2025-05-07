# ttk-epay-nodejs-client
# TTK E-Pay Node.js Client

> Node.js client library for interacting with the TTK E-Pay payment gateway.
## Features

- Fetch list of invoices
- Create a new invoice
- Get invoice details by order ID
- Generate and send PDF receipts
- Post payments
- Check payment status

## Installation

```bash
npm install ttk-epay-nodejs-client
# or
pnpm add ttk-epay-nodejs-client
```

## Usage 
```javascript
const TtkEpay = require('ttk-epay-nodejs-client');

async function main() {
  const client = new TtkEpay();

  try {
    const invoices = await client.getInvoices(1, 10);
    console.log('Invoices:', invoices);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();

```

## new TtkEpay() 
Description:
Creates a new instance of the TtkEpay client that you can use to interact with the API.
```javascript
const client = new TtkEpay();

```


## getInvoices(page, size)
Description:
Fetches a paginated list of invoices. You can specify the page (the page number) and size (the number of invoices per page) for pagination.
```javascript
const invoices = await client.getInvoices(page, size);
```

## createInvoice(invoiceData)
Description:
Creates a new invoice. The invoiceData should contain all necessary information such as the amount, customer details, and any other relevant invoice information.
```javascript
const invoice = await client.createInvoice(invoiceData);
```

## getInvoiceByOrderId(orderId)
Description:
Retrieves the details of an invoice based on the given orderId.
```javascript
const invoiceDetails = await client.getInvoiceByOrderId(orderId);
```

## getPdfReceipt(satimOrderId)
Description:
Downloads the PDF receipt for a specific order using the satimOrderId.
```javascript
const pdfReceipt = await client.getPdfReceipt(satimOrderId);
```

## sendPdfReceiptMail(satimOrderId, email)
Description:
Sends the PDF receipt for the specified satimOrderId to the provided email address.
```javascript
const result = await client.sendPdfReceiptMail(satimOrderId, email);
```

## postPayment(paymentData)
Description:
Submits a payment using the provided paymentData. This data typically includes payment details such as the payment method, amount, and transaction information.
```javascript
const paymentStatus = await client.postPayment(paymentData);
```

## getPaymentStatus(satimOrderId)
Description:
Checks the current status of a payment using the satimOrderId. Returns information on whether the payment was successful, pending, or failed.
```javascript
const paymentStatus = await client.getPaymentStatus(satimOrderId);
```
Footer
© 20
