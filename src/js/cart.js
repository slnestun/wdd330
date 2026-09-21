import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

function renderCartContents() {
  const storedCart = getLocalStorage("so-cart");
  const cartItems = Array.isArray(storedCart) ? storedCart : [];
  const productList = document.querySelector(".product-list");

  if (!productList) return;

  productList.innerHTML = cartItems.map(cartItemTemplate).join("");

  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (cartItems.length > 0 && cartFooter && cartTotal) {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.FinalPrice) * (item.quantity || 1),
      0,
    );

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  } else if (cartFooter) {
    cartFooter.classList.add("hide");
  }
}

function removeCartItem(productId) {
  const storedCart = getLocalStorage("so-cart");
  const cartItems = Array.isArray(storedCart) ? storedCart : [];
  const updatedCart = cartItems.filter(
    (item) => String(item.Id) !== String(productId),
  );

  setLocalStorage("so-cart", updatedCart);
  renderCartContents();
  updateCartCount();
}

function cartItemTemplate(item) {
  const subtotal = Number(item.FinalPrice) * (item.quantity || 1);

  return `<li class="cart-card divider">
    <button
      type="button"
      class="cart-card__remove"
      data-id="${item.Id}"
      aria-label="Remove ${item.Name} from cart"
    >&times;</button>
    <a href="../product_pages/?product=${item.Id}" class="cart-card__image">
      <img
        src="${item.Images?.PrimarySmall || item.Images?.PrimaryMedium || item.Image}"
        alt="${item.Name}"
        onerror="this.onerror=null; this.src='/images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg'"
      />
    </a>
    <a href="../product_pages/?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity}</p>
    <p class="cart-card__price">$${Number(item.FinalPrice).toFixed(2)}</p>
    <p class="cart-card__subtotal">subtotal:</p>
    <p class="subtotal_price">$${subtotal.toFixed(2)}</p>
  </li>`;
}

renderCartContents();
loadHeaderFooter(updateCartCount);

document.querySelector(".product-list")?.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".cart-card__remove");

  if (removeButton) {
    removeCartItem(removeButton.dataset.id);
  }
});
