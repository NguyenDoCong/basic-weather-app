

// var cityName=document.getElementById("place")? "Hanoi":"Hanoi";

window.addEventListener("load", (event) => {
  current();
  loadDoc();
  dailyForecast();
  hourlyForecast();

  var input = document.getElementById("place");


  input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      loadDoc();
      dailyForecast();
      hourlyForecast();
      current();
      // Trigger the button element with a click
      //   document.getElementById("myBtn").click();
    }
  });
});



function loadDoc() {
  var cityName = document.getElementById("place").value? "Hanoi":"Hanoi";

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    var jsonResponse = JSON.parse(xhttp.responseText);
    // var tempC = jsonResponse.current.temp_c;
    // var city = jsonResponse.location.name;
    // var country = jsonResponse.location.country;

    var humidity = jsonResponse.current.humidity;
    var feelslike_c = jsonResponse.current.feelslike_c;

    var wind = jsonResponse.current.wind_kph;
    var uv = jsonResponse.current.uv;

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
  var cityName = document.getElementById("place").value;

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    var jsonResponse = JSON.parse(xhttp.responseText);
    // var myForecast = jsonResponse.forecast;

    // tableContainer.css("height", "25%");
    // var row = $("<div>").addClass("row");

    // for (let i = 0; i < 5; i++) {
    // Tạo phần tử card
    // var card = $("<div>").addClass("card");

    // Tạo phần tử card
    var card_outer = $("<div>").addClass("card img-fluid rounded-4 bg-dark border-0 ");
    // card.css("width", "75%");
    // card.css("background-color", "#212429");
    var card_inner = $("<div>").addClass("d-flex justify-content-end");

    var tempC = jsonResponse.current.temp_c;
    var city = jsonResponse.location.name;
    // var country = jsonResponse.location.country;
    var iconUrl = jsonResponse.current.condition.icon; // URL của biểu tượng

    // Tạo danh sách (list) bên trong card
    var image = $('<img>').addClass('card-img-top').attr('src', iconUrl);
    image.css("width","10rem");
    // image.css("width","10%");


    var overlay = $('<div>').addClass('card-img-overlay text-light ');
    var title = $('<h4>').addClass('card-header text-white fw-bold border-0').text(city);
    // title.css("color","#808285");
    var empty = $('<h4>').addClass('card-body');

    var text = $('<h1>').addClass('card-footer text-white fw-bold border-0').text(tempC+"°");
    // text.css("color","#808285");

    overlay.append(title,empty, text);
    card_inner.append(image, overlay);
    card_outer.append(card_inner);
    $("#current").empty().append(card_outer);


  };

  xhttp.open(
    "GET", "https://api.weatherapi.com/v1/forecast.json?key=4e1d8120f210431587d75101231710&q=" +
    cityName +
  "&days=1&aqi=no&alerts=no"

    //   "https://api.weatherapi.com/v1/forecast.json?key=4e1d8120f210431587d75101231710&q=" +
    //   cityName +
    // "&days=5&aqi=no&alerts=no"

  );

  xhttp.send();
}

function formatDayOfWeek(dateString) {
  var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var date = new Date(dateString);
  var dayOfWeekIndex = date.getDay();
  return daysOfWeek[dayOfWeekIndex];
}

function dailyForecast() {
  var cityName = document.getElementById("place").value;

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    var jsonResponse = JSON.parse(xhttp.responseText);
    var myForecast = jsonResponse.forecast;

    var tableContainer = $("<div>").addClass("container ");

    for (let i = 0; i < 7; i++) {

      if (i !== 6) {
        var row = $("<div>").addClass("row align-items-center pt-1 pb-1 border-bottom border-light border-opacity-10");
        // col.attr('class', 'border-opacity-25');


      }
      else var row = $("<div>").addClass("row align-items-center pt-1 pb-1");

      var rawDate = myForecast.forecastday[i].date;
      var dayOfWeek = formatDayOfWeek(rawDate);
      var iconUrl = myForecast.forecastday[i].day.condition.icon; // URL của biểu tượng

      var colDate = $("<div>").addClass("col-1").text(dayOfWeek);
      var colIcon = $("<div>").addClass("col-3").append($("<img>").attr("src", iconUrl));
      colIcon.css("width","5rem");

      var colCondition = $("<div>").addClass("col-6 fw-bold text-white").text(myForecast.forecastday[i].day.condition.text);
      var colTemperature = $("<div>").addClass("col-2 fw-bold");
      var $maxtemp_c=$("<span>").text(Math.round(myForecast.forecastday[i].day.maxtemp_c)).addClass("text-white");
      var $mintemp_c=$("<span>").text(Math.round(myForecast.forecastday[i].day.mintemp_c));
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

  var cityName = document.getElementById("place").value;

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    var jsonResponse = JSON.parse(xhttp.responseText);
    var myForecast = jsonResponse.forecast;

    var tableContainer = $("<div>").addClass("container");
    var row = $("<div>").addClass("row");

    for (let i = 0; i < 5; i++) {
      if (i !== 4) {
        var col = $("<div>").addClass("col border-end border-light border-opacity-10");
        // col.attr('class', 'border-opacity-25');

      }
      else var col = $("<div>").addClass("col");

      // col.css("border-width", "thin");

      // Tạo phần tử card
      // var card = $("<div>").addClass("card");

      // Tạo phần tử card
      // var card = $("<div>").addClass("card");
      // card.css("width", "50px");

      var thisTime = myForecast.forecastday[0].hour[i].time;
      var dateObj = new Date(thisTime);
      var options = {
        hour: "numeric",
        minute: "numeric"
      };
      var time = dateObj.toLocaleTimeString("en-US", options);

      var currentTime = new Date();
      var hours = currentTime.getHours();

      // var time = dateObj.toLocaleTimeString();
      var temp_c = myForecast.forecastday[0].hour[i + hours].temp_c;
      var iconUrl = myForecast.forecastday[0].hour[i + hours].condition.icon; // URL của biểu tượng

      // Tạo danh sách (list) bên trong card
      // var listGroup = $("<ul>").addClass("list-group list-group-flush");

      // Tạo các mục danh sách
      var row1 = $("<div>").addClass("row align-items-center justify-content-center").text(time);
      var row2 = $("<div>").addClass("row align-items-center justify-content-center");
      var newImage = $("<img>").attr("src", iconUrl);
      newImage.attr('class', 'w-75');

      // newImage.css({
      //   maxWidth: '70%',
      //   height: 'auto'      
      // });

      row2.append(newImage);
      // row2.css("width","5rem");

      var row3 = $("<div>").addClass("row align-items-center justify-content-center text-white ").text(temp_c);

      col.append(row1, row2, row3);

      // Gắn dòng vào container
      row.append(col);
      tableContainer.append(row);
    }

    // Xóa nội dung cũ và gắn container vào một phần tử trên trang web
    $("#hourlyForecast").empty().append(tableContainer);
  };

  xhttp.open(
    "GET", "https://api.weatherapi.com/v1/forecast.json?key=4e1d8120f210431587d75101231710&q=" +
    cityName +
  "&days=1&aqi=no&alerts=no"

    //   "https://api.weatherapi.com/v1/forecast.json?key=4e1d8120f210431587d75101231710&q=" +
    //   cityName +
    // "&days=5&aqi=no&alerts=no"

  );

  xhttp.send();
}


