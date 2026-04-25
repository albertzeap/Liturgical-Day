let todaysDate = document.getElementById("date");
let weekday = document.getElementById("weekday");
let week = document.getElementById("week");
let season = document.getElementById("season");
let celebrationsLi = document.getElementById("celebrations");
let searchBtn = document.getElementById("search-btn");

const fetchDate = async (dateToday) => {
  try {
    let response = await fetch(
      `http://calapi.inadiutorium.cz/api/v0/en/calendars/default/${dateToday}`,
    );
    const dateObject = await response.json();

    if (!response || dateObject.error) {
      let message = `Error: ${response.status}, ${response.statusText}`;
      let err = new Error(message);
      throw err;
    }

    todaysDate.innerHTML = dateObject.date;
    weekday.innerHTML = dateObject.weekday;
    week.innerHTML = dateObject.season_week;
    season.innerHTML = dateObject.season;

    getCelebrations(dateObject.celebrations);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

const getCelebrations = (celebrations) => {
  celebrations.forEach((celebration) => {
    let saint = document.createElement("li");
    saint.innerHTML = `${celebration.rank}: ${celebration.title}`;
    celebrationsLi.append(saint);
  });
};

const renderDate = () => {
  // Obtains the local date of the host
  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  let dateToday = `${cYear}/${cMonth}/${cDay}`;

  todaysDate.innerHTML = dateToday;
  fetchDate(dateToday);
};

// let primaryColorPicker = document.getElementById("primaryColorPicker");
let secondaryColorPicker = document.getElementById("secondaryColorPicker");
let backgroundColorPicker = document.getElementById("backgroundColorPicker");
let saveColorButton = document.getElementById("saveColor");
let resetColorButton = document.getElementById("resetColor");

/**
 * Determines a high-contrast text color (black or white) for a given background color.
 *
 * Extracts the RGB components from a hex color string, then calculates the
 * relative luminance using the WCAG formula (0.299R + 0.587G + 0.114B) / 255,
 * which weights each channel by human eye sensitivity. If the resulting
 * luminance exceeds 0.5 (light background), black is returned; otherwise
 * white is returned.
 *
 * @param {string} hexColor - A hex color string (e.g. "#513930")
 * @returns {string} Either "#000000" or "#ffffff"
 */
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
};

const setEventListeners = () => {
  // Save the selected color to chrome storage
  saveColorButton.addEventListener("click", () => {
    const selectedSecondaryColor = secondaryColorPicker.value || "#513930";
    const selectedBackgroundColor = backgroundColorPicker.value || "#AFD5EB";
    chrome.storage.sync.set({ secondaryColor: selectedSecondaryColor }, () => {
      todaysDate.style.color = selectedSecondaryColor;
      weekday.style.color = selectedSecondaryColor;
      week.style.color = selectedSecondaryColor;
      season.style.color = selectedSecondaryColor;
      searchBtn.style.background = selectedSecondaryColor;
      searchBtn.style.color= getContrastColor(selectedSecondaryColor);
      celebrationsLi.style.color = selectedSecondaryColor;
    });
    chrome.storage.sync.set(
      { backgroundColor: selectedBackgroundColor },
      () => {
        document.body.style.backgroundColor = selectedBackgroundColor;
        saveColorButton.style.backgroundColor = selectedBackgroundColor;
      },
    );
  });

  resetColorButton.addEventListener("click", () => {
    secondaryColorPicker.value = "#513930";
    backgroundColorPicker.value = "#AFD5EB";
    chrome.storage.sync.clear();
  });
};

// Load and apply the saved background color
const loadBackgroundColor = () => {
  try {
    chrome.storage.sync.get("secondaryColor", (data) => {
      const color = data.secondaryColor || "#513930";
      todaysDate.style.color = color;
      weekday.style.color = color;
      week.style.color = color;
      season.style.color = color;
      celebrationsLi.style.color = color;
      searchBtn.style.background = color;
      secondaryColorPicker.value = color;
    });
    chrome.storage.sync.get("backgroundColor", (data) => {
      const color = data.backgroundColor || "#AFD5EB";
      document.body.style.backgroundColor = color;
      saveColorButton.style.backgroundColor = color;
      backgroundColorPicker.value = color;
    });
  } catch (error) {
    console.error(error);
  }
};

const searchOpenInSelect = document.getElementById("search-open-in");

const loadSearchOpenInPreference = () => {
  if (!searchOpenInSelect || typeof chrome === "undefined" || !chrome.storage)
    return;
  chrome.storage.sync.get("searchOpenInNewTab", (data) => {
    const openInNewTab = data.searchOpenInNewTab === true;
    searchOpenInSelect.value = openInNewTab ? "newtab" : "current";
  });
};

const setSearchOpenInListener = () => {
  if (!searchOpenInSelect || typeof chrome === "undefined" || !chrome.storage)
    return;
  searchOpenInSelect.addEventListener("change", () => {
    const openInNewTab = searchOpenInSelect.value === "newtab";
    chrome.storage.sync.set({ searchOpenInNewTab: openInNewTab });
  });
};

if (searchOpenInSelect) {
  loadSearchOpenInPreference();
  setSearchOpenInListener();
}

if (secondaryColorPicker) {
  setEventListeners();
  loadBackgroundColor();
}
renderDate();
