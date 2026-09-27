import {
  alertMessage,
  getLocalStorage,
  renderBreadcrumb,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";
import {
  productOriginalPriceDetails,
  productDiscountSaveDetails,
} from "./ProductCalculateDiscount.mjs";

export default class ProductDetails {
  constructor(productId, dataSource, category) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.category = category;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    renderBreadcrumb(this.category || this.product.Category || "products");
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart");
    if (!Array.isArray(cart)) {
      cart = [];
    }
    const existingProduct = cart.find((item) => item.Id === this.product.Id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.product.quantity = 1;
      cart.push(this.product);
    }

    setLocalStorage("so-cart", cart);
    updateCartCount();
    alertMessage(`${this.product.Name} was added to your cart.`);
  }

  renderProductDetails() {
    document.querySelector(".product-detail").innerHTML =
      productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  return `<h3>${product.Brand.Name} </h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
      ${productOriginalPriceDetails(product.FinalPrice, product.SuggestedRetailPrice)}
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      ${productDiscountSaveDetails(product.FinalPrice, product.SuggestedRetailPrice)}
    </div>
    
    `;
}
