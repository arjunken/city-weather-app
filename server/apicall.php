<?php

include('./config.php');

// get the q parameter from URL  
$q = $_REQUEST['q'];
$input = $_REQUEST['input'];

switch ($q) {
    case "citydata":
        $service_url = 'https://dataservice.accuweather.com/locations/v1/cities/search?apikey='.$API_KEY.'&q='.$input;
        break;
    case "currentweather":
        $service_url = 'https://dataservice.accuweather.com/currentconditions/v1/'.$input.'?apikey='.$API_KEY;
        break;
    case "hourlyweather":
        $service_url = 'https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/'.$input.'?apikey='.$API_KEY;
        break;
    case "dailyweather":
        $service_url = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/'.$input.'?apikey='.$API_KEY;
        break;
    default:
        echo '{"error": "The request for weather failed"}';
        die('error occured!');
}

$curl=curl_init($service_url);
curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
$curl_response = curl_exec($curl);
if ($curl_response === false) {
  $info = curl_getinfo($curl);
  curl_close($curl);
  die('error occured during curl exec. Additioanl info: ' . var_export($info));
  }
curl_close($curl);
$decoded = json_decode($curl_response);
if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
      die('error occured: ' . $decoded->response->errormessage);
  }
echo $curl_response;

?>