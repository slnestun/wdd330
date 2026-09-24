import { getLocalStorage } from "./utils.mjs";

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
  constructor(key, outputSelector, externalServices) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.externalServices = externalServices;
    this.list = [];
    this.itemCount = 0;
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    const storedCart = getLocalStorage(this.key);
    this.list = Array.isArray(storedCart) ? storedCart : [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    this.itemCount = this.list.reduce(
      (total, item) => total + (Number(item.quantity) || 1),
      0,
    );
    this.itemTotal = this.list.reduce(
      (total, item) =>
        total + Number(item.FinalPrice) * (Number(item.quantity) || 1),
      0,
    );

    const itemCount = document.querySelector(
      `${this.outputSelector} #item-count`,
    );
    const subtotal = document.querySelector(
      `${this.outputSelector} #item-subtotal`,
    );

    if (itemCount) {
      itemCount.textContent = `${this.itemCount} item${this.itemCount === 1 ? "" : "s"}`;
    }
    if (subtotal) {
      subtotal.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping =
      this.itemCount > 0 ? 10 + Math.max(this.itemCount - 1, 0) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #order-total`,
    );

    if (tax) tax.textContent = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.textContent = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    this.calculateOrderTotal();
    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    return this.externalServices.checkout(order);
  }
}
