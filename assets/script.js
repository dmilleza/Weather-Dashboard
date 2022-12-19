const weatherKey = "946cc641177df8ce033943b2ec9699cb";

let storedCities = [];
let cityName;

function searchButton() {
  const searchedCity = document.querySelector(".citySearch");
  cityName = searchedCity.value.trim();

  // if input is blank, exit function
  if (cityName === "") {
    return;
  } else {
    searchCity(cityName);
  }
}

function searchCity(city) {
  const mainBox = document.querySelector("main");
  mainBox.setAttribute("style", "visibility: visible");
  let m = moment();
  let m2 = moment().add(1, "d").format("[(]M[/]D[/]YYYY[)]");
  let m3 = moment().add(2, "d").format("[(]M[/]D[/]YYYY[)]");
  let m4 = moment().add(3, "d").format("[(]M[/]D[/]YYYY[)]");
  let m5 = moment().add(4, "d").format("[(]M[/]D[/]YYYY[)]");
  let m6 = moment().add(5, "d").format("[(]M[/]D[/]YYYY[)]");
  const dateArray = [m2, m3, m4, m5, m6];
  let geoCoordAPI =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=" +
    weatherKey;

  fetch(geoCoordAPI).then((response) => {
    response.json().then((response) => {
      console.log(response);
      let cityHeader = document.querySelector(".cityHeader");
      let currentDate = moment().format("[(]M[/]D[/]YYYY[)]");

      let cityName2 = response[0].name;
      if (!storedCities.includes(cityName2)) {
        storedCities.push(cityName2);
        storeCity();
        renderCities();
      }
      let cityCountry = response[0].country;
      cityHeader.textContent = `${cityName2}, ${cityCountry} ${currentDate}`;
      let cityLat = response[0].lat;
      let cityLon = response[0].lon;

      let currentWeath =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        cityLat +
        "&lon=" +
        cityLon +
        "&appid=" +
        weatherKey +
        "&units=imperial";

      fetch(currentWeath).then((response) => {
        response.json().then((response) => {
          console.log(response);
          let currentTemp = response.main.temp;
          let windSpeed = response.wind.speed;
          let humidity = response.main.humidity;
          let mainWeather = response.weather[0].main;

          let temp = document.getElementById("temp");
          let wind = document.getElementById("wind");
          let humid = document.getElementById("humid");
          temp.textContent = `Temp: ${currentTemp} F`;
          wind.textContent = `Wind: ${windSpeed} MPH`;
          humid.textContent = `Humidity: ${humidity}%`;
          let headerIcon = document.getElementById("headerIcon");
          headerIcon.classList.add("icon");

          switch (mainWeather) {
            case "Clear":
              headerIcon.setAttribute(
                "src",
                "./assets/sunny-weather-symbols-clip-art-free-vector-in-open-weather-symbols-for-sunny-11562989637qbgdysmpds.png"
              );
              break;
            case "Rain":
              headerIcon.setAttribute("src", "./assets/3294617.png");
              break;
            default:
              headerIcon.setAttribute(
                "src",
                "./assets/weather-icon-cloudy.png"
              );
          }
        });
      });

      let fiveDayAPI =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        cityLat +
        "&lon=" +
        cityLon +
        "&appid=" +
        weatherKey +
        "&units=imperial";

      let boxes = document.getElementsByClassName("box");
      for (var i = 0; i < boxes.length; i++) {
        boxes[i].innerHTML = "";
      }

      fetch(fiveDayAPI).then((response) => {
        response.json().then((response) => {
          console.log(response.list);
          let fiveDayArray = [
            response.list[0],
            response.list[8],
            response.list[16],
            response.list[24],
            response.list[32],
          ];

          for (var i = 0; i < boxes.length; i++) {
            let boxDate = document.createElement("h3");
            boxDate.textContent = dateArray[i];
            boxes[i].append(boxDate);

            let boxIcon = document.createElement("img");
            boxIcon.classList.add("icon");
            let boxWeather = fiveDayArray[i].weather[0].main;
            switch (boxWeather) {
              case "Clear":
                boxIcon.setAttribute(
                  "src",
                  "./assets/sunny-weather-symbols-clip-art-free-vector-in-open-weather-symbols-for-sunny-11562989637qbgdysmpds.png"
                );
                break;
              case "Rain":
                boxIcon.setAttribute("src", "./assets/3294617.png");
                break;
              default:
                boxIcon.setAttribute("src", "./assets/weather-icon-cloudy.png");
            }
            boxes[i].append(boxIcon);
            let boxTemp = document.createElement("p");
            boxTemp.classList.add("condition");
            boxTemp.textContent = `Temp: ${fiveDayArray[i].main.temp} F`;
            boxes[i].append(boxTemp);
            let boxWind = document.createElement("p");
            boxWind.classList.add("condition");
            boxWind.textContent = `Wind: ${fiveDayArray[i].wind.speed} MPH`;
            boxes[i].append(boxWind);
            let boxHumid = document.createElement("p");
            boxHumid.classList.add("condition");
            boxHumid.textContent = `Humidity: ${fiveDayArray[i].main.humidity}%`;
            boxes[i].append(boxHumid);
          }
        });
      });
    });
  });
}

function storeCity() {
  localStorage.setItem("savedCities", JSON.stringify(storedCities));
}

let savedCitiesBox = document.querySelector(".savedCities");

function renderCities() {
  let savedCities2 = JSON.parse(localStorage.getItem("savedCities"));
  if (savedCities2 !== null) {
    storedCities = savedCities2;
  }
  console.log(storedCities);
  savedCitiesBox.innerHTML = "";

  storedCities.forEach((element) => {
    var button = document.createElement("button");
    button.textContent = element;
    button.classList.add("btn", "historyBtn");
    button.addEventListener("click", savedBtnClicked);
    savedCitiesBox.append(button);
  });
}

renderCities();

function savedBtnClicked(event) {
  let btnText = event.target.textContent;
  searchCity(btnText);
}
