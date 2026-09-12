import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
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
  }

  renderProductDetails() {
    document.querySelector(".product-detail").innerHTML =
      productDetailsTemplate(this.product);
  }
}

const productOriginalPriceDetails = (FinalPrice, SuggestedRetailPrice) => {
  if(FinalPrice >= SuggestedRetailPrice) return "";
  const savings = SuggestedRetailPrice.toFixed(2);
  return `<p class="product-card__original_price"> <s>$${savings}</s></p>`;
}

const productDiscountSaveDetails = (FinalPrice, SuggestedRetailPrice) => {
  if(FinalPrice >= SuggestedRetailPrice) return "";
  const savings = Math.round(FinalPrice < SuggestedRetailPrice).toFixed(2);
  return `<div class="product-card_save_price">Save $${savings}</div>`;
}

function productDetailsTemplate(product) {
  return `<h3>${product.Brand.Name} </h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Image}"
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
