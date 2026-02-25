/**
 * search.js
 * -------------------------
 * Handles all functionality related to the search bar component.
 *
 * Responsibilities:
 * - Capture user input from the search bar.
 * - Trigger a Google search when the user presses Enter or clicks the search button.
 * - Open results in current tab or new tab based on user preference (extension only).
 * - Default: current tab. User can choose "New tab" via dropdown when available.
 */

const SEARCH_ENGINE = "https://www.google.com";

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const searchBtn = document.getElementById("search-btn");

  if (!searchBar || !searchBtn) {
    console.warn("Search bar or button not found.");
    return;
  }

  const search = () => {
    const query = searchBar.value.trim();
    if (!query) return;

    const searchUrl = SEARCH_ENGINE + `/search?q=${encodeURIComponent(query)}`;
    const openInSelect = document.getElementById("search-open-in");
    const openInNewTab = openInSelect ? openInSelect.value === "newtab" : false;

    if (openInNewTab) {
      window.open(searchUrl, "_blank");
    } else {
      window.location.href = searchUrl;
    }
  };

  searchBtn.addEventListener("click", search);
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search();
    }
  });
});
