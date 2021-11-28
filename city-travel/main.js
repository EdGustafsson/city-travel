

const openWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const openWeatherkey = 'xxx';

const foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?near=';
const foursquareId = 'xxx';
const foursquareKey = 'xxx';

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const weatherContainer = document.getElementById("weatherContainer");
const venueContainer = document.getElementById("venueContainer");
const venueTitle = document.getElementById("venueTitle");

const input = document.getElementById("cityInput");
document.getElementById("submitBtn").addEventListener("click", submit);

input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("submitBtn").click();
  }
});

class Venue {
  constructor(name, address, iconUrl){
      this.name = name;
      this.address = address;
      this.iconUrl = iconUrl;
  }
}

class Weather {
  constructor(temp, description, icon){
      this.temp = temp;
      this.description = description;
      this.icon = icon;
  }
}


async function getVenues( sort ){
  const urlToFetch = foursquareUrl + document.getElementById("cityInput").value+ '&client_id=' + foursquareId+ '&client_secret=' + foursquareKey+ '&limit=10&v=' + getDateString();
  
      const response = await fetch(urlToFetch);
     
          const jsonResponse = await response.json();
          let venueList = [];
          jsonResponse.response.groups[0].items.forEach(item => {
          venueList.push(new Venue(item.venue.name, item.venue.location.address, `${item.venue.categories[0].icon.prefix}64${item.venue.categories[0].icon.suffix}` ))})
          if(sort === true){
              venueList = venueList.sort(function(a, b){
              var textA = a.name.toUpperCase();
              var textB = b.name.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          })};       
          displayVenues(venueList);
      
}


function displayVenues(venueList){

  venueTitle.innerHTML = "Top Attractions";

  venueList.forEach(venue => {

    let venueItem = document.createElement("div");
    let venueName = document.createElement("h3");
    let venueAddress = document.createElement("p");
    let venueIcon = document.createElement("img");
    venueName.innerHTML = venue.name;
    venueAddress.innerHTML = venue.address;
    venueIcon.src = venue.iconUrl;

    venueItem.appendChild(venueName);
    venueItem.appendChild(venueAddress);
    venueItem.appendChild(venueIcon);
    venueContainer.appendChild(venueItem);
    
})
}

async function getWeather(){

        const urlToFetch =  openWeatherUrl + document.getElementById("cityInput").value+ '&appid=' + openWeatherkey;
        const response = await fetch(urlToFetch);
        const jsonResponse = await response.json();
        const weather = new Weather(jsonResponse.main.temp, jsonResponse.weather[0].description, jsonResponse.weather[0].icon);
        displayWeather(weather);
    
}

 
  function displayWeather(weather) {

    let title = document.createElement("h2");
    title.innerHTML = "Current Weather";
    weatherContainer.appendChild(title);

    let celcius = Math.round(parseFloat(weather.temp)-273.15);
    let iconUrl = "http://openweathermap.org/img/wn/" + weather.icon + ".png";
    const day = new Date();

    let weatherItem = document.createElement("div");
    let weatherDay = document.createElement("h3");
    let weatherTemp = document.createElement("p");
    let weatherCond = document.createElement("p");
    let icon = document.createElement("img");

    weatherDay.innerHTML = weekdays[day.getDay()];
    weatherTemp.innerHTML = "Tempature: " + celcius + ' &deg;C'; 
    weatherCond.innerHTML = "Condition: " + weather.description;
    icon.src = iconUrl;

    weatherItem.appendChild(weatherDay)
    weatherItem.appendChild(weatherTemp)
    weatherItem.appendChild(weatherCond)
    weatherItem.appendChild(icon)
    weatherContainer.appendChild(weatherItem)

  }

  async function submit() {
    
    weatherContainer.innerHTML = "";
    venueContainer.innerHTML = "";
    venueTitle.innerHTML = "";
     
    const cbWeather = document.querySelector('#cbWeather').checked;
    const cbVenues = document.querySelector('#cbVenues').checked;
    const cbSort = document.querySelector('#cbSort').checked;

    if (cbWeather === true & cbVenues === true||cbWeather === false & cbVenues === false){

        try{
            document.getElementById('location').innerHTML = document.getElementById("cityInput").value;
            await getWeather();
            await getVenues(cbSort); 
        } catch (error) {
            console.log(error);
            displayError();
        }
       
    }
    else if(cbWeather===true & cbVenues===false){
      
        try{
        document.getElementById('location').innerHTML = document.getElementById("cityInput").value;
        await getWeather();
       } catch (error) {
        console.log(error);
        displayError();
       }
      
    }
    else if(cbWeather===false & cbVenues===true){

        try{
        document.getElementById('location').innerHTML = document.getElementById("cityInput").value;
        await getVenues(cbSort);
        } catch (error) {
        console.log(error);
        displayError();
        }

    }

  }

function displayError(){

    document.getElementById('location').innerHTML = "";
    const error = document.createElement("h3");
    error.innerHTML = "Sorry the service is currently down, please try again later.";
    weatherContainer.appendChild(error);
}

function getDateString() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var mm = m < 10 ? '0' + m : m;
    var dd = d < 10 ? '0' + d : d;
    return '' + y + mm + dd;
}