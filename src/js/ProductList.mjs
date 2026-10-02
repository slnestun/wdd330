import {
  formatCategoryName,
  getParam,
  renderBreadcrumb,
  renderListWithTemplate,
} from "./utils.mjs";
import { productOriginalPriceDetails } from "./ProductCalculateDiscount.mjs";

function productCardTemplate(product, category) {
  const productCategory = product.Category || category;
  const categoryParam = productCategory
    ? `&category=${encodeURIComponent(productCategory)}`
    : "";

  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}${categoryParam}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.NameWithoutBrand}</h3>
        ${productOriginalPriceDetails(product.FinalPrice, product.SuggestedRetailPrice)}
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button class="quick-view-button" type="button" data-quick-view="${product.Id}">
        Quick view
      </button>
    </li>
    `;
}

function quickViewTemplate(product, category) {
  const productCategory = product.Category || category;
  const categoryParam = productCategory
    ? `&category=${encodeURIComponent(productCategory)}`
    : "";

  return `
    <button class="quick-view__close" type="button" aria-label="Close quick view">Close</button>
    <div class="quick-view__body">
      <img src="${product.Images.PrimaryLarge}" alt="${product.Name}">
      <div>
        <p class="quick-view__brand">${product.Brand.Name}</p>
        <h2 id="quick-view-title">${product.NameWithoutBrand}</h2>
        ${productOriginalPriceDetails(product.FinalPrice, product.SuggestedRetailPrice)}
        <p class="product-card__price">$${product.FinalPrice}</p>
        <p class="product__color">${product.Colors?.[0]?.ColorName || ""}</p>
        <div class="product__description">${product.DescriptionHtmlSimple || ""}</div>
        <a class="quick-view__details" href="/product_pages/?product=${product.Id}${categoryParam}">
          View full details
        </a>
      </div>
    </div>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
    this.dialog = document.createElement("dialog");
    this.dialog.className = "quick-view";
    this.dialog.setAttribute("aria-labelledby", "quick-view-title");
    document.body.append(this.dialog);

    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest("[data-quick-view]");
      if (!button) return;

      const product = this.products.find(
        (item) => String(item.Id) === button.dataset.quickView,
      );
      if (!product) return;

      this.dialog.innerHTML = quickViewTemplate(product, this.category);
      this.dialog.showModal();
      this.dialog.querySelector(".quick-view__close").focus();
    });

    this.dialog.addEventListener("click", (event) => {
      if (
        event.target === this.dialog ||
        event.target.closest(".quick-view__close")
      ) {
        this.dialog.close();
      }
    });
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
        const categoryName = formatCategoryName(this.category);
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
    renderBreadcrumb(
      param ? "search-results" : this.category || "products",
      listToRender.length,
    );
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
      (product) => productCardTemplate(product, this.category),
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
