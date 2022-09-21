let fetchDate = async () => {
    try{
        let response = await fetch("http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today");

        if(!response){
            let message = `Error: ${response.status}, ${response.statusText}`;
            let err = new Error(message);
            throw err;
        }

        const currentDate = await response.json();
        return currentDate;


    } catch (err){
        console.error(`Error: ${err}`);
    }
}


let todaysDate = document.getElementById("date");
let weekday = document.getElementById("weekday");
let week = document.getElementById("week");
let season = document.getElementById("season");
let celebrationsLi = document.getElementById("celebrations");


// TODO: Implement another api that searches the listed saint celebration upon click
let getCelebrations = (celebrations) =>{
    celebrations.forEach(celebration => {
        let saint = document.createElement("li");
        saint.innerHTML = celebration.title;
        celebrationsLi.append(saint);
    });
}

let renderDate = () => {
    fetchDate().then((dateObject) =>{
        console.log(dateObject);
        console.log(dateObject.date);
        console.log(dateObject.weekday);
        todaysDate.innerHTML = `Date: ${dateObject.date}`;
        weekday.innerHTML = ` Today is <i>${dateObject.weekday}</i>`;
        week.innerHTML = `Week <i>${dateObject.season_week}</i> of the`;
        season.innerHTML = `<i>${dateObject.season}</i> season`;

        getCelebrations(dateObject.celebrations);
    });
}

renderDate();