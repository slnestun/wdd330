import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, listElement);
const sortSelect = document.querySelector("#sort-products");

productList.init();
sortSelect?.addEventListener("change", (event) => {
    productList.sortBy(event.target.value);
});
loadHeaderFooter(updateCartCount);
