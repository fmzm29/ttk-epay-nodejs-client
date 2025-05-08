const { ttk_epay } = require('../src');

async function main() {
  const ttkEpay = new ttk_epay();

  try {
    // Test fetching invoices
    const invoices = await ttkEpay.get_invoices(1, 10);  
    console.log('Fetched invoices:', invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
  }

  try {
    // Test creating an invoice
    const newInvoice = await ttkEpay.create_invoice({  
      amount: 150,
      description: 'Manual test invoice'
    });
    console.log('Created invoice:', newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error.message);
  }

  try {
    // Test getting invoice by order ID
    const invoice = await ttkEpay.get_invoice_by_order_id('12345');  
    console.log('Invoice by order ID:', invoice);
  } catch (error) {
    console.error('Error fetching invoice by order ID:', error.message);
  }

  try {
    // Test payment status
    const status = await ttkEpay.get_payment_status('12345'); 
    console.log('Payment status:', status);
  } catch (error) {
    console.error('Error fetching payment status:', error.message);
  }

  try {
    // Test posting a payment
    const paymentResponse = await ttkEpay.post_payement({  
      amount: 200,
      method: 'credit_card'
    });
    console.log('Posted payment:', paymentResponse);
  } catch (error) {
    console.error('Error posting payment:', error.message);
  }
}

main();
