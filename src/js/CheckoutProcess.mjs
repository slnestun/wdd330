import {
  alertMessage,
  getLocalStorage,
  removeAllAlerts,
  setLocalStorage,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  return Object.fromEntries(formData.entries());
}

export function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice),
    quantity: Number(item.quantity) || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemCount = 0;
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    const storedCart = getLocalStorage(this.key);
    this.list = Array.isArray(storedCart) ? storedCart : [storedCart];
    this.calculateItemSummary();
  }

  calculateOrdertotal() {
    this.tax = (Number(this.itemTotal) * 0.06).toFixed(2);
    this.shipping = this.list.length ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = (
      Number(this.itemTotal) +
      this.shipping +
      Number(this.tax)
    ).toFixed(2);
    this.displayOrderTotals();
  }

  calculateItemSummary() {
    this.itemCount = this.list.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
    );
    const subtotal = this.list.reduce(
      (sum, item) => sum + Number(item.FinalPrice || 0),
      0,
    );

    this.itemTotal = subtotal.toFixed(2);
    document.querySelector(`${this.outputSelector} #item-count`).textContent =
      this.list.length;
    document.querySelector(
      `${this.outputSelector} #item-subtotal`,
    ).textContent = `$${this.itemTotal}`;
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #order-total`,
    );

    if (tax) tax.textContent = `$${this.tax}`;
    if (shipping) shipping.textContent = `$${this.shipping}`;
    if (orderTotal) orderTotal.textContent = `$${this.orderTotal}`;
  }

  async checkout() {
    const form = document.forms.checkout;
    const payload = formDataToJSON(form);
    payload.orderDate = new Date().toISOString();
    payload.orderTotal = this.orderTotal;
    payload.tax = this.tax;
    payload.shipping = this.shipping;
    payload.items = packageItems(this.list);

    try {
      await services.checkout(payload);
      setLocalStorage(this.key, []);
      window.location.assign("/checkout/success.html");
    } catch (error) {
      removeAllAlerts();
      const messages =
        error.message && typeof error.message === "object"
          ? Object.values(error.message)
          : [error.message || "unable to place your order."];
      messages.forEach((message) => alertMessage(message));
    }
  }
}
