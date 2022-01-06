/* Application JS */
import { getCity, getHourlyWeather, getCurrentWeather, getDailyWeather } from "./forecast";
const search = document.querySelector('.search');
const weatherbody = document.querySelector('.weatherbody');
const cities = document.querySelector('.cities');
const hourly_weather = document.querySelector('.hourly-weather');
const cardBody = document.querySelector('.card');
const footer = document.querySelector('.footer');

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

//Check Locally Stored Data
const cityID = localStorage.getItem('cityID');
const cityName = localStorage.getItem('cityName');
const cityProv = localStorage.getItem('cityProv');
const cityCtr = localStorage.getItem('cityCtr');

//Perform operation based on the locally stored data

if(!cityID && !cityName) {

    // unHide Search Form and City List
    search.style.display = '';
    footer.style.display = 'none';
    cardBody.classList.add('class','d-none');

    search.addEventListener('submit', (e) =>{
    e.preventDefault();
    
    const cityName = search.search_city.value.trim();

    // Get City Information and list available cities
        getCity(cityName).then(data =>{
            cities.style.display = '';
            for (let i=0;i<data.length;i++){
                const listTag = document.createElement('li');
                listTag.classList.add('list-group-item');
                listTag.textContent = `${data[i].EnglishName}, ${data[i].AdministrativeArea.EnglishName}, ${data[i].AdministrativeArea.ID}, ${data[i].Country.EnglishName}, ${data[i].PrimaryPostalCode}, ${data[i].Key}`;
                cities.append(listTag);
            //    console.log(data[i].EnglishName, data[i].AdministrativeArea.EnglishName,data[i].AdministrativeArea.ID,data[i].Country.EnglishName,data[i].PrimaryPostalCode,data[i].Key);
            }
    
            // Ask user to choose the city and get weather information
            cities.addEventListener('click', (e)=> {
                const cityID = data[Array.from(cities.children).indexOf(e.target)].Key;
                const cityName = data[Array.from(cities.children).indexOf(e.target)].EnglishName;
                const cityProv = data[Array.from(cities.children).indexOf(e.target)].AdministrativeArea.ID;
                const cityCtr = data[Array.from(cities.children).indexOf(e.target)].Country.EnglishName;
                cities.style.display = 'none';
                search.style.display = 'none';
                localStorage.setItem('cityID',cityID);
                localStorage.setItem('cityName',cityName);
                localStorage.setItem('cityProv',cityProv);
                localStorage.setItem('cityCtr',cityCtr);
                 // Hide Search Form and City List
                search.style.display = 'none';
                cities.style.display = 'none';
                footer.style.display = '';
                location.reload();
 
            });

            

        }).catch(err => {
            console.log("there is some error getting the City",err.message);
            });
    
        search.reset();

    });


}


//Display Current Conditions
    
getCurrentWeather(cityID).then(wdata =>{
    const imgquerystr = wdata[0].WeatherText.replace(/\s+/g,'%20');
    let img = `<img src="assets/night.jpg" class="bkg_img" alt="">`;
    if(wdata[0].IsDayTime){ 
    img = `<img src="assets/day.jpg" class="bkg_img" alt="">`;
    }

const htmlContent = img + 
`<p class="city my-2">${cityName}, ${cityProv}, ${cityCtr} <br> ${dateFns.format(wdata[0].LocalObservationDateTime,"ha, dddd")}</p>
<i class="fa fa-edit" data-bs-toggle="modal" data-bs-target="#Modal" data-bs-toggle="tooltip" data-bs-placement="top" title="Change Location"></i>
<div class="d-flex flex-row justify-content-evenly">
    <p class="temp">${wdata[0].Temperature.Metric.Value} <sup>0</sup>${wdata[0].Temperature.Metric.Unit}</p>
    <p class="conditions m-auto">${wdata[0].WeatherText}</p>
    <img src="assets/${wdata[0].WeatherIcon}.png" alt="" class="m-auto weathericon">
</div>`;
        
weatherbody.innerHTML = htmlContent;

}).catch(err => {
        console.log("there is some error getting the weather information",err.message);
        });



