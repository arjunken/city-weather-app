const weatherbody = document.querySelector('.weatherbody');
const hourly_weather = document.querySelector('.hourly-weather');
const hourly_tab = document.getElementById('hourly-tab');
const daily_tab = document.getElementById('daily-tab');

//#####################
// Display Current Weather
//#####################
const displayCurrentWeatherData = (wdata,citydata) => {
    const imgquerystr = wdata[0].weatherText.replace(/\s+/g,'%20');
    let img = `<img src="assets/night.jpg" class="bkg_img" alt="">`;
    if(wdata[0].isDayTime){ 
    img = `<img src="assets/day.jpg" class="bkg_img" alt="">`;
    }
    const htmlContent = img + 
    `<p class="city my-2">${citydata[0].cityName}, ${citydata[0].cityProv}, ${citydata[0].cityCtr} <br> Updated ${dateFns.distanceInWords(new Date(),wdata[0].apiCallTime,{ addSuffix: true })}</p>
    <i class="fa fa-edit" data-bs-toggle="modal" data-bs-target="#Modal" data-bs-toggle="tooltip" data-bs-placement="top" title="Change Location"></i>
    <div class="d-flex flex-row justify-content-evenly">        
        <p class="temp">${wdata[0].temperatureValue} <sup>0</sup>${wdata[0].temperatureUnit}</p>
        <p class="conditions m-auto">${wdata[0].weatherText}</p>
        <img src="assets/${wdata[0].weatherIcon}.png" alt="" class="m-auto weathericon">
    </div>`;        
    weatherbody.innerHTML = htmlContent;
}
            

//#####################
// Display Hourly Weather
//#####################
const displayHourlyData = (hourlydata) => {   
    hourly_tab.innerHTML = ` (${dateFns.distanceInWords(new Date(),hourlydata[0].apiCallTime,{ addSuffix: true })})`;
    for (let i=1;i<hourlydata.length;i++){
    hourly_weather.innerHTML += `
    <div class="hourly-weather-item d-flex flex-row"> 
    <div class="hourly-time w-25 align-self-center m-auto">${dateFns.format(hourlydata[i].dateTime,"ha | ddd")}</div>
    <div class="hourly-temp w-25 align-self-center">${hourlydata[i].tempC} <sup>0</sup>C</div>
    <div class="hourly-cond w-25 align-self-center">${hourlydata[i].iconPhrase}</div>
    <img src="assets/${hourlydata[i].weatherIcon}.png" alt="" class="hourly-icon w-10 align-self-center">
    </div>`;
    }
}

//#####################
// Display Daily Weather
//#####################

const displayDailyWeatherData = (dailydata) => {
    //Display Headline Text
    weatherbody.innerHTML += `<p class="muted text-warning headline"> ${dailydata[1].headline}</p>`;
    daily_tab.innerHTML = ` (${dateFns.distanceInWords(new Date(),dailydata[0].apiCallTime,{ addSuffix: true })})`;
    //Chart 
        const data = {
            labels: dailydata[2].xAxis,
            datasets: [
                {
                label: 'Max Temperatures',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: dailydata[2].yMax
                },
                {
                label: 'Min Temeratures',
                backgroundColor: 'rgb(50, 200, 52)',
                borderColor: 'rgb(50, 200, 52)',
                data: dailydata[2].yMin
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
    
}

//#####################
// Select City Workdlow UI
//#####################

const selectCity = (data,cityListDom) => {
    
    cityListDom.style.display = '';

    while (cityListDom.firstChild) {
        cityListDom.removeChild(cityListDom.lastChild);
    }
   
    for (let i=0;i<data.length;i++){
        const listTag = document.createElement('li');
        listTag.classList.add('list-group-item');
        listTag.textContent = `${data[i].EnglishName}, ${data[i].AdministrativeArea.EnglishName}, ${data[i].AdministrativeArea.ID}, ${data[i].Country.EnglishName}, ${data[i].PrimaryPostalCode}, ${data[i].Key}`;
        cityListDom.append(listTag);    
    }

    // Ask user to choose the city and get weather information
    cityListDom.addEventListener('click', (e)=> {
        //remove existing local data
        localStorage.removeItem(cityData);
        //create new local data
        let cityData = new Array();
        cityData = [{
            cityID: data[Array.from(cityListDom.children).indexOf(e.target)].Key,
            cityName: data[Array.from(cityListDom.children).indexOf(e.target)].EnglishName,
            cityProv : data[Array.from(cityListDom.children).indexOf(e.target)].AdministrativeArea.ID,
            cityCtr : data[Array.from(cityListDom.children).indexOf(e.target)].Country.EnglishName
        }];
        //store data locally
        localStorage.setItem('cityData',JSON.stringify(cityData));        
        //hide and unhide dom elements
        cityListDom.style.display = 'none';
        localStorage.removeItem('currentWeatherData');
        localStorage.removeItem('hourlyWeatherData');
        localStorage.removeItem('dailyWeatherData');
        location.reload();
    });    
}

//export the functions
export {displayCurrentWeatherData, displayHourlyData, displayDailyWeatherData, selectCity};