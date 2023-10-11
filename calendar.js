
let todaysDate = document.getElementById("date");
let weekday = document.getElementById("weekday");
let week = document.getElementById("week");
let season = document.getElementById("season");
let celebrationsLi = document.getElementById("celebrations");

const fetchDate = async (dateToday) => {
    try{
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
}

// TODO: Implement another api that searches the listed saint celebration upon click
const getCelebrations = (celebrations) =>{
    celebrations.forEach(celebration => {
        let saint = document.createElement("li");
        saint.innerHTML = `${celebration.rank}: ${celebration.title}`;
        celebrationsLi.append(saint);
    });
}

const renderDate = () => {

    // Obtains the local date of the host
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    let dateToday = `${cYear}/${cMonth}/${cDay}`;

    todaysDate.innerHTML = dateToday;
    fetchDate(dateToday);

}


const colors = ["#AFD5EB", "#D7CBB2"];
let colorIndex = 0;
const changeBackground = () => {
    const nextColor = colors[colorIndex]
    document.body.style.backgroundColor = nextColor;

    colorIndex = (colorIndex + 1) % colors.length;
}



renderDate();