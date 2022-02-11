//Imports
import { format, fromUnixTime } from 'date-fns'
const d2d = require('degrees-to-direction')
// const weatherbody = document.querySelector('.weatherbody');
// const hourly_weather = document.querySelector('.hourly-weather');
// const hourly_tab = document.getElementById('hourly-tab');
// const daily_tab = document.getElementById('daily-tab');
const datedisplay = document.querySelector('.datetime')
const minmaxtemp = document.querySelector('.minmaxtemp')
const temperature = document.getElementById('temperature')
const feelslike = document.querySelector('.feelslike-temp')
const weatheralert = document.querySelector('.weather-alert')
const conditions = document.querySelector('.current-cond')
const wicon = document.querySelector('.w-icon')
const moreinfo = document.querySelector('.more-info')
const hourlyweatherdatatag = document.querySelector('.hourly-weather-data')
const dailyweatherdatatag = document.querySelector('.daily-weather-data')
const accordionalert = document.querySelector('.accordion-alert')
const accordionalertbody = document.querySelector('.accordion-alert-body')

// //#####################
// // Display Today Weather
// //#####################

const displayCurrentWeatherData = (cwdata) => {
  datedisplay.innerHTML = format(new Date(), 'MMMM dd, yyyy | hh:mm a')
  temperature.innerHTML = (cwdata.current.temp - 273).toFixed(1)
  minmaxtemp.innerHTML = `Min: <strong class="weather-value">${(
    cwdata.daily[0].temp.min - 273
  ).toFixed(1)}°C </strong> | Max: <strong class="weather-value"> ${(
    cwdata.daily[0].temp.max - 273
  ).toFixed(1)}°C </strong>`
  feelslike.innerHTML = `Feels like <strong class="weather-value">${(
    cwdata.current.feels_like - 273
  ).toFixed(1)}°C </strong> `
  if (cwdata.alerts) {
    const alerttext = cwdata.alerts[0].description.split('.')
    accordionalert.classList.remove('d-none')
    weatheralert.innerHTML = alerttext[0].replace(/\n/g, '')
    accordionalertbody.innerHTML = cwdata.alerts[0].description
  } else {
    weatheralert.innerHTML = 'No alerts, all good.'
    accordionalert.classList.add('d-none')
  }

  conditions.innerHTML = cwdata.current.weather[0].description
  const imgsrc = `https://openweathermap.org/img/wn/${cwdata.current.weather[0].icon}@2x.png`
  wicon.setAttribute('src', imgsrc)
  const moreweatherdata = [
    { title: 'Clouds', value: cwdata.current.clouds + '%' },
    { title: 'Dew Point', value: (cwdata.current.dew_point - 273).toFixed(1) + '°C' },
    { title: 'Humidity', value: cwdata.current.humidity + '%' },
    { title: 'Sunrise', value: format(fromUnixTime(cwdata.current.sunrise), 'hh:mm a') },
    { title: 'Sunset', value: format(fromUnixTime(cwdata.current.sunset), 'hh:mm a') },
    { title: 'Visibility', value: cwdata.current.visibility / 1000 + ' km' },
    { title: 'Wind Direction', value: d2d(cwdata.current.wind_deg) },
    { title: 'Wind Direction', value: cwdata.current.wind_speed + ' m/s' },
  ]

  for (let i = 0; i < moreweatherdata.length; i++) {
    const moreinfo_html = `
        <div class="card text-center m-1">
        <div class="card-body">
          <h5 class="card-title">${moreweatherdata[i].title}</h5>
          <p class="card-text weather-value">${moreweatherdata[i].value}</p>
        </div>
        </div>`
    moreinfo.innerHTML += moreinfo_html
  }

  //Display HOurly Data
  const hourlyweatherheader_html = `
    <div class="m-1 p-2 d-flex flex-row justify-content-between">   
      <h6 class="header-text">Time</h6>
      <h6 class="header-text">Condition</h6>
      <h6 class="header-text">Temp</h6>
      <h6 class="header-text">Feels Like</h6>
      <h6 class="header-text">Rain%</h6>
    </div>`
  hourlyweatherdatatag.innerHTML = hourlyweatherheader_html

  for (let i = 0; i < cwdata.hourly.length; i++) {
    const hourlyweatherdata_html = `
    <div class="m-1 p-2 d-flex flex-row justify-content-between weather-data-rows">   
      <p class="weather-value my-auto">${format(fromUnixTime(cwdata.hourly[i].dt), 'hh:mm a')}</p>
      <img src="https://openweathermap.org/img/wn/${
        cwdata.hourly[i].weather[0].icon
      }.png" class="hourly-weather-icon"/>
      <p class="weather-value my-auto">${(cwdata.hourly[i].temp - 273).toFixed(1)}°C</p>
      <p class="weather-value my-auto">${(cwdata.hourly[i].feels_like - 273).toFixed(1)}°C</p>
      <p class="weather-value my-auto">${cwdata.hourly[i].pop * 100}%</p>
    </div>`
    hourlyweatherdatatag.innerHTML += hourlyweatherdata_html
  }

  // Display Daily Weather Data
  const dailyweatherheader_html = `
<div class="m-1 p-2 d-flex flex-row justify-content-between">   
  <h6 class="header-text">Time</h6>
  <h6 class="header-text">Condition</h6>
  <h6 class="header-text">Temp</h6>
  <h6 class="header-text">Rain%</h6>
</div>`
  dailyweatherdatatag.innerHTML = dailyweatherheader_html

  for (let i = 0; i < cwdata.daily.length; i++) {
    const dailyweatherdata_html = `
<div class="m-1 p-2 d-flex flex-row justify-content-between weather-data-rows">   
  <p class="weather-value my-auto">${
    i == 0 ? 'Today' : format(fromUnixTime(cwdata.daily[i].dt), 'MMM do')
  }</p>
  <img src="https://openweathermap.org/img/wn/${
    cwdata.daily[i].weather[0].icon
  }.png" class="daily-weather-icon"/>
  <p class="weather-value my-auto">${(cwdata.daily[i].temp.day - 273).toFixed(1)}°C</p>
  <p class="weather-value my-auto">${cwdata.daily[i].pop * 100}%</p>
</div>`
    dailyweatherdatatag.innerHTML += dailyweatherdata_html
  }
}

export { displayCurrentWeatherData }
