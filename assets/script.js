// variables
const searchCity = [];
const searchCities = JSON.parse(localStorage.getItem("cityHistory")) || [];
// functions
function handleCoords(searchCity) {
    const fetchUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("there was a problem with your response");
            }
        })
        .then(function (data) {
            handleCurrentWeather(data.coord, data.name);
        })
        .catch((error) => {
            console.log(error);
        });
}

function handleCurrentWeather(coordinates, city) {
    const lat = coordinates.lat;
    const lon = coordinates.lon;

    const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayCurrentWeather(data.current, city);
            displayFiveDayWeather(data.daily);
        });
}

function displayCurrentWeather(currentCityData, cityName) {
    let weatherIcon = `http://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
    let uvColor = uvColorChange(currentCityData.uvi);
    // todo: add Wind, humidity, UV index DONT FORGET UNITS
    // create dynamic bg for uv index by adding class based on value of uv
    document.querySelector("#currentWeather").innerHTML = `<h2>${cityName} ${moment.unix(currentCityData.dt).format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${currentCityData.temp} \xB0F</div> <div>Wind: ${currentCityData.wind_speed} MPH</div> <div>Humidity: ${currentCityData.humidity}</div> <div class="mb-5"> UV Index: <span class="${uvColor}">${currentCityData.uvi}</span></div>`;
}

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
    const cityData = fiveDayCityData.slice(1, 6);
    document.querySelector("#fiveDayWeather").innerHTML = "";

    cityData.forEach((day) => {
        let weatherIcon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        // todo: temp, wind, humidity DONT FORGET UNITS ()
        document.querySelector("#fiveDayWeather").innerHTML += `<Temp: class="col-sm m-1 p-2 card"><div> ${moment.unix(day.dt).format("MMM Do YY")}</div> <div><img src="${weatherIcon}"></div>Temp: ${day.temp.day} \xB0F </div> <div>Wind: ${day.wind_speed} MPH </div> <div>Humidity: ${day.humidity}% </div></div>`;
    });
}

function handleFormSubmit(event) {
    document.querySelector("#searchHistory").innerHTML = "";
    event.preventDefault();
    const city = document.querySelector("#searchInput").value.trim();
    searchCities.push(city);
    const filteredCities = searchCities.filter((city, index) => {
        return searchCities.indexOf(city.toUpperCase()) === index;
    });
    // filteredCities.forEach((city) => {
    //     document.querySelector("#searchHistory").innerHTML += `<button data-city="${city}" class="w-100 d-block my-2 search-history">${city}</button>`;
    // });
    localStorage.setItem("cityHistory", JSON.stringify(filteredCities));
    displayHistory(filteredCities);
    handleCoords(city);
}

function displayHistory(cities) {
    cities.forEach((city) => {
        document.querySelector("#searchHistory").innerHTML += `<button data-city="${city}" class="w-100 d-block my-2 search-history">${city}</button>`;
    });
}

function handleHistory(event) {
    const city = event.target.getAttribute("data-city");
    handleCoords(city);
}
displayHistory(searchCities);
// listeners
// on page load, show any past cities searched
// search for city
// click on city to show weather
document.querySelector("#searchForm").addEventListener("submit", handleFormSubmit);
document.querySelector("#searchHistory").addEventListener("click", handleHistory);
