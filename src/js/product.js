import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter(updateCartCount);

const productId = getParam("product");
const dataSource = new ProductData();

if (productId) {
  const product = new ProductDetails(productId, dataSource);
  product.init();
}