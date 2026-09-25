import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter(updateCartCount);

const checkout = new CheckoutProcess(
  "so-cart",
  "#order-summary",
  new ExternalServices(),
);

const form = document.querySelector("#checkout-form");
document
  .querySelector("#zip")
  .addEventListener("blur", checkout.calculateOrdertotal.bind(checkout));
const message = document.querySelector("#checkout-message");

checkout.init();
checkout.calculateOrdertotal();

if (checkout.itemCount === 0) {
  message.textContent = "Your cart is empty. Add an item before checking out.";
  form.querySelector("button[type='submit']").disabled = true;
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  form.reportValidity();

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  message.textContent = "Submitting your order...";

  try {
    if (form.checkValidity()) {
      await checkout.checkout();
      message.textContent = "Order submitted successfully.";
    }
  } catch (error) {
    message.textContent = error.message;
    submitButton.disabled = false;
  }
});
