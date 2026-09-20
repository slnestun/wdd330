//AI has been used to learn how to use a searchbar

function templateSearchBar() {
  const searchDiv = document.createElement("div");
  const searchContainer = document.createElement("div");
  const search = document.createElement("input");
  const itemsList = document.createElement("ul");
  const item = document.createElement("li");

  searchContainer.className = "search-container";
  search.type = "search";
  search.id = "searchMain";
  search.placeholder = "Search...";
  itemsList.id = "itemsList";
  item.className = "item";

  searchContainer.appendChild(search);
  itemsList.appendChild(item);
  searchDiv.appendChild(searchContainer);
  searchDiv.appendChild(itemsList);
  return searchDiv;
}

function processSearchBar() {
  const searchInput = document.getElementById("searchMain");
  const items = document.querySelectorAll(".item");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const isVisible = text.includes(query);
      item.style.display = isVisible ? "block" : "none";
    });
  });
}

function showSearchBar() {
  const header = document.querySelector("header");
  const searchElement = templateSearchBar();

  header.appendChild(searchElement);

  processSearchBar();
}

showSearchBar();
