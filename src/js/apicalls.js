//API Calls
const API_KEY = 'fgfdg'

const getCountries = async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

const saveHomeLocation = async (url) => {
  const response = await fetch(url + API_KEY)
  if (response.status !== 200) {
    throw new Error(
      'Please check the Zipcode format. Use only first 3 letters for alpha-numeric codes.'
    )
  }
  const data = await response.json()
  return data
}

const getWeatherData = async (url) => {
  const response = await fetch(url + API_KEY)
  const data = await response.json()
  return data
}

const getCityName = async (url) => {
  const response = await fetch(url + API_KEY)
  const data = await response.json()
  return data
}

export { getCountries, saveHomeLocation, getWeatherData, getCityName }
