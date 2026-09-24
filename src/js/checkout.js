import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter(updateCartCount);

const form = document.querySelector("#checkout-form");
const zip = document.querySelector("#zip");
const message = document.querySelector("#checkout-message");
const checkoutProcess = new CheckoutProcess(
  "so-cart",
  "#order-summary",
  new ExternalServices(),
);

checkoutProcess.init();

if (checkoutProcess.itemCount === 0) {
  message.textContent = "Your cart is empty. Add an item before checking out.";
  form.querySelector("button[type='submit']").disabled = true;
}

zip?.addEventListener("change", () => checkoutProcess.calculateOrderTotal());

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  message.textContent = "Submitting your order...";

  try {
    await checkoutProcess.checkout(form);
    message.textContent = "Order submitted successfully.";
  } catch (error) {
    message.textContent = error.message;
    submitButton.disabled = false;
  }
});
