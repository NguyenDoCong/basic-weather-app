window.addEventListener("load", (event) => {
  current();
  loadDoc();
  dailyForecast();
  hourlyForecast();

  let input = document.getElementById("place");


  input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      loadDoc();
      dailyForecast();
      hourlyForecast();
      current();
      // Trigger the button element with a click
    }
  });
});

function loadDoc() {
  let cityName = document.getElementById("place").value? "Hanoi":"Hanoi";

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    let jsonResponse = JSON.parse(xhttp.responseText);
    // let tempC = jsonResponse.current.temp_c;
    // let city = jsonResponse.location.name;
    // let country = jsonResponse.location.country;

    let humidity = jsonResponse.current.humidity;
    let feelslike_c = jsonResponse.current.feelslike_c;

    let wind = jsonResponse.current.wind_kph;
    let uv = jsonResponse.current.uv;

    // document.getElementById("temperature").innerHTML = tempC + "°";
    // document.getElementById("location").innerHTML = city + ", " + country;

    document.getElementById("humidity").innerHTML = humidity;
    document.getElementById("feelslike_c").innerHTML = feelslike_c + "°";

    document.getElementById("wind").innerHTML = wind + " km/h";
    document.getElementById("uv").innerHTML = uv;


  }

  xhttp.open("GET", "https://api.weatherapi.com/v1/current.json?key=4e1d8120f210431587d75101231710&q=" + cityName + "&aqi=no");

  // xhttp.open('GET', url);
  xhttp.setRequestHeader('Authorization', '4e1d8120f210431587d75101231710');
  xhttp.send();
}

function current() {
  let cityName = document.getElementById("place").value;

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    let jsonResponse = JSON.parse(xhttp.responseText);
    
    let card_outer = $("<div>").addClass("card img-fluid rounded-4 bg-dark border-0 ");

    let card_inner = $("<div>").addClass("d-flex justify-content-end mb-3");

    let tempC = jsonResponse.current.temp_c;
    let city = jsonResponse.location.name;
    let iconUrl = jsonResponse.current.condition.icon; // URL của biểu tượng

    // Tạo danh sách (list) bên trong card
    let image = $('<img>').addClass('card-img-top').attr('src', iconUrl);
    image.css("width","10rem");

    let overlay = $('<div>').addClass('card-img-overlay text-light ');
    let title = $('<h4>').addClass('card-header text-white fw-bold border-0').text(city);
    let empty = $('<h4>').addClass('card-body');

    let text = $('<h1>').addClass('card-footer text-white fw-bold border-0').text(tempC+"°");

    overlay.append(title,empty, text);
    card_inner.append(image, overlay);
    card_outer.append(card_inner);
    $("#current").empty().append(card_outer);


  };

  xhttp.open(
    "GET", "https://api.weatherapi.com/v1/forecast.json?key=4e1d8120f210431587d75101231710&q=" +
    cityName +
  "&days=1&aqi=no&alerts=no"

  );

  xhttp.send();
}

function formatDayOfWeek(dateString) {
  let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let date = new Date(dateString);
  let dayOfWeekIndex = date.getDay();
  return daysOfWeek[dayOfWeekIndex];
}

function dailyForecast() {
  let cityName = document.getElementById("place").value;

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    let jsonResponse = JSON.parse(xhttp.responseText);
    let myForecast = jsonResponse.forecast;

    let tableContainer = $("<div>").addClass("container ");

    for (let i = 0; i < 7; i++) {

      if (i !== 6) {
        var row = $("<div>").addClass("row align-items-center pt-1 pb-1 border-bottom border-light border-opacity-10");

      }
      else var row = $("<div>").addClass("row align-items-center pt-1 pb-2");

      let rawDate = myForecast.forecastday[i].date;
      let dayOfWeek = formatDayOfWeek(rawDate);
      let iconUrl = myForecast.forecastday[i].day.condition.icon; // URL của biểu tượng

      let colDate = $("<div>").addClass("col-1").text(dayOfWeek);
      let colIcon = $("<div>").addClass("col-3").append($("<img>").attr("src", iconUrl));
      colIcon.css("width","5rem");

      let colCondition = $("<div>").addClass("col-6 fw-bold text-white").text(myForecast.forecastday[i].day.condition.text);
      let colTemperature = $("<div>").addClass("col-2 fw-bold");
      let $maxtemp_c=$("<span>").text(Math.round(myForecast.forecastday[i].day.maxtemp_c)).addClass("text-white");
      let $mintemp_c=$("<span>").text(Math.round(myForecast.forecastday[i].day.mintemp_c));
      colTemperature.append($maxtemp_c)
      .append("/")
      .append($mintemp_c);

      row.append(colDate, colIcon, colCondition, colTemperature);

      // Gắn dòng vào container
      tableContainer.append(row);
    }

    // Xóa nội dung cũ và gắn container vào một phần tử trên trang web
    $("#myForecast").empty().append(tableContainer);
  };

  xhttp.open(
    "GET", "https://api.weatherapi.com/v1/forecast.json?key=4e1d8120f210431587d75101231710&q=" +
    cityName +
  "&days=7&aqi=no&alerts=no"

  );

  xhttp.send();
}


function hourlyForecast() {

  let cityName = document.getElementById("place").value;

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    let jsonResponse = JSON.parse(xhttp.responseText);
    let myForecast = jsonResponse.forecast;

    let row = $("<div>").addClass("row");

    for (let i = 0; i < 5; i++) {
      if (i !== 4) {
        var col = $("<div>").addClass("col border-end border-light border-opacity-10");

      }
      else var col = $("<div>").addClass("col");

      let thisTime = myForecast.forecastday[0].hour[i].time;
      let dateObj = new Date(thisTime);
      let options = {
        hour: "numeric",
        minute: "numeric"
      };
      let time = dateObj.toLocaleTimeString("en-US", options);

      let currentTime = new Date();
      let hours = currentTime.getHours();

      let temp_c = myForecast.forecastday[0].hour[i + hours].temp_c;
      let iconUrl = myForecast.forecastday[0].hour[i + hours].condition.icon; // URL của biểu tượng

      // Tạo các mục danh sách
      let row1 = $("<div>").addClass("row align-items-center justify-content-center").text(time);
      let row2 = $("<div>").addClass("row align-items-center justify-content-center");
      let newImage = $("<img>").attr("src", iconUrl);
      newImage.attr('class', 'w-75');

      row2.append(newImage);

      let row3 = $("<div>").addClass("row align-items-center justify-content-center text-white ").text(temp_c);

      col.append(row1, row2, row3);

      // Gắn dòng vào container
      row.append(col);
    }

    // Xóa nội dung cũ và gắn container vào một phần tử trên trang web
    $("#hourlyForecast").empty().append(row);
  };

  xhttp.open(
    "GET", "https://api.weatherapi.com/v1/forecast.json?key=4e1d8120f210431587d75101231710&q=" +
    cityName +
  "&days=1&aqi=no&alerts=no"

  );

  xhttp.send();
}


