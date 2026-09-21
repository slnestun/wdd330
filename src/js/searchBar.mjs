//AI has been used to learn how to use a searchbar

function templateSearchBar() {
  const searchDiv = document.createElement("div");
  const searchContainer = document.createElement("div");
  const icon = document.createElement("button");
  const search = document.createElement("input");

  const item = document.createElement("li");
  searchContainer.className = "search-container";
  icon.id = "search-button";
  icon.textContent = "🔍";
  search.type = "search";
  search.id = "search-main";
  search.placeholder = "Search...";

  item.className = "item";
  searchContainer.appendChild(icon);
  searchContainer.appendChild(search);
  searchDiv.appendChild(searchContainer);

  return searchDiv;
}

function processSearchBar() {
  const searchInput = document.getElementById("search-main");
  const button = document.getElementById("search-button");

  let executeSearch = () => {
    let query = searchInput.value.toLowerCase().trim();
    if (query) {
      window.location.href = `/product_listing/index.html?search=${encodeURIComponent(query)}`;
    }
  };

  button.addEventListener("click", () => {
    executeSearch();
  });

  searchInput.addEventListener("keydown", (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (e.key == "Enter") {
      if (query) {
        e.preventDefault();
        executeSearch();
      }
    }
  });
}

export function showSearchBar() {
  const header = document.querySelector("header");
  const searchElement = templateSearchBar();

  header.appendChild(searchElement);

  processSearchBar();
}
