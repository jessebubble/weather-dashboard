// API LINK
// "api.openweathermap.org/data/2.5/weather?q={sanantonio&appid=8296bf8b41396591977312e4998cf95e"/>

// API key turned to variable. thank you youtube
var API_KEY = '8296bf8b41396591977312e4998cf95e';
// 5 Day forecast
var forecastDays = 5;
var savedCities = JSON.parse(localStorage.getItem('cities')) || [];
// Button that allows us find the weather when a city is entered
$('.search-btn').on('click', function()
{
  clearPreviousData();
  var city = $('#city').val();
  if( city !== null && city !== "" && city !== " ")
  {
    $('#city').val(" ");
    getWeather(city);
    saveSearches(city);
  }
})
// FETCH the weather 
var getWeather = (city) =>
{
  fetch('https://api.openweathermap.org/data/2.5/forecast?q='+ city + '&units=imperial&appid=' + API_KEY)
  .then((response) => response.json())
  .then((data) =>
  {
// FETCH the lat/lon
var { lat, lon } = data.city.coord;
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=hourly&minutely&appid='+ API_KEY)
    .then((response) => response.json())
    .then((data) => 
    {
// API DATA CAPTURE
      var {temp, humidity, wind_speed, uvi, dt} = data.current;
      var {icon} = data.current.weather[0];
      var date = new Date(dt * 1000).toLocaleDateString();
      var weatherIconEl = document.createElement('img');
      var uvIndexEl = document.createElement('button');
      uvIndexEl.textContent = uvi;
// test the uvi to determine which class to add to the button
      if( uvi <= 2)
      {
        $(uvIndexEl).addClass('uv-safe')
      }
      else if( uvi > 2 && uvi <= 7)
      {
        $(uvIndexEl).addClass('uv-moderate')
      }
      else
      {
        $(uvIndexEl).addClass('uv-danger')
      }
// update all the data on the web page
      $(weatherIconEl).attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');
      $('.city').text(city + " " + date);
      $('.icon-column').append(weatherIconEl);
      $('.temp').text('Temp: ' + temp + ' °F');
      $('.wind').text('Wind: ' + wind_speed + ' MPH');
      $('.humidity').text('Humidity: ' + humidity + ' %');
      $('.uvi').text("UV index: ").append(uvIndexEl); 
      //create the 5 day forecast cards and insert the data
      for(i = 0; i < forecastDays; i++)
      {
        var dateEl = document.createElement('p');
        var iconEl = document.createElement('img');
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidEl = document.createElement('p');
        var {max} = data.daily[i+1].temp; 
        var {wind_speed, humidity, dt} = data.daily[i+1];
        var {icon} = data.daily[i+1].weather[0];
        var date = new Date(dt * 1000).toLocaleDateString();

        $(dateEl).text(date);
        $(tempEl).text('Temp: ' + max + ' °F');
        $(windEl).text('Wind: ' + wind_speed + ' MPH');
        $(humidEl).text('Humidity: ' + humidity + ' %');
        $(iconEl).attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');
        $('.card' + i).append(dateEl, iconEl, tempEl, windEl, humidEl);
        $('.card' + i).attr('style', 'visibility:visible;')
      }
    })
  })
}
// LOCALSTORAGE save city searches
var saveSearches = (cityName) =>
{
  savedCities.push(cityName);
  localStorage.setItem('cities', JSON.stringify(savedCities));
  if(savedCities.length <= 1)
  {
    var dividerEl = document.createElement('hr');
    $(dividerEl).addClass('rounded');
    $('.search-bar').append(dividerEl);
  }
  var buttonEl = document.createElement('button');
  $(buttonEl).addClass('saved-city');
  buttonEl.innerHTML = cityName;
  $('.search-bar').append(buttonEl);

  $(buttonEl).on('click', function()
  {
    clearPreviousData();
    getWeather(cityName);
  })
}

// Exit Data for next visit
var clearPreviousData = () =>
{
  $('.row').empty();
  for(i = 0; i < forecastDays; i++)
  {
    var colEl = document.createElement('div');
    $(colEl).addClass('column');
    var cardEl = document.createElement('div');
    $(cardEl).addClass('card'+ i);
    $(colEl).append(cardEl);
    $('.row').append(colEl);
  }
  $('.icon-column').empty();
}

localStorage.clear();