const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {}

  async getData(category) {
    if (!category) {
      let results;
      results = await Promise.all(
        ["tents", "backpacks", "sleeping-bags", "hammocks"].map((cat) =>
          this.getData(cat),
        ),
      );
      return results.flat();
    } else {
      let categoryName = category.toLowerCase();
      const response = await fetch(`${baseURL}products/search/${categoryName}`);
      const data = await convertToJson(response);
      return data.Result || [];
    }
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
