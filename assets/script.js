$(document).ready(function() {
    const citySearchForm = document.querySelector(".city-search-form");
    const cityButtons = document.getElementById("city-buttons");
    const weatherCard = document.getElementById("weather-data").querySelector(".card-body");
    const forecast = document.querySelector(".card-group");

    // API url and key
    const apiKey = "ce3d08cfda63c419bc1f505bd8fd502f";

    //Hide weather data until search is made

    // Search history
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add search history buttons
    searchHistory.forEach(function (cityName) {
        let button = document.createElement("button");
        button.className = "btn btn-primary";
        button.textContent = cityName;
        button.addEventListener("click", function () {
            citySearchForm[0].value = this.textContent;
            citySearchForm.dispatchEvent(new Event("submit"));
        });
        cityButtons.appendChild(button);
    });


    // Event listenter for search form
    citySearchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const cityName = event.target[0].value;

        // Add city name to search history
        if (!searchHistory.includes(cityName)) {
            searchHistory.push(cityName);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

            let newCityButton = document.createElement("button");
            newCityButton.className = "btn btn-primary";
            newCityButton.textContent = cityName;
            newCityButton.addEventListener("click", function () {
                citySearchForm[0].value = this.textContent;
                citySearchForm.dispatchEvent(new Event("submit"));
            });
            cityButtons.appendChild(newCityButton);
        };

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(data => {
                const iconCode = data.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
                weatherCard.innerHTML = `
            <h5 class="card-title" id="city-name">${data.name}, ${data.sys.country}<img src="${iconUrl}" alt="Weather icon"></h5>
            <p class="card-text" id="current-temp">Temperature: ${data.main.temp} F</p>
            <p class="card-text" id="current-humidity">Humidity: ${data.main.humidity} %</p>
            <p class="card-text" id="current-wind-speed">Wind Speed: ${data.wind.speed} mph</p>
            `;
            });

        // 5 day forecast
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(data => {
                forecast.innerHTML = "";
                for (let i = 0; i < data.list.length; i += 8) {
                    const date = new Date(data.list[i].dt_txt);
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }); 
                    const iconCode = data.list[i].weather[0].icon;
                    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
                    forecast.innerHTML += ` 
            <div class="card text-bg-dark mb-3">
                <div class="card-header">${dayOfWeek} <img src="${iconUrl}" alt="Weather icon"></div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Temperature: ${data.list[i].main.temp} F</li>
                        <li class="list-group-item">Humidity: ${data.list[i].main.humidity} %</li>
                        <li class="list-group-item">Wind Speed: ${data.list[i].wind.speed} mph</li>
                    </ul>
                </div>
            </div>
            `;
                }
            });
    });

    cityButtons.addEventListener("input", function (event) {
        citySearchForm[0].value = event.target.value;
        citySearchForm.dispatchEvent(new Event("submit"));
    });

    // Clear the search history
    document.getElementById("clear-history").addEventListener("click", function () {
        searchHistory = [];
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        while (cityButtons.firstChild) {
            cityButtons.removeChild(cityButtons.firstChild);
        }
    });
  });