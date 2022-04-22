var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var cityWeatherEl = document.getElementById("city-weather");
var fiveDayRow = document.getElementById("five-day-row");
var citySelect = "";
var checkPrevious = false;
var cityData = {};
var citySelectMinus = "";
/* var citySearchHistory = [];
var cityHistoryEl = document.getElementById("city-buttons"); */

var API_KEY = '8296bf8b41396591977312e4998cf95e';

// adds current date to top
var currentDay= moment().format('dddd, MMMM DD, YYYY');
$("#currentDay").text(currentDay);

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();
  
  // get value from input element
  var city = cityInputEl.value.trim();

  if (city) {
    citySelect = cityInputEl.value.trim();
    getCityResponse(city);
    // clear old content
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var getCityResponse = function(language) {
   
  citySelectMinus = citySelect.split(",")[0]; //removes state
  
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySelectMinus + '&units=imperial&appid=' + API_KEY;
  // checks for valid input
  fetch(apiUrl).then(function(response){
      if (response.ok) {
          response.json().then(function(data){
          // uses initial lat and long to send api request for full 7 day forcast
          var fiveday =  "https://api.openweathermap.org/data/2.5/onecall?lat="+ data.coord.lat + "&lon=" + data.coord.lon +
            "&exclude=minutely,hourly,alert&units=imperial&appid=ca0f1bc12f401f207d2783ba0f9c8ba8";
          fetch(fiveday).then(function(response){
          if (response.ok) {
              response.json().then(function(data){
              cityData = data;
              showCityData();
              });          
          } else {
            alert("Error:" + response.statusText);
          }
        });
        // checks to see if city has been previous entered or clicked.
        checkHistory();  
        // If new city, adds to previous search list
        if (checkPrevious === false){
          storeCities(citySelect);
        }
      });
   
      } else {
        alert("Error:" + response.statusText);
        return;
      }
  });
};
// displays 5 day outlook for selected city
function fiveDayOutlook () {
  var fiveDayEl = "";  
  fiveDayRow.textContent = ""; //resets display area
  $("#five-day-row").append('<div class="col-12"><h3 class="font-weight-bold p-2">5-Day Forecast:</h3></div>');
  for (i=1; i<6; i++){
    var weatherIcon = "src=https://openweathermap.org/img/wn/" + cityData.daily[i].weather[0].icon + "@2x.png";  
    fiveDayEl = $('<div class="row col-2 bg-transparent">');
    weatherPic = $('<div class="col-12 d-flex justify-content-center"><img ' + weatherIcon + '></></div>');
    dateBlock = $('<div class="col-12 m-1 p-2 font-weight-bold text-center"><h4>' + moment().add(i, 'day').format('MM/DD/YYYY') + '</h4></div>');
    tempBlock = $('<div class="col-12 m-1 p-2">Temp: '+ cityData.daily[i].temp.day + '&#8457</div>');
    windBlock = $('<div class="col-12 m-1 p-2">Wind: '+ cityData.daily[i].wind_speed + ' MPH</div>');
    humidityBlock = $('<div class="col-12 m-1 p-2">Humidity: ' + cityData.daily[i].humidity + '%</div>');
    fiveDayEl.append(dateBlock);
    fiveDayEl.append(weatherPic);    
    fiveDayEl.append(tempBlock);
    fiveDayEl.append(windBlock);
    fiveDayEl.append(humidityBlock);     
    $("#five-day-row").append(fiveDayEl);
  }
}
// displays current day weather information
function showCityData(){
  var cityDataEl = $('<div>');
  cityWeatherEl.textContent = "";
  document.getElementById("city-container").setAttribute("class", "border border-0");
  var weatherIcon = "src=https://openweathermap.org/img/wn/" + cityData.current.weather[0].icon + "@2x.png";
  document.getElementById("city-selected").innerHTML = citySelect + " <img " + weatherIcon + " />";
  tempBlock = $('<div class="col-12 m-1 p-2">Temp: '+ cityData.current.temp + '&#8457</div>');
  windBlock = $('<div class="col-12 m-1 p-2">Wind: '+ cityData.current.wind_speed + ' MPH</div>');
  humidityBlock = $('<div class="col-12 m-1 p-2">Humidity: ' + cityData.current.humidity + '%</div>');
  // checks u/v index and colors text based on threat level
  if (cityData.current.uvi <=2){ // green is favorable
    uvIndexBlock = $('<div class="col-12 m-1 p-2">U/V Index: <span class="bg-success rounded px-2">' + cityData.current.uvi + '</span></div>');
  } else if (cityData.current.uvi <=7){ // yellow is moderate
    uvIndexBlock = $('<div class="col-12 m-1 p-2">U/V Index: <span class="bg-warning rounded px-2">' + cityData.current.uvi + '</span></div>');
  } else { // red is severe
    uvIndexBlock = $('<div class="col-12 m-1 p-2">U/V Index: <span class="bg-danger rounded px-2">' + cityData.current.uvi + '</span></div>');
  } 
  cityDataEl.append(tempBlock);
  cityDataEl.append(windBlock);
  cityDataEl.append(humidityBlock); 
  cityDataEl.append(uvIndexBlock);    
  $("#city-weather").append(cityDataEl);
  
  fiveDayOutlook();
};

//listens for the user to submit a city
userFormEl.addEventListener("submit", formSubmitHandler);