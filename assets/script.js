// variables
const searchCities = JSON.parse(localStorage.getItem("cityHistory")) || [];
console.log(searchCities);
// functions
function handleCoords(searchCity) {
    // fetches API
    const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                localStorage.setItem("cityHistory", JSON.stringify(searchCities));
                displayHistory(searchCities);
                return response.json();
                // confirms user input is valid
            } else {
                throw new Error("there was a problem with your response");
            }
        })
        // City name and coordinates data being pulled from API
        .then(function (data) {
            handleCurrentWeather(data.coord, data.name);
        })
        // if user input is invalid, display error message in console
        .catch((error) => {
            console.log(error);
        });
}

function handleCurrentWeather(coordinates, city) {
    // latitude from API
    const lat = coordinates.lat;
    // longitude from API
    const lon = coordinates.lon;
    // dynamically changes
    const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // displays current weather data
            displayCurrentWeather(data.current, city);
            displayFiveDayWeather(data.daily);
        });
}

// function for displaying current weather
function displayCurrentWeather(currentCityData, cityName) {
    // weather Icon that can dynamically change based on weather
    let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
    let uvColor = uvColorChange(currentCityData.uvi);
    // todo: add Wind, humidity, UV index DONT FORGET UNITS
    // create dynamic bg for uv index by adding class based on value of uv
    document.querySelector("#currentWeather").innerHTML = `<h2>${cityName} ${moment.unix(currentCityData.dt).format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${currentCityData.temp} \xB0F</div> <div>Wind: ${currentCityData.wind_speed} MPH</div> <div>Humidity: ${currentCityData.humidity} %</div> <div class="mb-5"> UV Index: <span class="${uvColor}">${currentCityData.uvi}</span></div>`;
}

// function to change color of UV index based on conditions
function uvColorChange(uvIndex) {
    if (uvIndex < 3) {
        return "bgc-green";
    } else if (uvIndex >= 3 && uvIndex < 6) {
        return "bgc-yellow";
    } else {
        return "bgc-red";
    }
}

function displayFiveDayWeather(fiveDayCityData) {
    // pinpoints the upcoming 5 days and cuts out anything more than that
    const cityData = fiveDayCityData.slice(1, 6);
    // init for 5day weather display
    document.querySelector("#fiveDayWeather").innerHTML = "";
    // displays cards for the 5day weather
    cityData.forEach((day) => {
        // creates icons for the 5days
        let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        // appends data to the 5cards for forecast
        document.querySelector("#fiveDayWeather").innerHTML += `<div class="col-sm m-1 p-2 card card-format"><div> ${moment.unix(day.dt).format("MMM Do YY")}</div> <div><img src="${weatherIcon}"><div>Temp: ${day.temp.day} \xB0F <br></br> Wind: ${day.wind_speed} MPH <br></br> Humidity: ${day.humidity} %</div></div></div>`;
    });
}
// allows user to input data and for that data to pulled from API
function handleFormSubmit(event) {
    // creates a history button for each searched city
    document.querySelector("#searchHistory").innerHTML = "";
    event.preventDefault();
    // creates element
    const city = document.querySelector("#searchInput").value.trim();
    // Populate array of searched cities
    if (searchCities.indexOf(city.toUpperCase()) == -1) {
        // makes array containing searched cities Uppercase
        searchCities.push(city.toUpperCase());
    }
    // saves searched history to local storage and JSON stringify's it

    // displayHistory(searchCities);
    handleCoords(city);
}

// button for the previously searched cities
function displayHistory(cities) {
    cities.forEach((city) => {
        document.querySelector("#searchHistory").innerHTML += `<button data-city="${city}" class="w-100 d-block my-2 search-history">${city}</button>`;
    });
}

// pulls data from previously searched city
function handleHistory(event) {
    const city = event.target.getAttribute("data-city");
    handleCoords(city);
}
displayHistory(searchCities);
localStorage.clear();
// listeners

// handles form submit
document.querySelector("#searchForm").addEventListener("submit", handleFormSubmit);
// handles search history
document.querySelector("#searchHistory").addEventListener("click", handleHistory);
