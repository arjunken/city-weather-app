//API Calls
import {API_KEY} from '../../.config';
const key = API_KEY;

const getCity = async (cityName) => {
    const apiBase = 'https://dataservice.accuweather.com/locations/v1/cities/search';
    const response = await fetch(apiBase + `?apikey=${key}`+ `&q=` + cityName, { mode: "cors"});
    const data = await response.json();
    return data;
};

const getCurrentWeather = async (id) => {

    const apiBase = 'https://dataservice.accuweather.com/currentconditions/v1/' + id;
    const response = await fetch(apiBase + `?apikey=${key}`, { mode: "cors"});
    const data = await response.json();
    return data;
};

const getHourlyWeather = async (id) => {

    const apiBase = 'https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/' + id;
    const response = await fetch(apiBase + `?apikey=${key}`, { mode: "cors"});
    const data = await response.json();
    return data;
};

const getDailyWeather = async (id) => {

    const apiBase = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/' + id;
    const response = await fetch(apiBase + `?apikey=${key}`, { mode: "cors"});
    const data = await response.json();
    return data;
};

export { getCity, getHourlyWeather, getCurrentWeather, getDailyWeather };