//Imports of other modules
import $ from 'jquery'
import { getCountries, saveHomeLocation, getWeatherData, getCityName } from './apicalls'
import { displayCurrentWeatherData } from './updatedom'

// DOM Handles
const getLocDH = document.querySelector('.getlocation')
const cardBodyDH = document.querySelector('.card')
const footerDH = document.querySelector('.footer')
const modalBodyDH = document.querySelector('.modal-body')
const modalSaveDH = document.querySelector('.modal-save')
const modalSearchDH = document.querySelector('.modal-search')
const modalCities = document.querySelector('.modal-cities')
const apifailedDH = document.querySelector('.apifailed')
const countryDropDownDH = document.querySelector('.country')
const findmeBtnDH = document.querySelector('.getlocation button')
const lds_hourglass = document.querySelector('.lds-hourglass')
const tabcontent = document.querySelector('.tab-content')

//Global URLS
const countryJsonURL = './server/country_codes.json'
const owApiURL4HomeLoc = 'https://api.openweathermap.org/geo/1.0/zip?zip='
const owApiURL4WeatherData = 'https://api.openweathermap.org/data/2.5/onecall?lat='
const owApiURL4CityName = 'http://api.openweathermap.org/geo/1.0/reverse?lat='

//Tooltip initialization
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

//Check Locally Stored Data. Store only what you need.
const homeLocation = JSON.parse(localStorage.getItem('HomeLocation'))

//First Register User Location Manually
if (!homeLocation) {
  $('.city-title').text('Choose Your City')
  $('.nav').addClass('d-none')
  lds_hourglass.classList.add('d-none')
  getCountries(countryJsonURL)
    .then((countrylist) => {
      let countries = '<option selected>Choose Your Country</option>'
      for (let i = 0; i < countrylist.length; i++) {
        countries += `            
            <option value="${i}">${countrylist[i].name}</option>`
      }
      countryDropDownDH.innerHTML = countries
      let rx_result = false
      const ziccodePattern = /^.[a-z0-9A-Z]{2,9}$/
      getLocDH.addEventListener('keyup', () => {
        rx_result = ziccodePattern.test(getLocDH.zipcode.value)
        if (rx_result) {
          findmeBtnDH.classList.remove('disabled')
        } else {
          findmeBtnDH.classList.add('disabled')
        }
      })
      getLocDH.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!rx_result) return
        let uLocation = {
          zipcode: getLocDH.zipcode.value,
          abbr: countrylist[getLocDH.country.value].abbr,
        }
        let url = owApiURL4HomeLoc + uLocation.zipcode + ',' + uLocation.abbr + '&appid='
        saveHomeLocation(url)
          .then((data) => {
            let homeLocation = {
              lat: data.lat.toFixed(2),
              lon: data.lon.toFixed(2),
            }
            localStorage.setItem('HomeLocation', JSON.stringify(homeLocation))
            homeLocation = JSON.parse(localStorage.getItem('HomeLocation'))
            getLocDH.remove()
            $('.nav').removeClass('d-none')
            getLocation()
          })
          .catch((err) => {
            apifailedDH.innerHTML = 'Is that code in the country you have selected? ' + err.message
            setTimeout(() => {
              apifailedDH.innerHTML = ''
            }, 3000)
          })
      })
    })
    .catch((err) => {
      console.log('Error:' + err.message)
    })
} else {
  getLocDH.remove()
  $('.nav').removeClass('d-none')
  getLocation()
}

//Get the permission for location tracking from the user
const options = {
  enableHighAccuracy: false,
  timeout: 500000,
  maximumAge: 0,
}

function getLocation() {
  $('.city-title').text('Allow this app to get your location..')
  if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition(onMove,atHomeLoc,options);
    navigator.geolocation.getCurrentPosition(onMove, atHomeLoc, options)
  } else {
    console.log('Geolocation is not supported by this browser.')
  }
}

//Based on user decision perform below tasks
const getWeatherPageData = (lat, lon) => {
  // get the local city name
  let url = owApiURL4CityName + lat + '&lon=' + lon + '&limit=1&appid='
  getCityName(url)
    .then((cDets) => {
      //Change the Weather Page title to the user city
      $('.city-title').text(cDets[0].name + ', ' + cDets[0].state)
    })
    .catch((err) => {
      console.log('Error fetching City details: ' + err.message)
    })

  // get full weather data
  url = owApiURL4WeatherData + lat + '&lon=' + lon + '&exclude=minutely&appid='
  getWeatherData(url)
    .then((cwdata) => {
      lds_hourglass.classList.add('d-none')
      tabcontent.classList.remove('d-none')
      displayCurrentWeatherData(cwdata)
    })
    .catch((err) => {
      console.log('Error Receiving Weather Data from OpenWeather: ' + err.message)
    })
}

function onMove(position) {
  $('.city-title').text('Finding your location...')
  let uLocation = {
    lat: position.coords.latitude.toFixed(2),
    lon: position.coords.longitude.toFixed(2),
  }
  getWeatherPageData(uLocation.lat, uLocation.lon)
}

function atHomeLoc(error) {
  $('.city-title').text('Finding your location...')
  // Handle gps error codes
  // switch(error.code) {
  //     case error.PERMISSION_DENIED:
  //       apifailedDH.innerHTML = "User denied the request for Geolocation."
  //       break;
  //     case error.POSITION_UNAVAILABLE:
  //       apifailedDH.innerHTML = "Location information is unavailable."
  //       break;
  //     case error.TIMEOUT:
  //       apifailedDH.innerHTML = "The request to get user location timed out."
  //       break;
  //     case error.UNKNOWN_ERROR:
  //       apifailedDH.innerHTML = "An unknown error occurred."
  //       break;
  //   }
  let homeLocation = JSON.parse(localStorage.getItem('HomeLocation'))
  getWeatherPageData(homeLocation.lat, homeLocation.lon)
}
