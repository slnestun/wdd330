const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(response) {
  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(data.message || "The server could not complete the request.");
}

export default class ExternalServices {
  async getData(category) {
    if (!category) {
      const results = await Promise.all(
        ["tents", "backpacks", "sleeping-bags", "hammocks"].map((item) =>
          this.getData(item),
        ),
      );
      return results.flat();
    }

    const categoryName = category.toLowerCase();
    const response = await fetch(`${baseURL}products/search/${categoryName}`);
    const data = await convertToJson(response);
    return data.Result || [];
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(order) {
    const response = await fetch(`${baseURL}checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    return convertToJson(response);
  }
}
