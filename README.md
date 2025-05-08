# TTK-Epay 

A comprehensive client SDK for interacting with the TTK-Epay payment processing API. This library provides a simple interface for managing invoices, processing payments, and generating receipts.

[![npm version](https://img.shields.io/npm/v/ttk-epay-nodejs-client.svg)]([https://www.npmjs.com/package/ttk-epay-nodejs-client)
[![PyPI version](https://img.shields.io/pypi/v/ttk-epay.svg)](https://pypi.org/project/ttk-epay/)
[![License](https://img.shields.io/github/license/yourusername/ttk-epay.svg)](https://github.com/yourusername/ttk-epay/blob/main/LICENSE)

## Features

- 🧾 Complete invoice management
- 💰 Payment processing functionality
- 📑 PDF receipt generation and email delivery
- 🔍 Payment status verification
- ⚡ Available for both Python and JavaScript environments

## Installation


### JavaScript (Node.js)

```bash
npm install ttk-epay-nodejs-client
```

## Quick Start


### JavaScript

```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

// Example: Get list of invoices
async function getInvoices() {
  try {
    const invoices = await client.get_invoices(1, 10);
    console.log(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
  }
}

getInvoices();

```

## API Reference

### Admin Operations

#### `get_invoices(page_number=1, page_size=10)`

Retrieves a paginated list of invoices.

**Parameters:**
- `page_number` (optional): The page number to retrieve (default: 1)
- `page_size` (optional): Number of items per page (default: 10)

**Returns:** A dictionary/object containing:
- List of Invoice objects
- Page information (current page, total pages)


**Example (JavaScript):**
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

// Example: Get list of invoices
async function listInvoices() {
  try {
    const response = await client.get_invoices(1, 20);
    console.log('Raw response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
  }
}

listInvoices();
```

#### `create_invoice(invoice_data)`

Creates a new invoice.

**Parameters:**
- `invoice_data`: An Invoice object containing invoice details

**Returns:** The created Invoice object with server-assigned fields


**Example (JavaScript):**
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

async function createNewInvoice() {
  try {
    // Prepare the invoice data (use plain object)
    const newInvoice = {
      INVOICE_NUMBER: 12345,
      CLIENT_NAME: "Acme Corporation",
      CLIENT_CODE: 789,
      CLIENT_ADDRESS: "123 Business Ave, Suite 100",
      CLIENT_MAIL: "billing@acme.com",
      NET_AMOUNT: 1000.00,
      INVOICE_TVA: 0.19,
      AMOUNT_TVA: 190.00,
      AMOUNT_TTC: 1190.00,
      PRODUCT_NAME: "Enterprise Plan Subscription",
      INVOICE_DATE: "2025-05-08T10:00:00.000Z"
    };

    // Create the invoice
    const createdInvoice = await client.create_invoice(newInvoice);
    console.log(`Created invoice with ID: ${createdInvoice.ID}`);
  } catch (error) {
    console.error('Error creating invoice:', error.message);
  }
}

createNewInvoice();

```

#### `get_invoice_by_order_id(order_id)`

Retrieves a specific invoice by its order ID.

**Parameters:**
- `order_id`: The order ID of the invoice to retrieve

**Returns:** The Invoice object if found


**Example (JavaScript):**
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

async function findInvoiceByOrderId() {
  try {
    const orderId = "35";
    const invoice = await client.get_invoice_by_order_id(orderId);
    
    console.log(`Found invoice - Order ID: ${invoice.ORDER_ID}, Amount: ${invoice.NET_AMOUNT}, Paid: ${invoice.IS_PAID ? 'Yes' : 'No'}`);
    return invoice;
  } catch (error) {
    console.error(`Error finding invoice: ${error.message}`);
    return null;
  }
}


findInvoiceByOrderId();
```

#### `update_invoice(invoice_id, invoice_data)`

Updates an existing invoice.

**Parameters:**
- `invoice_id`: The ID of the invoice to update
- `invoice_data`: An Invoice object containing updated invoice details

**Returns:** The updated Invoice object


**Example (JavaScript):**
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

async function updateExistingInvoice() {
  try {
    const orderId = "35";
    const invoice = await client.get_invoice_by_order_id(orderId);
    
    // Update invoice details
    invoice.NET_AMOUNT = 1500.00;
    invoice.IS_PAID = true; // Change from No to Yes
    
    const result = await client.update_invoice(invoice.ID, invoice);
    console.log(`Updated invoice: Amount=${result.NET_AMOUNT}, Paid=${result.IS_PAID ? 'Yes' : 'No'}`);
    return result;
  } catch (error) {
    console.error(`Update failed: ${error.message}`);
    return null;
  }
}
updateExistingInvoice();
```

#### `get_payments(options)`

Retrieves a list of payments with optional filtering.

**Parameters (all optional):**
- `page_number`: Page number for pagination (default: 1)
- `page_size`: Number of items per page (default: 10)
- `satim_order_id`: Filter by Satim order ID
- `invoice_id`: Filter by invoice ID
- `from_date`: Start date filter (format: 'YYYY-MM-DDTHH:MM:SSZ')
- `to_date`: End date filter (format: 'YYYY-MM-DDTHH:MM:SSZ')

**Returns:** A dictionary/object containing payment records and pagination info


**Example (JavaScript):**
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

async function getRecentPayments() {
  const endDate = new Date().toISOString();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  try {
    // Fetching payments from the last 30 days
    const payments = await client.get_payments({
      pageSize: 50,
      from_date: startDate.toISOString(),
      to_date: endDate
    });
    
    // Assuming 'payments' is an array or object with a 'payments' field
    console.log(`Found ${payments.length} payments in the last 30 days`);
  } catch (error) {
    console.error("Error fetching payments:", error);
  }
}


getRecentPayments();
```

### Document Operations

#### `get_pdf_recipt(satim_order_id)`

Generates a PDF receipt for a specific payment.

**Parameters:**
- `satim_order_id`: The Satim order ID for the payment

**Returns:** PDF receipt as binary data


**Example (JavaScript):**
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

const fs = require('fs');

async function savePdfReceipt() {
  const satimOrderId = "SATIM-12345";
  
  try {
    // Fetching the PDF receipt data
    const pdfData = await client.get_pdf_recipt(satimOrderId);
    
    // Writing the PDF data to a file
    fs.writeFileSync(`receipt_${satimOrderId}.pdf`, pdfData);
    console.log(`Receipt saved to receipt_${satimOrderId}.pdf`);
  } catch (error) {
    console.error("Error saving PDF receipt:", error);
  }
}



savePdfReceipt();
```

#### `send_pdf_recipt_mail(satim_order_id, email)`

Sends a PDF receipt to a specified email address.

**Parameters:**
- `satim_order_id`: The Satim order ID for the payment
- `email`: The email address to send the receipt to

**Returns:** API response indicating success or failure


**Example (JavaScript):**
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client'); 

// Initialize the client
const client = new ttk_epay();

async function emailReceipt() {
  const satimOrderId = "SATIM-12345";
  const email = "customer@example.com";
  
  try {
    // Sending the receipt via email
    const result = await client.send_pdf_recipt_mail(satimOrderId, email);
    
    // Check if the result is in the expected format or status
    if (result) {
      console.log(`Receipt sent successfully to ${email}`);
    } else {
      console.log("Receipt could not be sent. No result returned.");
    }
  } catch (error) {
    console.error(`Failed to send receipt: ${error.message}`);
  }
}


emailReceipt();
```

### Payment Operations

#### `post_payement(payment_data)`

Processes a new payment.

**Parameters:**
- `payment_data`: An InvoiceDto object containing payment details

**Returns:** Payment processing result object


**Example (JavaScript):**
```javascript
async function processPayment() {
  // Create payment data
  const payment = new InvoiceDto({
    INVOICE_NUMBER: 12345,
    ORDER_ID: "ORD-2025-5678",
    CLIENT_NAME: "Jane Smith",
    CLIENT_CODE: 456,
    CLIENT_ADDRESS: "456 Customer St.",
    CLIENT_MAIL: "jane@example.com",
    PRODUCT_NAME: "Premium Package",
    NET_AMOUNT: 750.00
  });

  try {
    // Process the payment
    const result = await client.post_payement(payment);
    
    // Check if the result has the expected fields
    if (result && result.SATIM_ORDER_ID && result.PAYMENT_URL) {
      console.log(`Payment initialized with Satim Order ID: ${result.SATIM_ORDER_ID}`);
      console.log(`Payment URL: ${result.PAYMENT_URL}`);
    } else {
      console.error("Unexpected result format: Missing SATIM_ORDER_ID or PAYMENT_URL");
    }
  } catch (error) {
    console.error(`Error processing payment: ${error.message}`);
  }
}

```

#### `get_payment_status(satim_order_id)`

Checks the status of a payment.

**Parameters:**
- `satim_order_id`: The Satim order ID for the payment

**Returns:** Payment status object with transaction details


**Example (JavaScript):**
```javascript
async function checkPaymentStatus() {
  try {
    // Fetching the payment status
    const status = await client.get_payment_status("SATIM-12345");
    
    // Check if the status object is valid and has expected properties
    if (status && status.STATUS && status.TRANSACTION_TIME) {
      console.log(`Payment status: ${status.STATUS}`);
      console.log(`Transaction time: ${status.TRANSACTION_TIME}`);
      
      // If payment is completed, log the authorization code
      if (status.STATUS === 'COMPLETED' && status.AUTHORIZATION_CODE) {
        console.log(`Authorization code: ${status.AUTHORIZATION_CODE}`);
      } else if (status.STATUS === 'COMPLETED') {
        console.log("Authorization code not available.");
      }
    } else {
      console.error("Invalid status response: Missing required fields.");
    }
  } catch (error) {
    console.error(`Error checking payment status: ${error.message}`);
  }
}

```

## Data Models

### Invoice

The primary data model for invoice operations.

#### Fields

| Field Name | Type | Description |
|------------|------|-------------|
| ID | int | Required. Invoice ID (auto-assigned for new invoices) |
| INVOICE_NUMBER | int | Invoice reference number |
| ORDER_ID | string | Order reference ID |
| INVOICE_DATE | string | ISO 8601 datetime string (e.g., "2025-05-07T12:45:27.142Z") |
| INVOICE_TYPE_CODE | string | Type code for the invoice |
| NET_AMOUNT | float | Net amount before taxes |
| INVOICE_TVA | float | VAT rate (e.g., 0.19 for 19%) |
| AMOUNT_TVA | float | VAT amount |
| AMOUNT_TTC | float | Total amount including taxes |
| INVOICE_STATE_CODE | string | Status code for the invoice |
| ORDER_NAME | string | Name or description of the order |
| CLIENT_CODE | int | Client reference code |
| CLIENT_NAME | string | Client name |
| CLIENT_NRC | string | Client NRC (business registration) |
| CLIENT_ADDRESS | string | Client's address |
| CLIENT_MAIL | string | Client's email address |
| CLIENT_IDF | string | Client's tax identification |
| PRODUCT_NAME | string | Name of the product or service |
| IS_PAID | boolean | Payment status flag (default: false) |

### InvoiceDto

Simplified data model for payment processing operations.

#### Fields

| Field Name | Type | Description |
|------------|------|-------------|
| INVOICE_NUMBER | int | Required. Invoice reference number |
| ORDER_ID | string | Order reference ID |
| INVOICE_DATE | string | ISO 8601 datetime string |
| INVOICE_TYPE_CODE | string | Type code for the invoice |
| NET_AMOUNT | float | Net amount before taxes |
| CLIENT_CODE | int | Client reference code |
| CLIENT_NAME | string | Client name |
| CLIENT_ADDRESS | string | Client's address |
| CLIENT_MAIL | string | Client's email address |
| PRODUCT_NAME | string | Name of the product or service |

## Error Handling

 JavaScript implementations handle errors differently:



### JavaScript

The JavaScript library uses Promise-based error handling:

```javascript
const axios = require('axios');

// Sample client function simulating the API call
const client = {
  get_invoice_by_order_id: (orderId) => {
    return new Promise((resolve, reject) => {
      // Simulating a response or error based on the orderId
      if (orderId === "NON-EXISTENT") {
        reject(new Error("Invoice not found"));
      } else {
        resolve({ orderId: orderId, amount: 100 });
      }
    });
  }
};

// 1. Promise-based error handling using .then() and .catch()
client.get_invoice_by_order_id("NON-EXISTENT")
  .then(invoice => {
    console.log("Invoice found:", invoice);
  })
  .catch(error => {
    console.error("Error details:", error.message);
  });

// 2. Async/await error handling with try-catch
async function fetchInvoice() {
  try {
    const invoice = await client.get_invoice_by_order_id("NON-EXISTENT");
    console.log("Invoice found:", invoice);
  } catch (error) {
    console.error("Error details:", error.message);
  }
}

fetchInvoice();

```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.














































