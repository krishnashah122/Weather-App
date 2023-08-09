const express = require('express');
const https = require("https");
const path = require('path');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('assests'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get("/", function(req, res){

    return res.render('index', {
        title: 'Weather App'
    });
    
});


app.post("/", function(req, res){

    const cityName = req.body.cityName;
    const unit = "metric";
    const API_KEY = "26496ad367c28f9300bf7ce4c76bda8d";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`;

    // https node module is used to fetch data from API
    https.get(URL, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){

            // convert the received data (String format) into JSON format
            const weatherData = JSON.parse(data);

            // console.log(weatherData);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            // console.log(temp);
            const icon = weatherData.weather[0].icon;
            const ICON_URL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            // write() is used to send multiple responses

            return res.render('weather-info', {
                title: "Weather Info",
                cityName: weatherData.name,
                temp: temp,
                description: weatherDescription,
                icon: ICON_URL
            });

        });
    });

});

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});