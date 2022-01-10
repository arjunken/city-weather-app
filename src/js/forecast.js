//API Calls
//LOCAL
// API_KEY = '';
// const getCity_URL = '';
// const getCurrentWeather_URL = '';
// const getHourlyWeather_URL = '';
// const getDailyWeather_URL = '';
//Through Server
const getCity_URL = './server/apicall.php?q=citydata&input=';
const getCurrentWeather_URL = './server/apicall.php?q=currentweather&input=';
const getHourlyWeather_URL = './server/apicall.php?q=hourlyweather&input=';
const getDailyWeather_URL = './server/apicall.php?q=dailyweather&input=';

const getCity = async (cityName) => {
    const response = await fetch(getCity_URL+cityName);
    const data = await response.json();  
    return data;
};

const getCurrentWeather = async (id) => {
    const response = await fetch(getCurrentWeather_URL+id);
    const data = await response.json();
    return data;
};

const getHourlyWeather = async (id) => {
    const response = await fetch(getHourlyWeather_URL+id);
    const data = await response.json();
    return data;
};

const getDailyWeather = async (id) => {
    const response = await fetch(getDailyWeather_URL+id);
    const data = await response.json();
    return data;
};

export { getCity, getHourlyWeather, getCurrentWeather, getDailyWeather };