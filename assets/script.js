$(document).ready(function() {
    const citySearchForm = document.querySelector(".city-search-form");
    const cityButtons = document.getElementById("city-buttons");
    const weatherCard = document.getElementById("weather-data").querySelector(".card-body");
    const forecast = document.querySelector(".card-group");
});

const apiKey = "ce3d08cfda63c419bc1f505bd8fd502f";

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];


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


citySearchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const cityName = this[0].value;
    
    if (searchHistory.indexOf(cityName) === -1) {
        searchHistory.push(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        let button = document.createElement("button");
        button.className = "btn btn-primary";
        button.textContent = cityName;
        button.addEventListener("click", function () {
            citySearchForm[0].value = this.textContent;
            citySearchForm.dispatchEvent(new Event("submit"));
        });
        cityButtons.appendChild(button);
    }
});
