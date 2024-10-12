
let todaysDate = document.getElementById("date");
let weekday = document.getElementById("weekday");
let week = document.getElementById("week");
let season = document.getElementById("season");
let celebrationsLi = document.getElementById("celebrations");

const fetchDate = async (dateToday) => {
    try {
        
        let response = await fetch(`http://calapi.inadiutorium.cz/api/v0/en/calendars/default/${dateToday}`);
        const dateObject = await response.json();
    
        if(!response || dateObject.error){
            let message = `Error: ${response.status}, ${response.statusText}`;
            let err = new Error(message);
            throw err;
        }

        todaysDate.innerHTML = dateObject.date;
        weekday.innerHTML = dateObject.weekday;
        week.innerHTML = dateObject.season_week;
        season.innerHTML = dateObject.season;

        getCelebrations(dateObject.celebrations)

    } catch (err){
        console.error(`Error: ${err}`);
    }
};

const getCelebrations = (celebrations) =>{
    celebrations.forEach(celebration => {
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

const setEventListeners = () => {
    // Save the selected color to chrome storage
    saveColorButton.addEventListener("click", () => {
        const selectedSecondaryColor = secondaryColorPicker.value ||'#513930';
        const selectedBackgroundColor = backgroundColorPicker.value || '#AFD5EB';
        chrome.storage.sync.set({ secondaryColor: selectedSecondaryColor }, () => {
            todaysDate.style.color = selectedSecondaryColor;
            weekday.style.color = selectedSecondaryColor;
            week.style.color = selectedSecondaryColor;
            season.style.color = selectedSecondaryColor;
            celebrationsLi.style.color = selectedSecondaryColor;
        });
        chrome.storage.sync.set({ backgroundColor: selectedBackgroundColor }, () => {
            document.body.style.backgroundColor = selectedBackgroundColor;
            saveColorButton.style.backgroundColor = selectedBackgroundColor;
        });
    });   
    
    resetColorButton.addEventListener("click", () => {
        secondaryColorPicker.value = '#513930';
        backgroundColorPicker.value = '#AFD5EB';
        chrome.storage.sync.clear();
    })
}

// Load and apply the saved background color
const loadBackgroundColor = () => {
    try {
        chrome.storage.sync.get("secondaryColor", (data) => {
            const color = data.secondaryColor || '#513930'; 
            todaysDate.style.color = color;
            weekday.style.color = color;
            week.style.color = color;
            season.style.color = color;
            celebrationsLi.style.color = color;
            secondaryColorPicker.value = color;
        });
        chrome.storage.sync.get("backgroundColor", (data) => {
            const color = data.backgroundColor || '#AFD5EB'; 
            document.body.style.backgroundColor = color;
            saveColorButton.style.backgroundColor = color;
            backgroundColorPicker.value = color;
        });
    } catch (error) {
        console.error(error);
    }
};


setEventListeners();
loadBackgroundColor();
renderDate();