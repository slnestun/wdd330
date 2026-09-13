import { updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const productList = document.querySelector(".product-list");

  if (productList) {
    productList.innerHTML = "";
  }
}

renderCartContents();
updateCartCount();
