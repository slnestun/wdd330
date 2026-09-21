import { renderListWithTemplate } from "./utils.mjs";
import { productOriginalPriceDetails } from "./ProductCalculateDiscount.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        ${productOriginalPriceDetails(product.FinalPrice, product.SuggestedRetailPrice)}
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    this.products = await this.dataSource.getData(this.category);
    const title = document.querySelector(".products h2");
    const categoryName = this.category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (title) {
      title.textContent = `Top Products: ${categoryName}`;
    }
    this.renderList(this.products);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }

  sortBy(sortOrder) {
    const sortedProducts = [...this.products].sort((firstProduct, secondProduct) => {
      if (sortOrder === "name") {
        return firstProduct.Name.localeCompare(secondProduct.Name);
      }

      return Number(firstProduct.FinalPrice) - Number(secondProduct.FinalPrice);
    });

    this.renderList(sortedProducts);
  }
}
