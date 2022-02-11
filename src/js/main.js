//Imports of other modules
import $ from 'jquery';
import { getCountries, saveHomeLocation, getWeatherData, getCityName } from "./functions";
import { displayCurrentWeatherData, displayHourlyData, displayDailyWeatherData, selectCity } from "./updatedom";

// DOM Handles
const getLocDH = document.querySelector('.getlocation');
const cardBodyDH = document.querySelector('.card');
const footerDH = document.querySelector('.footer');
const modalBodyDH = document.querySelector('.modal-body');
const modalSaveDH = document.querySelector('.modal-save');
const modalSearchDH = document.querySelector('.modal-search');
const modalCities = document.querySelector('.modal-cities');
const apifailedDH = document.querySelector('.apifailed');
const countryDropDownDH = document.querySelector('.country');
const findmeBtnDH = document.querySelector('.getlocation button');

//Global URLS
const countryJsonURL = './server/country_codes.json';
const owApiURL4HomeLoc = 'https://api.openweathermap.org/geo/1.0/zip?zip=';
const owApiURL4WeatherData = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
const owApiURL4CityName = 'http://api.openweathermap.org/geo/1.0/reverse?lat=';

//Tooltip initialization
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

//Check Locally Stored Data. Store only what you need.
// let localCityData = JSON.parse(localStorage.getItem('cityData'));
// let localCurrentWeatherData = JSON.parse(localStorage.getItem('currentWeatherData'));
// let localHourlyWeatherData = JSON.parse(localStorage.getItem('hourlyWeatherData'));
// let localDailyWeatherData = JSON.parse(localStorage.getItem('dailyWeatherData'));
const homeLocation = JSON.parse(localStorage.getItem('HomeLocation'));

//First Register User Location Manually
if(!homeLocation){
getCountries(countryJsonURL).then(countrylist =>{

    let countries = '<option selected>Choose Your Country</option>';
    for(let i=0;i<countrylist.length;i++){
        countries += `            
        <option value="${i}">${countrylist[i].name}</option>`;
    }
    countryDropDownDH.innerHTML = countries;
    let rx_result = false;
    const ziccodePattern = /^.[a-z0-9A-Z]{2,9}$/;
    getLocDH.addEventListener('keyup', ()=>{
        rx_result = ziccodePattern.test(getLocDH.zipcode.value);        
        if(rx_result){
            findmeBtnDH.classList.remove('disabled');
        }else{
            findmeBtnDH.classList.add('disabled');
        }
    });
    getLocDH.addEventListener('submit', (e)=>{
        e.preventDefault();
        if(!rx_result) return;
        let uLocation = {
            zipcode: getLocDH.zipcode.value,
            abbr:countrylist[getLocDH.country.value].abbr
        }    
        let url = owApiURL4HomeLoc + uLocation.zipcode + ',' + uLocation.abbr + '&appid=';
        saveHomeLocation(url).then(data=>{
            let homeLocation = {
                lat: data.lat.toFixed(2),
                lon: data.lon.toFixed(2)
            }
            localStorage.setItem('HomeLocation',JSON.stringify(homeLocation)); 
            homeLocation = JSON.parse(localStorage.getItem('HomeLocation'));
            getLocDH.remove();
            getLocation();
        }).catch(err => {
            apifailedDH.innerHTML = "Is that code in the country you have selected? " + err.message
            setTimeout(() => {apifailedDH.innerHTML = ''}, 3000);            
        });
    });

}).catch(err =>{
    console.log("Error:" + err.message);
});
}else{
    getLocDH.remove();
    getLocation();
}


//Get the permission from location tracking from the user
const options = {
    enableHighAccuracy: false,
    timeout: 500000,
    maximumAge: 0
  };

function getLocation() {
    if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition(onMove,atHomeLoc,options);
      navigator.geolocation.getCurrentPosition(onMove,atHomeLoc,options);
    } else { 
      console.log("Geolocation is not supported by this browser.");;
    }
}
//Based on user decision perform below tasks 

