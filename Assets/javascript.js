var apiKey = "28545911e32e1e789ebcf427787efdec";
var baseUrl = "https://api.openweathermap.org/data/2.5/";
var searchBtn = document.getElementById("button-addon2");

// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

$(searchBtn).on("click", function () {
    $("#currentInfo").empty();
    $("#fiveDayWth").empty();

    var userInput = $("#user-input").val();
    $("#user-input").empty();

    apiCall = baseUrl + "find?q=" + userInput + "&appid=" + apiKey;
    console.log(apiCall);
    var history = [];
    history.push(userInput);
    for (var i = 0; i < history.length; i++) {
        history[i];
        var pastCityBtn = $("<button>").attr("type", "button");
        pastCityBtn.text(userInput);
        pastCityBtn.attr("class", "btn btn-light");
        pastCityBtn.attr("data-city", userInput);
        $("#searchHistory").prepend(pastCityBtn);
        pastCityBtn.on("click", function () {
            $("#currentInfo").empty();
            $("#fiveDayWth").empty();
            var repeatCity = $(this).attr("data-city");
            var repeatUrl = baseUrl + "forecast?q=" + repeatCity + "&appid=" + apiKey;
            displayWeather(repeatUrl);
        });
        displayWeather(apiCall);
    };
});


function displayWeather(apiCall) {
    $.ajax({
        url: apiCall,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var latitude = response.list[0].coord.lat;
        var longitude = response.list[0].coord.lon;

        var formattedDate = convertUnixTimestamp(response.list[0].dt);
        locationApiCall = baseUrl + "onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&appid=" + apiKey + '&units=imperial';
        var initialResponse = response;
        $.ajax({
            url: locationApiCall,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var city = document.createElement("h1");
            city.innerText = initialResponse.list[0].name;
            $("#currentInfo").append(city);

            var temperature = document.createElement("p");
            temperature.innerText = "Temperature: " + response.current.temp;
            $("#currentInfo").append(temperature);

            var hum = document.createElement("p");
            hum.innerText = "Humidity: " + response.current.humidity;
            $("#currentInfo").append(hum);

            var windSpeed = document.createElement("p");
            windSpeed.innerText = "Wind Speed: " + response.current.wind_speed;
            $("#currentInfo").append(windSpeed);

            var uvIndex = document.createElement("p");
            uvIndex.innerText = "UV Index: " + response.current.uvi;
            var uviDisplay = response.current.uvi;
            $(uvIndex).attr("id", "uvi");
            $("#currentInfo").append(uvIndex);

            if (uviDisplay <= 2) {
                document.getElementById("uvi").style.color = "green";

            } else if (uviDisplay <= 5) {
                document.getElementById("uvi").style.color = "yellow";

            } else if (uviDisplay <= 7) {
                document.getElementById("uvi").style.color = "orange";

            } else {
                document.getElementById("uvi").style.color = "red";

            };
            var fiveDay = [0, 1, 2, 3, 4]
            for (var i = 0; i < fiveDay.length; i++) {
                var elementDate = convertUnixTimestamp(response.daily[i].dt);
                var weatherIcon = response.daily[i].weather[0].icon;
                var elementTemp = response.daily[i].temp.day;
                var elementHumidity = response.daily[i].humidity;
                var elementDay = response.daily[i];

                var fiveDayDiv = document.createElement("div");
                $(fiveDayDiv).addClass("card text-white bg-primary mb-3 col-sm-12 col-lg-2 col-md-4");
                $("#fiveDayWth").append(fiveDayDiv);

                var headerDiv = document.createElement("div");
                $(headerDiv).addClass("card-header");
                headerDiv.textContent = elementDate;
                $(fiveDayDiv).append(headerDiv);

                var bodyDiv = $("<div>");
                $(bodyDiv).addClass("card-body");
                $(fiveDayDiv).append(bodyDiv);

                var iconImg = $('<img>');
                iconImg.attr('src', "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                bodyDiv.append(iconImg);

                var tempParagraph = document.createElement("p");
                tempParagraph.innerText = "Temp: " + elementTemp;
                tempParagraph.style.fontSize = '14px';
                bodyDiv.append(tempParagraph);

                var humidityParagraph = document.createElement("p");
                humidityParagraph.innerText = "Humidity: " + elementHumidity;
                humidityParagraph.style.fontSize = '14px';
                bodyDiv.append(humidityParagraph);
            }


        });

    });
}

function convertUnixTimestamp(time) {
    var date = new Date(time * 1000);
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

}