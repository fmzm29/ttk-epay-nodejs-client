# TTK-Epay 

A comprehensive client SDK for interacting with the TTK-Epay payment processing API. This library provides a simple interface for managing invoices, processing payments, and generating receipts.

[![npm version](https://img.shields.io/npm/v/ttk-epay.svg)](https://www.npmjs.com/package/ttk-epay)
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
npm install ttk-epay
```

## Quick Start


### JavaScript

```javascript
const { Ttk_Epay, Invoice, InvoiceDto } = require('ttk-epay');

// Initialize the client
const client = new Ttk_Epay();

// Get list of invoices (async)
async function getInvoices() {
  const invoices = await client.get_invoices(1, 10);
  console.log(invoices);
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
async function listInvoices() {
  const invoices = await client.get_invoices(1, 20);
  console.log(`Current page: ${invoices.CURRENTPAGE}`);
  console.log(`Total pages: ${invoices.TOTALPAGES}`);
  invoices.invoices.forEach(invoice => {
    console.log(`Invoice #${invoice.INVOICE_NUMBER} - ${invoice.CLIENT_NAME}`);
  });
}
```

#### `create_invoice(invoice_data)`

Creates a new invoice.

**Parameters:**
- `invoice_data`: An Invoice object containing invoice details

**Returns:** The created Invoice object with server-assigned fields


**Example (JavaScript):**
```javascript
async function createNewInvoice() {
  const newInvoice = new Invoice({
    ID: 0,  // ID will be assigned by the server
    INVOICE_NUMBER: 12345,
    CLIENT_NAME: "Acme Corporation",
    CLIENT_CODE: 789,
    CLIENT_ADDRESS: "123 Business Ave, Suite 100",
    CLIENT_MAIL: "billing@acme.com",
    NET_AMOUNT: 1000.00,
    INVOICE_TVA: 0.19,  // 19% VAT
    AMOUNT_TVA: 190.00,
    AMOUNT_TTC: 1190.00,
    PRODUCT_NAME: "Enterprise Plan Subscription",
    INVOICE_DATE: "2025-05-08T10:00:00.000Z"
  });
  
  const createdInvoice = await client.create_invoice(newInvoice);
  console.log(`Created invoice with ID: ${createdInvoice.ID}`);
}
```

#### `get_invoice_by_order_id(order_id)`

Retrieves a specific invoice by its order ID.

**Parameters:**
- `order_id`: The order ID of the invoice to retrieve

**Returns:** The Invoice object if found


**Example (JavaScript):**
```javascript
async function findInvoiceByOrderId() {
  try {
    const invoice = await client.get_invoice_by_order_id("ORD-2025-1234");
    console.log(`Found invoice: ${invoice.INVOICE_NUMBER} for ${invoice.CLIENT_NAME}`);
  } catch (error) {
    console.error(`Invoice not found: ${error.message}`);
  }
}
```

#### `update_invoice(invoice_id, invoice_data)`

Updates an existing invoice.

**Parameters:**
- `invoice_id`: The ID of the invoice to update
- `invoice_data`: An Invoice object containing updated invoice details

**Returns:** The updated Invoice object


**Example (JavaScript):**
```javascript
async function updateExistingInvoice() {
  // First get the invoice
  const invoice = await client.get_invoice_by_order_id("ORD-2025-1234");
  
  // Update fields
  invoice.NET_AMOUNT = 1500.00;
  invoice.AMOUNT_TVA = 285.00;  // 19% of 1500
  invoice.AMOUNT_TTC = 1785.00;
  
  // Update the invoice
  const result = await client.update_invoice(invoice.ID, invoice);
  console.log(`Updated invoice amount: ${result.AMOUNT_TTC}`);
}
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
async function getRecentPayments() {
  const endDate = new Date().toISOString();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  const payments = await client.get_payments({
    pageSize: 50,
    from_date: startDate.toISOString(),
    to_date: endDate
  });
  
  console.log(`Found ${payments.payments.length} payments in the last 30 days`);
}
```

### Document Operations

#### `get_pdf_recipt(satim_order_id)`

Generates a PDF receipt for a specific payment.

**Parameters:**
- `satim_order_id`: The Satim order ID for the payment

**Returns:** PDF receipt as binary data


**Example (JavaScript):**
```javascript
const fs = require('fs');

async function savePdfReceipt() {
  const satimOrderId = "SATIM-12345";
  const pdfData = await client.get_pdf_recipt(satimOrderId);
  
  fs.writeFileSync(`receipt_${satimOrderId}.pdf`, pdfData);
  console.log(`Receipt saved to receipt_${satimOrderId}.pdf`);
}
```

#### `send_pdf_recipt_mail(satim_order_id, email)`

Sends a PDF receipt to a specified email address.

**Parameters:**
- `satim_order_id`: The Satim order ID for the payment
- `email`: The email address to send the receipt to

**Returns:** API response indicating success or failure


**Example (JavaScript):**
```javascript
async function emailReceipt() {
  try {
    const result = await client.send_pdf_recipt_mail("SATIM-12345", "customer@example.com");
    console.log("Receipt sent successfully to customer@example.com");
  } catch (error) {
    console.error(`Failed to send receipt: ${error.message}`);
  }
}
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

  // Process the payment
  const result = await client.post_payement(payment);
  console.log(`Payment initialized with Satim Order ID: ${result.SATIM_ORDER_ID}`);
  console.log(`Payment URL: ${result.PAYMENT_URL}`);
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
  const status = await client.get_payment_status("SATIM-12345");
  console.log(`Payment status: ${status.STATUS}`);
  console.log(`Transaction time: ${status.TRANSACTION_TIME}`);
  if (status.STATUS === 'COMPLETED') {
    console.log(`Authorization code: ${status.AUTHORIZATION_CODE}`);
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
client.get_invoice_by_order_id("NON-EXISTENT")
  .then(invoice => {
    console.log("Invoice found:", invoice);
  })
  .catch(error => {
    console.error("Error details:", error.message);
  });

// Or with async/await:
try {
  const invoice = await client.get_invoice_by_order_id("NON-EXISTENT");
  console.log("Invoice found:", invoice);
} catch (error) {
  console.error("Error details:", error.message);
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
















































# ttk-epay-nodejs-client

A simple and efficient Node.js client for integrating with the ttk-epay API.

## Features
- Easy-to-use API client for ttk-epay.
- Supports all major API functionalities.
- Well-documented and simple to integrate.

## Installation

To install the package, use npm:

```bash
npm install ttk-epay-nodejs-client
```

## Exampel
```javascript
const { ttk_epay } = require('ttk-epay-nodejs-client');

async function main() {
  const client = new ttk_epay();

  try {
    const invoices = await client.get_invoices(1, 10);
    console.log('Invoices:', invoices);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
```



## Exampel
```javascript
// example-usage.js

const { Ttk_Epay, Invoice, InvoiceDto } = require('./index');

// Initialize the client
const client = new Ttk_Epay();

// Example 1: Get list of invoices
async function listInvoices() {
  try {
    console.log("\n=== Example 1: Listing Invoices ===");
    const invoices = await client.get_invoices(1, 10);
    console.log(`Retrieved ${invoices.invoices?.length || 0} invoices`);
    console.log(`Current page: ${invoices.CURRENTPAGE} of ${invoices.TOTALPAGES}`);
    
    // Display first invoice if available
    if (invoices.invoices && invoices.invoices.length > 0) {
      const firstInvoice = invoices.invoices[0];
      console.log("\nSample invoice:");
      console.log(`- Invoice #${firstInvoice.INVOICE_NUMBER}`);
      console.log(`- Client: ${firstInvoice.CLIENT_NAME}`);
      console.log(`- Amount: ${firstInvoice.AMOUNT_TTC}`);
      console.log(`- Status: ${firstInvoice.IS_PAID ? 'Paid' : 'Unpaid'}`);
    }
    return invoices;
  } catch (error) {
    console.error("Error listing invoices:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 2: Create a new invoice
async function createInvoice() {
  try {
    console.log("\n=== Example 2: Creating an Invoice ===");
    
    // Generate a unique invoice number using timestamp
    const invoiceNumber = parseInt(`${Date.now()}`.substring(0, 10));
    
    const newInvoice = new Invoice({
      ID: 0, // Will be assigned by server
      INVOICE_NUMBER: invoiceNumber,
      ORDER_ID: `ORD-${invoiceNumber}`,
      INVOICE_DATE: new Date().toISOString(),
      INVOICE_TYPE_CODE: "STD",
      NET_AMOUNT: 1000.00,
      INVOICE_TVA: 0.19, // 19% VAT
      AMOUNT_TVA: 190.00,
      AMOUNT_TTC: 1190.00,
      INVOICE_STATE_CODE: "NEW",
      ORDER_NAME: "Spring Collection Purchase",
      CLIENT_CODE: 123456,
      CLIENT_NAME: "Acme Corporation",
      CLIENT_NRC: "RC123456789",
      CLIENT_ADDRESS: "123 Commerce Blvd, Business District",
      CLIENT_MAIL: "finance@acmecorp.example",
      CLIENT_IDF: "TAX987654321",
      PRODUCT_NAME: "Enterprise Software Package",
      IS_PAID: false
    });
    
    console.log("Creating invoice...");
    const createdInvoice = await client.create_invoice(newInvoice);
    
    console.log(`Invoice created successfully!`);
    console.log(`- ID: ${createdInvoice.ID}`);
    console.log(`- Invoice #: ${createdInvoice.INVOICE_NUMBER}`);
    console.log(`- Client: ${createdInvoice.CLIENT_NAME}`);
    console.log(`- Amount: ${createdInvoice.AMOUNT_TTC}`);
    
    return createdInvoice;
  } catch (error) {
    console.error("Error creating invoice:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 3: Get invoice by order ID
async function getInvoiceByOrderId(orderId) {
  try {
    console.log(`\n=== Example 3: Finding Invoice by Order ID ===`);
    console.log(`Looking up order ID: ${orderId}`);
    
    const invoice = await client.get_invoice_by_order_id(orderId);
    
    console.log("Invoice found!");
    console.log(`- Invoice #: ${invoice.INVOICE_NUMBER}`);
    console.log(`- Client: ${invoice.CLIENT_NAME}`);
    console.log(`- Date: ${new Date(invoice.INVOICE_DATE).toLocaleDateString()}`);
    console.log(`- Amount: ${invoice.AMOUNT_TTC}`);
    console.log(`- Status: ${invoice.IS_PAID ? 'Paid' : 'Unpaid'}`);
    
    return invoice;
  } catch (error) {
    console.error(`Error finding invoice with order ID ${orderId}:`, error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 4: Update an invoice
async function updateInvoice(invoice) {
  try {
    console.log(`\n=== Example 4: Updating an Invoice ===`);
    console.log(`Updating invoice #${invoice.INVOICE_NUMBER}`);
    
    // Modify some fields
    invoice.NET_AMOUNT = 1250.00;
    invoice.INVOICE_TVA = 0.19;
    invoice.AMOUNT_TVA = 237.50;
    invoice.AMOUNT_TTC = 1487.50;
    invoice.PRODUCT_NAME = `${invoice.PRODUCT_NAME} (Updated)`;
    
    const updatedInvoice = await client.update_invoice(invoice.ID, invoice);
    
    console.log("Invoice updated successfully!");
    console.log(`- Invoice #: ${updatedInvoice.INVOICE_NUMBER}`);
    console.log(`- Product: ${updatedInvoice.PRODUCT_NAME}`);
    console.log(`- New Amount: ${updatedInvoice.AMOUNT_TTC}`);
    
    return updatedInvoice;
  } catch (error) {
    console.error(`Error updating invoice:`, error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 5: Get payments with filters
async function getFilteredPayments() {
  try {
    console.log(`\n=== Example 5: Getting Filtered Payments ===`);
    
    // Get payments from the last 30 days
    const endDate = new Date().toISOString();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const fromDate = startDate.toISOString();
    
    console.log(`Fetching payments from ${new Date(fromDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`);
    
    const paymentsResult = await client.get_payments({
      pageNumber: 1,
      pageSize: 20,
      from_date: fromDate,
      to_date: endDate
    });
    
    console.log(`Retrieved ${paymentsResult.payments?.length || 0} payments`);
    console.log(`Current page: ${paymentsResult.CURRENTPAGE} of ${paymentsResult.TOTALPAGES}`);
    
    // Display some payment info if available
    if (paymentsResult.payments && paymentsResult.payments.length > 0) {
      console.log("\nRecent payments:");
      paymentsResult.payments.slice(0, 3).forEach((payment, index) => {
        console.log(`\nPayment ${index + 1}:`);
        console.log(`- Order ID: ${payment.SATIM_ORDER_ID}`);
        console.log(`- Status: ${payment.STATUS}`);
        console.log(`- Amount: ${payment.AMOUNT}`);
        console.log(`- Date: ${new Date(payment.TRANSACTION_TIME).toLocaleString()}`);
      });
    }
    
    return paymentsResult;
  } catch (error) {
    console.error("Error getting payments:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 6: Process a payment
async function processPayment() {
  try {
    console.log(`\n=== Example 6: Processing a Payment ===`);
    
    // Generate a unique invoice number using timestamp
    const invoiceNumber = parseInt(`${Date.now()}`.substring(0, 10));
    
    const paymentData = new InvoiceDto({
      INVOICE_NUMBER: invoiceNumber,
      ORDER_ID: `ORD-${invoiceNumber}`,
      INVOICE_DATE: new Date().toISOString(),
      INVOICE_TYPE_CODE: "ECOM",
      NET_AMOUNT: 750.00,
      CLIENT_CODE: 789012,
      CLIENT_NAME: "Jane Smith",
      CLIENT_ADDRESS: "456 Customer Lane, Shopping District",
      CLIENT_MAIL: "jane.smith@example.com",
      PRODUCT_NAME: "Premium Subscription (1 Year)"
    });
    
    console.log("Processing payment...");
    console.log(`- Amount: ${paymentData.NET_AMOUNT}`);
    console.log(`- Client: ${paymentData.CLIENT_NAME}`);
    
    const paymentResult = await client.post_payement(paymentData);
    
    console.log("\nPayment initialized successfully!");
    console.log(`- Satim Order ID: ${paymentResult.SATIM_ORDER_ID}`);
    console.log(`- Payment URL: ${paymentResult.PAYMENT_URL}`);
    console.log(`\nCustomer should be redirected to the payment URL to complete payment.`);
    
    return paymentResult;
  } catch (error) {
    console.error("Error processing payment:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 7: Check payment status
async function checkPaymentStatus(satimOrderId) {
  try {
    console.log(`\n=== Example 7: Checking Payment Status ===`);
    console.log(`Checking status for order: ${satimOrderId}`);
    
    const statusResult = await client.get_payment_status(satimOrderId);
    
    console.log("\nPayment status retrieved:");
    console.log(`- Status: ${statusResult.STATUS}`);
    console.log(`- Transaction Time: ${new Date(statusResult.TRANSACTION_TIME).toLocaleString()}`);
    
    if (statusResult.STATUS === 'COMPLETED') {
      console.log(`- Authorization Code: ${statusResult.AUTHORIZATION_CODE}`);
      console.log(`- Card: ${statusResult.CARD_NUMBER} (${statusResult.CARD_TYPE})`);
    } else if (statusResult.STATUS === 'FAILED') {
      console.log(`- Error Code: ${statusResult.ERROR_CODE}`);
      console.log(`- Error Description: ${statusResult.ERROR_DESCRIPTION}`);
    }
    
    return statusResult;
  } catch (error) {
    console.error(`Error checking payment status:`, error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 8: Generate and save PDF receipt
async function generatePdfReceipt(satimOrderId) {
  try {
    console.log(`\n=== Example 8: Generating PDF Receipt ===`);
    console.log(`Generating receipt for order: ${satimOrderId}`);
    
    const pdfData = await client.get_pdf_recipt(satimOrderId);
    
    // In a real application, you would save this to a file
    console.log(`PDF receipt generated successfully!`);
    console.log(`- Size: ${pdfData.length} bytes`);
    console.log(`- You would normally save this to a file or serve it to the user`);
    
    // Example of saving (commented out to avoid file system operations in this example)
    /*
    const fs = require('fs');
    fs.writeFileSync(`receipt_${satimOrderId}.pdf`, pdfData);
    console.log(`- Saved to: receipt_${satimOrderId}.pdf`);
    */
    
    return pdfData;
  } catch (error) {
    console.error(`Error generating PDF receipt:`, error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
  }
}

// Example 9: Send receipt by email
async function sendReceiptByEmail(satimOrderId, email) {
  try {
    console.log(`\n=== Example 9: Sending Receipt by Email ===`);
    console.log(`Sending receipt for order: ${satimOrderId}`);
    console.log(`To email: ${email}`);
    
    const emailResult = await client.send_pdf_recipt_mail(satimOrderId, email);
    
    console.log("\nEmail sent successfully!");
    if (typeof emailResult === 'object') {
      console.log(`- Message: ${emailResult.message || 'Receipt sent'}`);
      if (emailResult.details) {
        console.log(`-
```

