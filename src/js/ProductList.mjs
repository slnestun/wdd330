import { renderListWithTemplate, getParam } from "./utils.mjs";
import { productOriginalPriceDetails } from "./ProductCalculateDiscount.mjs";

function productCardTemplate(product) {
  // eslint-disable-next-line no-console
  console.log(product);
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

  // I used AI to modify this part.
  async init() {
    const param = getParam("search");
    const list = await this.dataSource.getData(this.category);
    let listToRender = list;

    if (param) {
      listToRender = list.filter((product) =>
        product.Name.toLowerCase().includes(param.toLowerCase()),
      );
    }
    if (listToRender.length === 0) {
      this.listElement.innerHTML = "";
      this.listElement.innerHTML = `${param} doesn't exist, Please check if it is spelled correctly`;
    } else {
      this.renderList(listToRender);
    }
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
