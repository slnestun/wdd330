import { renderListWithTemplate, getParam } from "./utils.mjs";
import { productOriginalPriceDetails } from "./ProductCalculateDiscount.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.NameWithoutBrand}</h3>
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
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    const param = getParam("search");

    const title = document.querySelector(".products h2");
    if (this.category && title) {
      const categoryName = this.category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      title.textContent = `Top Products: ${categoryName}`;
    } else if (param && title) {
      title.textContent = `Search results for: "${param}"`;
    }

    let listToRender = list || [];

    if (param) {
      listToRender = listToRender.filter((product) =>
        product.Name.toLowerCase().includes(param.toLowerCase()),
      );
    }

    this.listElement.innerHTML = "";

    if (listToRender.length === 0) {
      const searchTerm = param || "Item";
      this.listElement.innerHTML = `<li class="no-products-found"><p>${searchTerm} doesn't exist, Please check if it is spelled correctly</p></li>`;
    } else {
      this.renderList(listToRender);
    }
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
