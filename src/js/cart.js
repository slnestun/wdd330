import { updateCartCount, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const productList = document.querySelector(".product-list");

  if (productList) {
    productList.innerHTML = "";
  }
}

renderCartContents();
updateCartCount();
