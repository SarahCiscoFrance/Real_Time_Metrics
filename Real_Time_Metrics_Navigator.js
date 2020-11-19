// Real-time Environmental Metrics
// jcbouil@cisco.com & abouton@cisco.com

const xapi = require('xapi');

//sensors

var humidity = 0;
var temperatureC = 0;
var temperatureF = 0;
var tvoc = 0;
var airquality;
var noiseLA = 0;
var soundLA = 0;
var peopleC = 0;

//determine temperature status
function tempStatus(val){
  var status;
  val = parseFloat(val);
  if ((val <= 18.9) || (val >= 31)){status = "Poor";}
  else if((val>=19 && val<=20.9) || (val>=27 && val<=30.9)){status = "Acceptable";}
  else if(val>=21 && val<=26.9){status = "Excellent";}
  else{status = "Bug";}

  console.log("The temp Status is: "+status);
  return status;
}

//determine humidity status
function humidStatus(val){
  var status;
  val = parseFloat(val);
  if ((val <= 20) || (val >= 70)){status = "Poor";}
  else if((val>=20 && val<=29) || (val>=61 && val<=69)){status = "Acceptable";}
  else if(val>=30 && val<=60){status = "Excellent";}

  console.log("The humidity Status is: "+status);
  return status;
}

//determine ambient noise status
function noiseStatus(val){
  var status;
  val = parseFloat(val);
  if (val >= 51){status = "Poor";}
  else if(val>=40 && val<=50){status = "Acceptable";}
  else if(val>=0 && val<=39){status = "Excellent";}

  console.log("The ambient noise is: "+status);
  return status;
}

//determine people count
function peopleCount(val){
  var status;
  if (val == 1){status = "There is "+ val + " person in the room";}
  else if (val >=2){status = "There are "+ val+ " persons in the room";}
  console.log("peoplecount: "+status);
  return status;
}

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {

//data
    //get temp
    xapi.status.get("Peripherals ConnectedDevice RoomAnalytics AmbientTemperature").then((temp) => {
        console.log(temp + "object type: "+typeof(temp));
        temperatureC = temp;
        temperatureF = (temp * 9/5) + 32;
        temperatureF = temperatureF.toFixed(1);
    });

    //get humid
    xapi.status.get("Peripherals ConnectedDevice RoomAnalytics RelativeHumidity").then((humid) => {
        console.log("this is the humidity: "+humid);
        humidity = humid;
    });

    //get noise
    xapi.status.get("RoomAnalytics AmbientNoise Level A").then((noise) => {
        console.log("this is the noise level: "+noise);
        noiseLA = noise;
    });
    //get sound
    xapi.status.get("RoomAnalytics Sound Level A").then((sound) => {
        console.log("this is the sound level: "+sound);
        soundLA = sound;
    });

    //get people
    xapi.status.get("RoomAnalytics PeopleCount Current").then((people) => {
        console.log("this is the people count: "+people);
        peopleC = people;
    });

    //get air PPB
    xapi.status.get("Peripherals ConnectedDevice RoomAnalytics AirQuality TVOCppb").then((airq) => {
        console.log("this is the ppb: "+airq);
        tvoc = airq;
    });

    //get air stat
    xapi.status.get("Peripherals ConnectedDevice RoomAnalytics AirQuality Index").then((airstat) => {
        console.log("this is the air status: "+airstat);
        airquality = airstat;

        //if panel metric selected
        if(event.PanelId === 'metric'){
            //set temp C
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "temperatureC", 
              Value: temperatureC + "°C" 
            });

            //set temp F
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "temperatureF", 
              Value: temperatureF + "°F" 
            });

            //set Temp status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "temp_status", 
              Value: tempStatus(temperatureC)
            });

            //set humid
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "humidity", 
                Value: humidity + "%" 
            });

            //set humid status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "humid_status", 
              Value: humidStatus(humidity)
            });
            
            //set noise                   
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "noiseLA", 
                Value: noiseLA + " dBA"
            });

            //set noise status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "noise_status", 
              Value: noiseStatus(noiseLA)
            });

            //set sound
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "soundLA", 
                Value: soundLA + " dBA" 
            });
            
            //set people count
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "peopleC", 
              Value: peopleCount(peopleC)
            });

            //set air PPB
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "aqtvoc", 
              Value: tvoc + " ppb" 
            });

            //set air status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "aqstatus", 
              Value: airquality
            });
          }
    });
});