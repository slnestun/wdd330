const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {}
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category.toLowerCase()}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    // eslint-disable-next-line no-console
    console.log(data.Result);
    return data.Result;
  }
}
