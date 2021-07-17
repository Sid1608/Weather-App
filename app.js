const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
require('dotenv').config();
const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
   res.sendFile(__dirname+"/index.html");
    
});

//body parser allow you to access the body of post request.
app.post("/",function(req,res){

    const query=req.body.cityName;
    const apiKey=process.env.API_KEY;
    const unit="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;

    https.get(url,function(response){//fetces data from external resource
          if(response.statusCode == "404"){
            res.send("<h1>Invalid Input!!</h1>");
          }
          else{
                response.on("data",function(data){

                const weatherData=JSON.parse(data)//converts data to java script object.first it will turn json into string format(json binary) and then turn it into actual javascript object.
                const temp=weatherData.main.feels_like;
                const weatherDescription=weatherData.weather[0].description;
                const icon=weatherData.weather[0].icon;
                const imageUrl="http://openweathermap.org/img/wn/"+icon+"@2x.png";


                res.write("<p>The weather is currently "+ weatherDescription+"</p>");
                res.write("<h1>The Tempearatur in " +query+" is "+temp+" degrees Celcius.</h1>");
                res.write( "<img src="+imageUrl+">");
                res.send();
            });
        }
    });
});

app.listen(3000,function(){
    console.log("Server is running on port 3000.")
});
