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
    this.products = [];
  }

  async init() {
    const param = getParam("search");
    const list = await this.dataSource.getData(
      param ? undefined : this.category,
    );

    const title = document.querySelector(".products h2");
    if (param && title) {
      title.textContent = `Search results for: "${param}"`;
    } else {
      if (this.category) {
        const categoryName = this.category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        title.textContent = `Top Products: ${categoryName}`;
      }
    }
    let listToRender = list || [];

    if (param) {
      listToRender = listToRender.filter((product) =>
        product.Name.toLowerCase().includes(param.toLowerCase()),
      );
    }

    this.products = listToRender;
    this.listElement.innerHTML = "";

    if (listToRender.length === 0) {
      const searchTerm = param || "Item";
      this.listElement.innerHTML = `<li class="no-products-found"><p>${searchTerm} doesn't exist, Please check if it is spelled correctly</p></li>`;
    } else {
      this.renderList(listToRender);
    }
  }

  sortBy(sortOrder) {
    const sortedProducts = [...this.products].sort(
      (firstProduct, secondProduct) => {
        if (sortOrder === "name") {
          return firstProduct.Name.localeCompare(secondProduct.Name);
        }

        return (
          Number(firstProduct.FinalPrice) - Number(secondProduct.FinalPrice)
        );
      },
    );

    this.renderList(sortedProducts);
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
