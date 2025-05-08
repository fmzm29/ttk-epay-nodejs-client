const axios = require('axios');
const { Invoice, InvoiceDto } = require('./models');

const BASE_URL = 'https://pay.deploily.cloud/api/v1';

class ttk_epay {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
    });
  }

  async get_invoices(pageNumber = 1, pageSize = 10) {
    const response = await this.client.get('/admin/invoices', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  }

  async create_invoice(invoiceData) {
    const response = await this.client.post('/admin/invoices', invoiceData);
    return response.data;
  }

  async get_invoice_by_order_id(orderId) {
    const response = await this.client.get(`/admin/invoices/${orderId}`);
    return response.data;
  }

  async update_invoice(invoiceId, invoiceData) {
    const response = await this.client.patch(`/admin/invoices/${invoiceId}`, invoiceData);
    return response.data;
  }

  async get_payments({ pageNumber, pageSize, satim_order_id, invoice_id, from_date, to_date } = {}) {
    const params = {};
    if (pageNumber) params.pageNumber = pageNumber;
    if (pageSize) params.pageSize = pageSize;
    if (satim_order_id) params.SatimOrderId = satim_order_id;
    if (invoice_id) params.InvoiceId = invoice_id;
    if (from_date) params.FromDate = from_date;
    if (to_date) params.toDate = to_date;

    const response = await this.client.get('/admin/payments', { params });
    return response.data;
  }

  async get_pdf_recipt(satim_order_id) {
    const response = await this.client.get('/epayment/generate-pdf', {
      params: { SATIM_ORDER_ID: satim_order_id },
      responseType: 'arraybuffer',
    });
    return response.data;
  }

  async send_pdf_recipt_mail(satim_order_id, email) {
    const response = await this.client.get('/epayment/send-mail', {
      params: { SATIM_ORDER_ID: satim_order_id, EMAIL: email },
    });
    return response.headers['content-type'] === 'application/json'
      ? response.data
      : response.data.toString();
  }

  async post_payement(paymentData) {
    const response = await this.client.post('/epayment', paymentData);
    return response.data;
  }

  async get_payment_status(satim_order_id) {
    const response = await this.client.get('/epayment', {
      params: { SATIM_ORDER_ID: satim_order_id },
    });
    return response.data;
  }
}

module.exports = { ttk_epay };
