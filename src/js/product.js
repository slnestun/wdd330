import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter(updateCartCount);

const productId = getParam("product");
const dataSource = new ExternalServices();

if (productId) {
  const product = new ProductDetails(productId, dataSource);
  product.init();
}