const getWeatherPageData = (lat, lon) => {
    // get the local city name
    let url = owApiURL4CityName + lat + '&lon=' + lon + '&limit=1&appid=';
    getCityName(url).then(cDets => {
        console.log(cDets);
        //Change the Weather Page title to the user city
        $('.city-title').text(cDets[0].name+', '+cDets[0].state);
    }).catch(err =>{
        console.log("Error fetching City details: " + err.message);
    });

    // get full weather data
    url = owApiURL4WeatherData + lat + '&lon=' + lon + '&exclude=minutely&appid=';
    getWeatherData(url).then(wdata => {
        console.log(wdata);
    }).catch(err => {
        console.log("Error Receiving Weather Data from OpenWeather: "+err.message);
    })

    
}

function onMove(position) {   
    let uLocation = {
        lat:position.coords.latitude.toFixed(2),
        lon:position.coords.longitude.toFixed(2)
    }
    getWeatherPageData(uLocation.lat,uLocation.lon);
}

//             const currentWeatherData = new Array();
//             //store data locally
//             currentWeatherData.push({
//                 localObservationDateTime: wdata[0].LocalObservationDateTime,
//                 temperatureValue:wdata[0].Temperature.Metric.Value,
//                 temperatureUnit:wdata[0].Temperature.Metric.Unit,
//                 weatherIcon:wdata[0].WeatherIcon,
//                 weatherText:wdata[0].WeatherText,
//                 isDayTime:wdata[0].IsDayTime,
//                 apiCallTime:new Date()
//             });
//             localStorage.setItem('currentWeatherData',JSON.stringify(currentWeatherData)); 


  function atHomeLoc(error) {
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
    let homeLocation = localStorage.getItem('HomeLocation');
    getWeatherPageData(homeLocation.lat,homeLocation.lon);
  }
 


//Get Weather Page Data based on the Lat and Lon position above






