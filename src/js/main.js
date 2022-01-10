//Imports of other modules
import { getCity, getHourlyWeather, getCurrentWeather, getDailyWeather } from "./forecast";
import { displayCurrentWeatherData, displayHourlyData, displayDailyWeatherData, selectCity } from "./updatedom";

// DOM Handles
const search = document.querySelector('.search');
const cities = document.querySelector('.cities');
const cardBody = document.querySelector('.card');
const footer = document.querySelector('.footer');
const modalBody = document.querySelector('.modal-body');
const modalSave = document.querySelector('.modal-save');
const modalSearch = document.querySelector('.modal-search');
const modalCities = document.querySelector('.modal-cities');
const apifailed = document.querySelector('.apifailed');

//Tooltip initialization
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

//Check Locally Stored Data. Store only what you need.
let localCityData = JSON.parse(localStorage.getItem('cityData'));
let localCurrentWeatherData = JSON.parse(localStorage.getItem('currentWeatherData'));
let localHourlyWeatherData = JSON.parse(localStorage.getItem('hourlyWeatherData'));
let localDailyWeatherData = JSON.parse(localStorage.getItem('dailyWeatherData'));

//Perform operation based on the locally stored data. If recent data is available, use it. If it is too old, make API call again.

if(!localCityData) {
   
    // hide and unhide DOM items and clear out local storage
    search.style.display = '';
    footer.style.display = 'none';
    
    //Listen to Submit even of the form
    search.addEventListener('submit', (e) =>{
    e.preventDefault();  
    //Get the Searched City
    const cityName = search.search_city.value.trim();     
    // Get City Information and list available cities from an API call
         getCity(cityName).then(data =>{            
        //send data to the updatedom function to further process        
         selectCity(data,cities);         
        }).catch(err => {
            console.log("there is some error getting the City",err.message);
        });        
         //Reset Search bar   
        search.reset();
        localCityData = JSON.parse(localStorage.getItem('cityData'));               
    });    
}

//#####################################################
//Display Current Conditions
//#####################################################
if(localCityData){
    if(!localCurrentWeatherData || dateFns.differenceInMinutes(new Date(),localCurrentWeatherData[0].apiCallTime) > 30){
        getCurrentWeather(localCityData[0].cityID).then(wdata =>{
            const currentWeatherData = new Array();
            //store data locally
            currentWeatherData.push({
                localObservationDateTime: wdata[0].LocalObservationDateTime,
                temperatureValue:wdata[0].Temperature.Metric.Value,
                temperatureUnit:wdata[0].Temperature.Metric.Unit,
                weatherIcon:wdata[0].WeatherIcon,
                weatherText:wdata[0].WeatherText,
                isDayTime:wdata[0].IsDayTime,
                apiCallTime:new Date()
            });
            localStorage.setItem('currentWeatherData',JSON.stringify(currentWeatherData));  
            localCurrentWeatherData = JSON.parse(localStorage.getItem('currentWeatherData'));
            displayCurrentWeatherData(localCurrentWeatherData,localCityData);
            if(wdata.code === "ServiceUnavailable"){
                apifailed.innerHTML = "Message from Accuweather: "+wdata.message;                    
            }
        }).catch(err => {
                console.log("There is some error getting the weather information:",err.message);                
        });
    }else{
        displayCurrentWeatherData(localCurrentWeatherData,localCityData);
    }
}

//#####################################################
//Display Hourly Conditions
//#####################################################
if(localCityData){
    if(!localHourlyWeatherData || dateFns.differenceInHours(new Date(),localHourlyWeatherData[0].apiCallTime) > 1){
        getHourlyWeather(localCityData[0].cityID).then(hourlyData =>{
            const hourlyWeatherData =new Array();
            hourlyWeatherData.push({apiCallTime:new Date()});    
            for (let i=0;i<hourlyData.length;i++){
            //Convert Temp from F to C
            const tempC = (5/9)*(hourlyData[i].Temperature.Value - 32);    
            hourlyWeatherData.push({
                dateTime:hourlyData[i].DateTime,
                tempC:tempC.toPrecision(2),
                iconPhrase:hourlyData[i].IconPhrase,
                weatherIcon:hourlyData[i].WeatherIcon
            });
          }
          //store the time of data collected
          localStorage.setItem('hourlyWeatherData',JSON.stringify(hourlyWeatherData)); 
          localHourlyWeatherData = JSON.parse(localStorage.getItem('hourlyWeatherData'));     
          cardBody.style.display = ''; 
          displayHourlyData(localHourlyWeatherData); 
        }).catch(err =>{
            console.log("There is some error getting the weather information:",err.message);
        });
           
    }else {
        cardBody.style.display = ''; 
        displayHourlyData(localHourlyWeatherData);
    }
}

//#####################################################
//Display Daily Conditions
//#####################################################

if(localCityData){
    if(!localDailyWeatherData || dateFns.differenceInDays(new Date(),localDailyWeatherData[0].apiCallTime)){
    
        getDailyWeather(localCityData[0].cityID).then(dailyData =>{
            
            const dailyWeatherData = new Array();
            dailyWeatherData.push({apiCallTime:new Date()});
            dailyWeatherData.push({headline:dailyData.Headline.Text});
            
            const xAxis = [];
            const yAxisMax = [];
            const yAxisMin = [];
    
            for (let i=0;i<dailyData.DailyForecasts.length;i++){
            xAxis.push(dateFns.format(dailyData.DailyForecasts[i].Date,"ddd"));
            
            //Convert Temp from F to C
            const tempCMax = (5/9)* (dailyData.DailyForecasts[i].Temperature.Maximum.Value - 32);
            const tempCMin = (5/9)* (dailyData.DailyForecasts[i].Temperature.Minimum.Value - 32);
            yAxisMax.push(tempCMax.toFixed(1));
            yAxisMin.push(tempCMin.toFixed(1));
            }
            dailyWeatherData.push({
                xAxis:xAxis,
                yMax:yAxisMax,
                yMin:yAxisMin
            });
            localStorage.setItem('dailyWeatherData',JSON.stringify(dailyWeatherData)); 
            localDailyWeatherData = JSON.parse(localStorage.getItem('dailyWeatherData'));
            displayDailyWeatherData(localDailyWeatherData);
        }).catch(err =>{
            console.log("there is some error getting the weather information",err.message);
        })
    
    }else{
        displayDailyWeatherData(localDailyWeatherData);
    }
}

//#####################################################
//Modal Window Operations
//#####################################################

modalSearch.addEventListener('submit', (e)=>{
    e.preventDefault();    
    //get the new cityname from modal search form
    const newCityName = modalSearch.search_city.value.trim();
    //get the new city details from the api call
    getCity(newCityName).then(data =>{            
        //send data to the updatedom function to further process        
        selectCity(data,modalCities);
        }).catch(err => {
            console.log("there is some error getting the City",err.message);
        });
    modalSearch.reset(); 
    const closeBtn = document.querySelector('.btn-close');
    closeBtn.addEventListener('click', () =>{
        modalCities.style.display = 'none';
    })

});