// Display Hourly Weather
getHourlyWeather(cityID).then(hourlyData =>{
    
    for (let i=0;i<hourlyData.length;i++){
    
    //Convert Temp from F to C
    const tempC = (5/9)*(hourlyData[i].Temperature.Value - 32);
    hourly_weather.innerHTML += `
    <div class="hourly-weather-item d-flex flex-row"> 
    <div class="hourly-time w-25 align-self-center m-auto">${dateFns.format(hourlyData[i].DateTime,"ha | ddd")}</div>
    <div class="hourly-temp w-25 align-self-center">${tempC.toPrecision(2)} <sup>0</sup>C</div>
    <div class="hourly-cond w-25 align-self-center">${hourlyData[i].IconPhrase}</div>
    <img src="assets/${hourlyData[i].WeatherIcon}.png" alt="" class="hourly-icon w-10 align-self-center">
    </div>`;
}
}).catch(err =>{
    console.log("there is some error getting the weather information",err.message);
});

//Display Daily Temperatures

getDailyWeather(cityID).then(dailyData =>{
    
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
//Display Headline Text
weatherbody.innerHTML += `<p class="muted text-warning headline"> ${dailyData.Headline.Text}</p>`;

//Chart 
    const data = {
        labels: xAxis,
        datasets: [
            {
            label: 'Max Temperatures',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: yAxisMax
            },
            {
            label: 'Min Temeratures',
            backgroundColor: 'rgb(50, 200, 52)',
            borderColor: 'rgb(50, 200, 52)',
            data: yAxisMin
            }
        ]
      };

    const chartCanvas = document.getElementById('DailyTempChart');
        
    const myChart = new Chart(chartCanvas,{
        type: 'line',
        data: data,
        options: {
            responsive: true
        }
        } );
    
}).catch(err =>{
    console.log("there is some error getting the weather information",err.message);
})

//Manage Modal Window

const modalBody = document.querySelector('.modal-body');
const modalSave = document.querySelector('.modal-save');

//Save new city input
const modalSearch = document.querySelector('.modal-search');
const modalCities = document.querySelector('.modal-cities');

modalSearch.addEventListener('submit', (e)=>{
    e.preventDefault();
    const newCityName = modalSearch.search_city.value.trim();

    // Get City Information and list available cities
    getCity(newCityName).then(data =>{
        modalCities.style.display = '';
        for (let i=0;i<data.length;i++){
            const listTag = document.createElement('li');
            listTag.classList.add('list-group-item');
            listTag.setAttribute('data-bs-dismiss','modal');
            listTag.textContent = `${data[i].EnglishName}, ${data[i].AdministrativeArea.EnglishName}, ${data[i].AdministrativeArea.ID}, ${data[i].Country.EnglishName}, ${data[i].PrimaryPostalCode}, ${data[i].Key}`;
            modalCities.append(listTag);
        }

        // Ask user to choose the city and get weather information
        modalCities.addEventListener('click', (e)=> {
            const cityID = data[Array.from(modalCities.children).indexOf(e.target)].Key;
            const cityName = data[Array.from(modalCities.children).indexOf(e.target)].EnglishName;
            const cityProv = data[Array.from(modalCities.children).indexOf(e.target)].AdministrativeArea.ID;
            const cityCtr = data[Array.from(modalCities.children).indexOf(e.target)].Country.EnglishName;
            localStorage.setItem('cityID',cityID);
            localStorage.setItem('cityName',cityName);
            localStorage.setItem('cityProv',cityProv);
            localStorage.setItem('cityCtr',cityCtr);
            modalCities.style.display = 'none';
            location.reload();
        });

    }).catch(err => {
        console.log("there is some error getting the City",err.message);
        });

    const closeBtn = document.querySelector('.btn-close');
    closeBtn.addEventListener('click', () =>{
        modalCities.style.display = 'none';
    })

});