//Get User's geolocation
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(position => {
//         const x = "Latitude: " + position.coords.latitude.toFixed(2) + 
//         "Longitude: " + position.coords.longitude.toFixed(2);
//         const uPosition = {
//             lat: position.coords.latitude.toFixed(2),
//             lon: position.coords.longitude.toFixed(2)
//         }
//         localStorage.setItem('uPosition',JSON.stringify(uPosition));
//     });
// } 


//If user did not give permission to store their geolocation get it from below method



// if(!localCityData) {

   
   
//     // hide and unhide DOM items and clear out local storage
//     search.style.display = '';
//     footer.style.display = 'none';
    
//     //Listen to Submit even of the form
//     search.addEventListener('submit', (e) =>{
//     e.preventDefault();  
//     //Get the Searched City
//     const cityName = search.search_city.value.trim();     
//     // Get City Information and list available cities from an API call
//         //  getCity(cityName).then(data =>{            
//         // //send data to the updatedom function to further process 
//         // console.log(data);       
//         //  selectCity(data,cities);         
//         // }).catch(err => {
//         //     console.log("there is some error getting the City",err.message);
//         // });        
//          //Reset Search bar   
//         search.reset();
//         localCityData = JSON.parse(localStorage.getItem('cityData'));               
//     });    
// }

// //#####################################################
// //Display Current Conditions
// //#####################################################
// if(localCityData){
//     if(!localCurrentWeatherData || dateFns.differenceInMinutes(new Date(),localCurrentWeatherData[0].apiCallTime) > 30){
//         getCurrentWeather(localCityData[0].cityID).then(wdata =>{
//             const currentWeatherData = new Array();
//             //store data locally
//             currentWeatherData.push({
//                 localObservationDateTime: wdata[0].LocalObservationDateTime,
//                 temperatureValue:wdata[0].Temperature.Metric.Value,
//                 temperatureUnit:wdata[0].Temperature.Metric.Unit,
//                 weatherIcon:wdata[0].WeatherIcon,
//                 weatherText:wdata[0].WeatherText,
//                 isDayTime:wdata[0].IsDayTime,
//                 apiCallTime:new Date()
//             });
//             localStorage.setItem('currentWeatherData',JSON.stringify(currentWeatherData));  
//             localCurrentWeatherData = JSON.parse(localStorage.getItem('currentWeatherData'));
//             displayCurrentWeatherData(localCurrentWeatherData,localCityData);
//             if(wdata.code === "ServiceUnavailable"){
//                 apifailedDH.innerHTML = "Message from Accuweather: "+wdata.message;                    
//             }
//         }).catch(err => {
//                 console.log("There is some error getting the weather information:",err.message);                
//         });
//     }else{
//         displayCurrentWeatherData(localCurrentWeatherData,localCityData);
//     }
// }

// //#####################################################
// //Display Hourly Conditions
// //#####################################################
// if(localCityData){
//     if(!localHourlyWeatherData || dateFns.differenceInHours(new Date(),localHourlyWeatherData[0].apiCallTime) > 1){
//         getHourlyWeather(localCityData[0].cityID).then(hourlyData =>{
//             const hourlyWeatherData =new Array();
//             hourlyWeatherData.push({apiCallTime:new Date()});    
//             for (let i=0;i<hourlyData.length;i++){
//             //Convert Temp from F to C
//             const tempC = (5/9)*(hourlyData[i].Temperature.Value - 32);    
//             hourlyWeatherData.push({
//                 dateTime:hourlyData[i].DateTime,
//                 tempC:tempC.toPrecision(2),
//                 iconPhrase:hourlyData[i].IconPhrase,
//                 weatherIcon:hourlyData[i].WeatherIcon
//             });
//           }
//           //store the time of data collected
//           localStorage.setItem('hourlyWeatherData',JSON.stringify(hourlyWeatherData)); 
//           localHourlyWeatherData = JSON.parse(localStorage.getItem('hourlyWeatherData'));     
//           cardBody.style.display = ''; 
//           displayHourlyData(localHourlyWeatherData); 
//         }).catch(err =>{
//             console.log("There is some error getting the weather information:",err.message);
//         });
           
//     }else {
//         cardBody.style.display = ''; 
//         displayHourlyData(localHourlyWeatherData);
//     }
// }

// //#####################################################
// //Display Daily Conditions
// //#####################################################

// if(localCityData){
//     if(!localDailyWeatherData || dateFns.differenceInDays(new Date(),localDailyWeatherData[0].apiCallTime)){
    
//         getDailyWeather(localCityData[0].cityID).then(dailyData =>{
            
//             const dailyWeatherData = new Array();
//             dailyWeatherData.push({apiCallTime:new Date()});
//             dailyWeatherData.push({headline:dailyData.Headline.Text});
            
//             const xAxis = [];
//             const yAxisMax = [];
//             const yAxisMin = [];
    
//             for (let i=0;i<dailyData.DailyForecasts.length;i++){
//             xAxis.push(dateFns.format(dailyData.DailyForecasts[i].Date,"ddd"));
            
//             //Convert Temp from F to C
//             const tempCMax = (5/9)* (dailyData.DailyForecasts[i].Temperature.Maximum.Value - 32);
//             const tempCMin = (5/9)* (dailyData.DailyForecasts[i].Temperature.Minimum.Value - 32);
//             yAxisMax.push(tempCMax.toFixed(1));
//             yAxisMin.push(tempCMin.toFixed(1));
//             }
//             dailyWeatherData.push({
//                 xAxis:xAxis,
//                 yMax:yAxisMax,
//                 yMin:yAxisMin
//             });
//             localStorage.setItem('dailyWeatherData',JSON.stringify(dailyWeatherData)); 
//             localDailyWeatherData = JSON.parse(localStorage.getItem('dailyWeatherData'));
//             displayDailyWeatherData(localDailyWeatherData);
//         }).catch(err =>{
//             console.log("there is some error getting the weather information",err.message);
//         })
    
//     }else{
//         displayDailyWeatherData(localDailyWeatherData);
//     }
// }

// //#####################################################
// //Modal Window Operations
// //#####################################################

// modalSearchDH.addEventListener('submit', (e)=>{
//     e.preventDefault();    
//     //get the new cityname from modal search form
//     const newCityName = modalSearchDH.search_city.value.trim();
//     //get the new city details from the api call
//     getCity(newCityName).then(data =>{            
//         //send data to the updatedom function to further process        
//         selectCity(data,modalCities);
//         }).catch(err => {
//             console.log("there is some error getting the City",err.message);
//         });
//     modalSearchDH.reset(); 
//     const closeBtn = document.querySelector('.btn-close');
//     closeBtn.addEventListener('click', () =>{
//         modalCities.style.display = 'none';
//     })

// });


