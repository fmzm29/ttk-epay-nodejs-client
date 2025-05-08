class Invoice {
  constructor({
    ID,
    INVOICE_NUMBER = null,
    ORDER_ID = null,
    INVOICE_DATE = null,
    INVOICE_TYPE_CODE = null,
    NET_AMOUNT = null,
    INVOICE_TVA = null,
    AMOUNT_TVA = null,
    AMOUNT_TTC = null,
    INVOICE_STATE_CODE = null,
    ORDER_NAME = null,
    CLIENT_CODE = null,
    CLIENT_NAME = null,
    CLIENT_NRC = null,
    CLIENT_ADDRESS = null,
    CLIENT_MAIL = null,
    CLIENT_IDF = null,
    PRODUCT_NAME = null,
    IS_PAID = false,
  }) {
    this.ID = ID;
    this.INVOICE_NUMBER = INVOICE_NUMBER;
    this.ORDER_ID = ORDER_ID;
    this.INVOICE_DATE = INVOICE_DATE;
    this.INVOICE_TYPE_CODE = INVOICE_TYPE_CODE;
    this.NET_AMOUNT = NET_AMOUNT;
    this.INVOICE_TVA = INVOICE_TVA;
    this.AMOUNT_TVA = AMOUNT_TVA;
    this.AMOUNT_TTC = AMOUNT_TTC;
    this.INVOICE_STATE_CODE = INVOICE_STATE_CODE;
    this.ORDER_NAME = ORDER_NAME;
    this.CLIENT_CODE = CLIENT_CODE;
    this.CLIENT_NAME = CLIENT_NAME;
    this.CLIENT_NRC = CLIENT_NRC;
    this.CLIENT_ADDRESS = CLIENT_ADDRESS;
    this.CLIENT_MAIL = CLIENT_MAIL;
    this.CLIENT_IDF = CLIENT_IDF;
    this.PRODUCT_NAME = PRODUCT_NAME;
    this.IS_PAID = IS_PAID;
  }
}

class InvoiceDto {
  constructor({
    INVOICE_NUMBER,
    ORDER_ID = null,
    INVOICE_DATE = null,
    INVOICE_TYPE_CODE = null,
    NET_AMOUNT = null,
    CLIENT_CODE = null,
    CLIENT_NAME = null,
    CLIENT_ADDRESS = null,
    CLIENT_MAIL = null,
    PRODUCT_NAME = null,
  }) {
    this.INVOICE_NUMBER = INVOICE_NUMBER;
    this.ORDER_ID = ORDER_ID;
    this.INVOICE_DATE = INVOICE_DATE;
    this.INVOICE_TYPE_CODE = INVOICE_TYPE_CODE;
    this.NET_AMOUNT = NET_AMOUNT;
    this.CLIENT_CODE = CLIENT_CODE;
    this.CLIENT_NAME = CLIENT_NAME;
    this.CLIENT_ADDRESS = CLIENT_ADDRESS;
    this.CLIENT_MAIL = CLIENT_MAIL;
    this.PRODUCT_NAME = PRODUCT_NAME;
  }
}

module.exports = { Invoice, InvoiceDto };
