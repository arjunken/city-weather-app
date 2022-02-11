//API Calls
//LOCAL
const API_KEY = '95d358dddd319c22c14e2f5cd91b953a';
// const getCurrentWeather_URL = '';
// const getHourlyWeather_URL = '';
// const getDailyWeather_URL = '';
//Through Server
// const getCity_URL = './server/apicall.php?q=citydata&input=';
// const getCurrentWeather_URL = './server/apicall.php?q=currentweather&input=';
// const getHourlyWeather_URL = './server/apicall.php?q=hourlyweather&input=';
// const getDailyWeather_URL = './server/apicall.php?q=dailyweather&input=';

// const getCity = async (uPosition) => {
//     const api_URL = 'https://api.openweathermap.org/data/2.5/weather?lat='+uPosition.lat+'&lon='+uPosition.lon+'&appid='+API_KEY;   
//     const response = await fetch(api_URL);
//     const data = await response.json(); 
//     return data;
// };

const getCountries = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const saveHomeLocation = async (url) => {
    const response = await fetch(url+API_KEY);
    if(response.status !== 200) { 
        throw new Error('Please check the Zipcode format. Use only first 3 letters for alpha-numeric codes.');
    }
    const data = await response.json();
    return data;
}

const getWeatherData = async (url) => {
    const response = await fetch(url+API_KEY);
    const data = await response.json();
    return data;
}

const getCityName = async (url) => {
    const response = await fetch(url+API_KEY);
    const data = await response.json();
    return data;
}


// const getCurrentWeather = async (id) => {
//     const response = await fetch(getCurrentWeather_URL+id);
//     const data = await response.json();
//     return data;
// };

// const getHourlyWeather = async (id) => {
//     const response = await fetch(getHourlyWeather_URL+id);
//     const data = await response.json();
//     return data;
// };

// const getDailyWeather = async (id) => {
//     const response = await fetch(getDailyWeather_URL+id);
//     const data = await response.json();
//     return data;
// };

export { getCountries, saveHomeLocation, getWeatherData, getCityName };