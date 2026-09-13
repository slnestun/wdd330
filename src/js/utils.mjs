// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// retrieve a named parameter from the current URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  let cartCount = document.querySelector(".cart-count");

  // If the badge doesn't exist, try to create and append it to the .cart container
  if (!cartCount) {
    const cartEl = document.querySelector(".cart");
    if (cartEl) {
      const span = document.createElement("span");
      span.className = "cart-count";
      span.style.display = "none";
      cartEl.appendChild(span);
      cartCount = span;
    }
  }

  if (!cartCount) return;

  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? "flex" : "none";
}