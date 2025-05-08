const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { ttk_epay } = require('../src/ttk-epay');  

describe('TtkEpay', () => {
  let ttkEpay;
  let mock;

  beforeEach(() => {
    ttkEpay = new ttk_epay();  
    mock = new MockAdapter(ttkEpay.client);
  });

  afterEach(() => {
    mock.reset();
  });

  test('should fetch invoices successfully', async () => {
    const mockResponse = {
      invoices: [],
      pagination: {
        total: 0
      }
    };
    
    mock.onGet('/admin/invoices').reply(200, mockResponse);

    const response = await ttkEpay.get_invoices(1, 10);  
    expect(response).toEqual(mockResponse);
  });

  test('should handle error when fetching invoices', async () => {
    mock.onGet('/admin/invoices').reply(500);

    await expect(ttkEpay.get_invoices(1, 10)).rejects.toThrow();  
  });

  test('should create an invoice successfully', async () => {
    const invoiceData = {
      amount: 100,
      description: 'Test invoice'
    };

    const mockResponse = {
      id: 1,
      amount: 100,
      description: 'Test invoice'
    };

    mock.onPost('/admin/invoices').reply(200, mockResponse);

    const response = await ttkEpay.create_invoice(invoiceData); 
    expect(response).toEqual(mockResponse);
  });

  test('should handle error when creating an invoice', async () => {
    const invoiceData = {
      amount: 100,
      description: 'Test invoice'
    };

    mock.onPost('/admin/invoices').reply(400);

    await expect(ttkEpay.create_invoice(invoiceData)).rejects.toThrow();  
  });

  test('should fetch invoice by order ID successfully', async () => {
    const orderId = '12345';
    const mockResponse = {
      orderId: '12345',
      amount: 100,
      description: 'Test invoice'
    };

    mock.onGet(`/admin/invoices/${orderId}`).reply(200, mockResponse);

    const response = await ttkEpay.get_invoice_by_order_id(orderId);  
    expect(response).toEqual(mockResponse);
  });

  test('should handle error when fetching invoice by order ID', async () => {
    const orderId = '12345';
    mock.onGet(`/admin/invoices/${orderId}`).reply(404);

    await expect(ttkEpay.get_invoice_by_order_id(orderId)).rejects.toThrow();  
  });

  test('should fetch PDF receipt successfully', async () => {
    const satimOrderId = '12345';
    const mockResponse = Buffer.from('mock pdf content');

    mock.onGet('/epayment/generate-pdf').reply(200, mockResponse);

    const response = await ttkEpay.get_pdf_recipt(satimOrderId);  
    expect(response).toEqual(mockResponse);
  });

  test('should handle error when fetching PDF receipt', async () => {
    const satimOrderId = '12345';
    mock.onGet('/epayment/generate-pdf').reply(500);

    await expect(ttkEpay.get_pdf_recipt(satimOrderId)).rejects.toThrow();  
  });

  test('should send PDF receipt via email successfully', async () => {
    const satimOrderId = '12345';
    const email = 'test@example.com';
    const mockResponse = 'PDF sent successfully';

    mock.onGet('/epayment/send-mail').reply(200, mockResponse);

    const response = await ttkEpay.send_pdf_recipt_mail(satimOrderId, email);  
    expect(response).toEqual(mockResponse);
  });

  test('should handle error when sending PDF receipt via email', async () => {
    const satimOrderId = '12345';
    const email = 'test@example.com';
    mock.onGet('/epayment/send-mail').reply(500);

    await expect(ttkEpay.send_pdf_recipt_mail(satimOrderId, email)).rejects.toThrow();  
  });

  test('should post payment successfully', async () => {
    const paymentData = {
      amount: 100,
      method: 'credit_card'
    };

    const mockResponse = {
      id: 1,
      amount: 100,
      method: 'credit_card'
    };

    mock.onPost('/epayment').reply(200, mockResponse);

    const response = await ttkEpay.post_payement(paymentData); 
    expect(response).toEqual(mockResponse);
  });

  test('should handle error when posting payment', async () => {
    const paymentData = {
      amount: 100,
      method: 'credit_card'
    };

    mock.onPost('/epayment').reply(400);

    await expect(ttkEpay.post_payement(paymentData)).rejects.toThrow();  
  });

  test('should fetch payment status successfully', async () => {
    const satimOrderId = '12345';
    const mockResponse = {
      status: 'paid'
    };

    mock.onGet('/epayment').reply(200, mockResponse);

    const response = await ttkEpay.get_payment_status(satimOrderId);  
    expect(response).toEqual(mockResponse);
  });

  test('should handle error when fetching payment status', async () => {
    const satimOrderId = '12345';
    mock.onGet('/epayment').reply(500);

    await expect(ttkEpay.get_payment_status(satimOrderId)).rejects.toThrow(); 
  });
});