/**
* search.js
* -------------------------
* Handles all functionality related to the search bar component.
* 
* Responsibilities:
* - Capture user input from the search bar.
* - Trigger a Google search when the user presses Enter or clicks the search button.
* - Optionally open search results in the same tab or a new one.
* - Provide a clean and responsive search experience within the new tab extension.
* 
* This script is loaded on the new tab page and should be referenced
* after the search bar elements are defined in the HTML (e.g., at the bottom of newtab.html).
*/

// Configuration
const OPEN_IN_NEW_TAB = true;
const SEARCH_ENGINE = `https://www.google.com`;

document.addEventListener("DOMContentLoaded", () =>{
    const searchBar = document.getElementById("search-bar");
    const searchBtn = document.getElementById("search-btn");

    if (!searchBar || !searchBtn){
        console.warn("Search bar or button not found.");
        return;
    }

    const search = () => {
        const query = searchBar.value.trim();
        if (!query) return;

        const searchUrl = SEARCH_ENGINE + `/search?q=${encodeURIComponent(query)}`;

        if (OPEN_IN_NEW_TAB) {
            window.open(searchUrl, "_blank");
        } else {
            window.location.href = searchUrl;
        }

    };

    // Add as Event Listeners
    searchBtn.addEventListener("click", search);
    searchBar.addEventListener("keypress", (e) => {
        if (e.key == "Enter"){
            e.preventDefault();
            search();
        }
    });
});
