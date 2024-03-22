// jQuery function that runs when the page is loaded 
$(document).ready(function () {
    // Initialize dayjs
    init();
    // Event listener for search button
    $("#search-form").on("submit", function (event) {
        event.preventDefault();
        var city = $("#search-input").val();
        if (city !== "") {
            getWeather(city);
        }
    });
    // Event listener for history items
    $("#history").on("click", ".history-item", function () {
        var city = $(this).text();
        getWeather(city);
    });
    // Function to initialize the page
    function init() {
        var history = JSON.parse(localStorage.getItem("history")) || [];
        displayHistory(history);
    }

    // Function to get weather data from OpenWeather API
    function getWeather(city) {
        var apiKey = "ff20bc1d6df6623e54385efa9442dd2c";
        var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
        // Fetch data from OpenWeather API
        $.ajax({
            url: cityURL,
            method: "GET",
        }).then(function (response) {
            var history = JSON.parse(localStorage.getItem("history")) || [];
            if (history.indexOf(city) === -1) {
                history.push(city);
                localStorage.setItem("history", JSON.stringify(history));
                displayHistory(history);
            }
            displayCurrentWeather(response);
            getForecast(city);
        });
    }

    // Function to display current weather data
    function displayCurrentWeather(data) {
        var cityName = data.name;
        var date = dayjs().format("DD/MM/YYYY");
        var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        var temperature = data.main.temp;
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;

        var currentWeatherHtml =
            `<div id="current-weather">
                <h2 id="city-name">${cityName} (${date})</h2> 
                <img src="${iconUrl}" alt="weather icon">
                <p>Temperature: ${temperature} °C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>`;

        $("#today").html(currentWeatherHtml);
    }

    // Function to get forecast data from OpenWeather API
    function getForecast(city) {
        var apiKey = "ff20bc1d6df6623e54385efa9442dd2c";
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey;

        $.ajax({
            url: forecastURL,
            method: "GET",
        }).then(function (response) {
            displayForecast(response);
        });
    }

    // Function to display forecast data
    function displayForecast(data) {
        var forecastHtml = "<h2>5-Day Forecast:</h2>";

        for (var i = 0; i < data.list.length; i += 8) {
            var date = dayjs.unix(data.list[i].dt).format("DD/MM/YYYY");
            var iconUrl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
            var temperature = data.list[i].main.temp;
            var humidity = data.list[i].main.humidity;
            var windSpeed = data.list[i].wind.speed;

            forecastHtml += `
                <div class="col-lg-2">
                    <p>${date}</p>
                    <img src="${iconUrl}" alt="weather icon">
                    <p>Temperature: ${temperature} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                </div>`;
        }

        $("#forecast").html(forecastHtml);
    }

    // Function to display search history
    function displayHistory(history) {
        $("#history").empty();
        if (history.length > 0) {
            for (var i = 0; i < history.length; i++) {
                var historyItem = $("<div>").addClass("history-item").text(history[i]);
                $("#history").append(historyItem);
            }
        }
    }
});