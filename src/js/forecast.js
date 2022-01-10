//API Calls
const getCity = async (cityName) => {
    const response = await fetch("./server/apicall.php?q=citydata&input="+cityName);
    const data = await response.json();  
    return data;
};

const getCurrentWeather = async (id) => {
    const response = await fetch("./server/apicall.php?q=currentweather&input="+id);
    const data = await response.json();
    return data;
};

const getHourlyWeather = async (id) => {
    const response = await fetch("./server/apicall.php?q=hourlyweather&input="+id);
    const data = await response.json();
    return data;
};

const getDailyWeather = async (id) => {
    const response = await fetch("./server/apicall.php?q=dailyweather&input="+id);
    const data = await response.json();
    return data;
};

export { getCity, getHourlyWeather, getCurrentWeather, getDailyWeather };