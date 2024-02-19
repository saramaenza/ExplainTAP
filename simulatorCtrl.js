/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GLOBALS from './global';
import NaturalLanguage from './NaturalLanguage';
import {getPreviousActionNaturalLanguage} from './naturalLanguageCtrl';
import {getNaturalLanguageLocale, getRulesListLocale, getNaturalLanguageResponseMsgLocale,getRepositoryLabelLocale, getDimensionLocale, getSimulatorMsgLocale } from './translation';
import updateEvent from '../logger';
var conflictRules = {}; 
var rules = new Array();
var appliancesActionList = new Array();
var uiModificationActionList = new Array();
var involvedCtxDimensions = new Array();
var involvedCtxParent = new Array();
var involvedCtxEntities = new Array();
var ruleTriggerName;
var ruleTriggerValue;
var ruleTriggerOperator;
var ruleTriggerParent;
var ruleTriggerNextOperator;
var dimension;
var triggerVerified = true;
var actions = new Array();
var regexID = /^[^a-z]+|[^\w-]+/gi;
var currRuleId; 
var ruleIdHashMap = {};
var triggerVerifiedAction =  new Array();
var formTriggerName;
var formTriggerValue;
var contexbuttonWhy = $('#contexButtonWhy');
var buttonContainer = $('#buttonContainer');
var arrayTriggerNotVerified = new Array();
var actionUpdateContextUse = new Array();
var getInput = {};
var formValue = {};
var selectedRules = new Array();
var simulatorValue = {};//oggetto per salvare i valori immessi dagli utenti 
var nameGlobal;
var arrayIndex = new Array();
var isLoopArray = new Array();
var userGoal;
var semantic;
var arrayIndirectActivation = new Array();

export function loadRulesFromRepositoryForSimulator(response) {
    semantic = GLOBALS.semanticDefinition;
    rules = response.rules;
    GLOBALS.rules = new Array();
    GLOBALS.original_rules = new Array();
    GLOBALS.tmpAction = new Array();
    GLOBALS.tmpAction = undefined;
    var rulesToBeRemoved = new Array();
    actionbuttoncontex(true);
    
    for (var i = 0; i < response.rules.length; i++) {
        //todo remove undefined actions
        if (rulesToBeRemoved.indexOf(response.rules[i].id) === -1) {
            if (getURLParameter('id') !== "null" &&
                    getURLParameter('id') === response.rules[i].id) {
                rIdx = GLOBALS.rules.push(response.rules[i]) - 1;
            } else
                GLOBALS.rules.push(response.rules[i]);
                GLOBALS.original_rules.push(JSON.parse(JSON.stringify(response.rules[i])));
                
        }
    }
    writeRules(false); 
    $('#tree').treeview({
        data: getTree(rules, false),
        onNodeSelected: () => false
    }); 
    var elementsToHide = $("li > span.labelTreeNotSelected").parent("li");
    elementsToHide.each(function(){
        $(this).css("display","none");
    });
    $(".envVarList").siblings("span").remove();
    //getWeather();
    //getAirQuality();
}

var key = "858dcf408d9da14d61a6b5ec9b742a0b";
var city = "Pisa";
var realTemperatureWeather;
var realHumidityWeather;
var realWeatherCondition;
var realAirQualityIndex;

function getWeather(){   
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+key+'&units=metric')
    .then(response => response.json())
    .then(data => {
      realTemperatureWeather = data.main.temp;
      realHumidityWeather = data.main.humidity;
      realWeatherCondition = data.weather;
    })
    .catch(err => console.log("Error open wearher map"));
}

function getAirQuality(){ 
    fetch('http://api.openweathermap.org/data/2.5/air_pollution?lat=43.7155&lon=10.3966&appid='+key)
    .then(response => response.json())
    .then(data => {
      realAirQualityIndex = data.list[0].main.aqi;
      //air Quality Index --> Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    })
    .catch(err => console.log("Error open wearher map"));
}

var conflictWithGoal = new Array();
var $infoRules = $('#infoRules');
var desideredBedroomHumidity;
var desideredBedroomTemperature;
var desideredKitchenHumidity;
var desideredKitchenTemperature;
var desideredBathroomHumidity;
var desideredBathroomTemperature; 
var desideredLivingRoomHumidity;
var desideredLivingRoomTemperature;
var desideredHomeHumidity;
var desideredHomeTemperature; 

function getGoalCheck(){
    var devicesInConflict = [];
    //var allRulesConflictText = new Array();
    var alternativeAction = '';
    var increaseEnvironmentVariables;
    var decreaseEnvironmentVariables;
    var temperatureOutside = outsideValues.find(function(elemento) {
        return elemento.variable === 'temperature';
    });
    temperatureOutside = parseInt(temperatureOutside.value);
    var humidityOutside = outsideValues.find(function(elemento) {
        return elemento.variable === 'humidity';
    });
    humidityOutside = parseInt(humidityOutside.value);
    var noiseOutside = outsideValues.find(function(elemento) {
        return elemento.variable === 'noise';
    });
    noiseOutside = parseInt(noiseOutside.value);
    var airQualityOutside = outsideValues.find(function(elemento) {
        return elemento.variable === 'airquality';
    });
    airQualityOutside = airQualityOutside.value;
    var rooms = Array.from(new Set(internalValues.map(function(element) {
        return element.room;
    })));
    console.log(rooms);
    var roomData = {};

    rooms.forEach(function(room) {
        var temperature = internalValues.find(item => item.room === room && item.variable === 'temperature');
        var humidity = internalValues.find(item => item.room === room && item.variable === 'humidity');
        var airQuality = internalValues.find(item => item.room === room && item.variable === 'airquality');
        var noise = internalValues.find(item => item.room === room && item.variable === 'noise');

        roomData[room] = {
            temperature: parseInt(temperature.value),
            humidity: parseInt(humidity.value),
            airQuality: airQuality.value,
            noise: parseInt(noise.value)
        };
    });
    if(roomData['bedroom'] !== undefined){
        var temperatureBedroom = roomData['bedroom'].temperature;
        var humidityBedroom = roomData['bedroom'].humidity;
        var airQualityBedroom = roomData['bedroom'].airQuality;
        var noiseBedroom = roomData['bedroom'].noise;
    }
    if(roomData['kitchen'] !== undefined){
        var temperatureKitchen = roomData['kitchen'].temperature;
        var humidityKitchen = roomData['kitchen'].humidity;
        var airQualityKitchen = roomData['kitchen'].airQuality;
        var noiseKitchen = roomData['kitchen'].noise;
    }
    if(roomData['bathroom'] !== undefined){
        var temperatureBathroom = roomData['bathroom'].temperature;
        var humidityBathroom = roomData['bathroom'].humidity;
        var airQualityBathroom = roomData['bathroom'].airQuality;
        var noiseBathroom = roomData['bathroom'].noise;
    }
    if(roomData['livingroom'] !== undefined){
        var temperatureLivingRoom = roomData['livingroom'].temperature;
        var humidityLivingRoom = roomData['livingroom'].humidity;
        var airQualityLivingRoom = roomData['livingroom'].airQuality;
        var noiseLivingRoom = roomData['livingroom'].noise;
    }
    if(roomData['home'] !== undefined){
        var temperatureHome = roomData['home'].temperature;
        var humidityHome = roomData['home'].humidity;
        var airQualityHome = roomData['home'].airQuality;
        var noiseHome = roomData['home'].noise;
    }
    
    selectedRules = new Array();
    
    // Trova gli input di tipo checkbox selezionati
    var checkedCheckboxes = $(".rule_list input[type=checkbox]:checked");
    if (checkedCheckboxes.length > 0) {
        // Itera sugli input di tipo checkbox selezionati
        checkedCheckboxes.each(function () {
            var selectedId = $(this).attr("id").replace("checkbox_", "");
            var matchedRule = rules.find(item => item.ruleName === selectedId);
            if (matchedRule && !selectedRules.some(rule => rule.ruleName === selectedId)) {
              selectedRules.push(matchedRule);
            }
        });
    }
          
    selectedRules.forEach(function(rule){
       var arrayText = [];
       var variablesNotInvolved = new Array();
       rule.actions.forEach(function(action){
            var realNameAction = action.action.realName;
            var displayedNameAction;
            if (action.action.displayedName === undefined){
                displayedNameAction = realNameAction;
            }
            else {
                displayedNameAction = action.action.displayedName.toLowerCase();
            }
            if(realNameAction !== "Reminders" && realNameAction !== "Alarms2"){
                var parentAction = action.parent;
                var valueOperator = action.operator;
                variablesNotInvolved[parentAction.toLowerCase()] = {};
                arrayText[parentAction.toLowerCase()] = {room: parentAction};
                if (valueOperator === "turnOn"){
                    valueOperator = "on";
                }
                if (valueOperator === "turnOff"){
                    valueOperator = "off";
                }
               //lista di goals con hanno effetti negativi dall'esecuzione dell'azione     TODO: da gestire devices
                var myNegativeGoals = negativeGoalsForAction(realNameAction, parentAction, valueOperator);
                if(myNegativeGoals !== undefined){
                myNegativeGoals.forEach(function(goal){
                    if(goal.goal.replace(/\s/g, '').replace(/-/g, '') === userGoal){
                        var goalEnvironmentVar = goal.environment_variable;  
                        var originalGoalDescription = goal.description;
                        parentAction = parentAction.toLowerCase();
                        
                        if(valueOperator === "open"){
                            if (goalEnvironmentVar !== undefined){                         
                            if (goalEnvironmentVar === "temperature") {
                                var roomTemp, desideredTemperature;
                                var nameParent = parentAction;
                                if (parentAction === "bedroom") {
                                    roomTemp = temperatureBedroom;
                                    desideredTemperature = desideredBedroomTemperature;
                                } else if (parentAction === "kitchen") {
                                    roomTemp = temperatureKitchen;
                                    desideredTemperature = desideredKitchenTemperature;
                                }
                                else if (parentAction === "livingroom") {
                                    roomTemp = temperatureLivingRoom;
                                    desideredTemperature = desideredLivingRoomTemperature;
                                    nameParent = "living room";
                                }
                                else if (parentAction === "home") {
                                    roomTemp = temperatureHome;
                                    desideredTemperature = desideredHomeTemperature;
                                }
                                else if (parentAction === "bathroom") {
                                    roomTemp = temperatureBathroom;
                                    desideredTemperature = desideredBathroomTemperature;
                                }
                                if ((roomTemp > desideredTemperature && temperatureOutside < desideredTemperature) ||
                                    (roomTemp < desideredTemperature && temperatureOutside > desideredTemperature) ||
                                    (roomTemp > desideredTemperature && temperatureOutside > desideredTemperature && temperatureOutside < roomTemp) ||
                                    (roomTemp > desideredTemperature && temperatureOutside > desideredTemperature && temperatureOutside === roomTemp) ||
                                    (roomTemp < desideredTemperature && temperatureOutside < desideredTemperature && temperatureOutside > roomTemp) ||
                                    (roomTemp < desideredTemperature && temperatureOutside < desideredTemperature && temperatureOutside === roomTemp) ||
                                    (temperatureOutside === desideredTemperature) ||
                                    (isNaN(desideredTemperature) && temperatureOutside < roomTemp) ||
                                    (isNaN(desideredTemperature) && roomTemp === temperatureOutside)){
                                        if(variablesNotInvolved[parentAction].variables === undefined){
                                            variablesNotInvolved[parentAction] = {
                                                variables: ["temperature"]
                                            };
                                        }
                                        else {
                                            variablesNotInvolved[parentAction].variables.push('temperature');
                                        } 
                                } 
                                else if (roomTemp === desideredTemperature){
                                    goal.description = "inside the "+nameParent+" there is the temperature level desidered ("+desideredTemperature+"&deg) ";
                                }
                                else if (roomTemp < desideredTemperature && temperatureOutside < desideredTemperature && temperatureOutside < roomTemp){
                                    goal.description = goal.description.replace("external temperature is more", "external temperature ("+temperatureOutside+"&deg) is less");
                                    goal.description = goal.description.replace(nameParent+" temperature", nameParent+" temperature ("+roomTemp+"&deg) ");
                                }
                                else {
                                    goal.description = goal.description.replace("external temperature", "external temperature (" + temperatureOutside + "&deg) ");
                                    goal.description = goal.description.replace(nameParent + " temperature", nameParent + " temperature (" + roomTemp + "&deg) ");
                                }
                            }
                            else if (goalEnvironmentVar === "noise") {
                                var roomNoise;
                                var nameParent = parentAction;
                                if (parentAction === "bedroom") {
                                    roomNoise = noiseBedroom;
                                } 
                                else if (parentAction === "kitchen") {
                                    roomNoise = noiseKitchen;
                                }
                                else if (parentAction === "livingroom") {
                                    roomNoise = noiseLivingRoom;
                                    nameParent = "living room";
                                } 
                                else if (parentAction === "home") {
                                    roomNoise = noiseHome;
                                }
                                else if (parentAction === "bathroom") {
                                    roomNoise = noiseBathroom;
                                }
                                if (noiseOutside > roomNoise) {
                                    goal.description = goal.description.replace("external noise", "external noise level (" + noiseOutside + ") ");
                                    goal.description = goal.description.replace(nameParent + " noise level", nameParent + " noise level (" + roomNoise + ") ");
                                } else {
                                    if(variablesNotInvolved[parentAction].variables === undefined){
                                        variablesNotInvolved[parentAction] = {
                                            variables: ["noise"]
                                        };
                                    }
                                    else {
                                        variablesNotInvolved[parentAction].variables.push('noise');
                                    } 
                                }
                            }
                            else if (goalEnvironmentVar === "humidity"){ 
                                var roomHum, desideredHumidity;
                                var nameParent = parentAction;
                                if (parentAction === "bedroom") {
                                    roomHum = humidityBedroom;
                                    desideredHumidity = desideredBedroomHumidity;
                                } else if (parentAction === "kitchen") {
                                    roomHum = humidityKitchen;
                                    desideredHumidity = desideredKitchenHumidity;
                                }
                                else if (parentAction === "livingroom") {
                                    roomHum = humidityLivingRoom;
                                    desideredHumidity = desideredLivingRoomHumidity;
                                    nameParent = "living room";
                                }
                                else if (parentAction === "home") {
                                    roomHum = humidityHome;
                                    desideredHumidity = desideredHomeHumidity;
                                }
                                else if (parentAction === "bathroom") {
                                    roomHum = humidityBathroom;
                                    desideredHumidity = desideredBathroomHumidity;
                                }                             
                                
                                if ((roomHum > desideredHumidity && humidityOutside < desideredHumidity) ||
                                    (roomHum < desideredHumidity && humidityOutside > desideredHumidity) ||
                                    (roomHum > desideredHumidity && humidityOutside > desideredHumidity && humidityOutside < roomHum) ||
                                    (roomHum > desideredHumidity && humidityOutside > desideredHumidity && humidityOutside === roomHum) ||
                                    (roomHum < desideredHumidity && humidityOutside < desideredHumidity && humidityOutside > roomHum) ||
                                    (roomHum < desideredHumidity && humidityOutside < desideredHumidity && humidityOutside === roomHum) ||
                                    (humidityOutside === desideredHumidity) ||
                                    (isNaN(desideredHumidity) && humidityOutside < roomHum) ||
                                    (isNaN(desideredHumidity) && roomHum === humidityOutside)){
                                        if(variablesNotInvolved[parentAction].variables === undefined){
                                            variablesNotInvolved[parentAction] = {
                                                variables: ["humidity"]
                                            };
                                        }
                                        else {
                                            variablesNotInvolved[parentAction].variables.push('humidity');
                                        } 
                                } 
                                else if (roomHum === desideredHumidity){
                                    goal.description = "inside the "+nameParent+" there is the humidity level desidered ("+desideredHumidity+") ";
                                }
                                else if (roomHum < desideredHumidity && humidityOutside < desideredHumidity && humidityOutside < roomHum){
                                    goal.description = goal.description.replace("external humidity is more", "external humidity ("+humidityOutside+") is less");
                                    goal.description = goal.description.replace(nameParent+" humidity", nameParent+" humidity ("+roomHum+") ");
                                }
                                else {
                                    goal.description = goal.description.replace("external humidity", "external humidity ("+humidityOutside+") ");
                                    goal.description = goal.description.replace(nameParent+" humidity", nameParent+" humidity ("+roomHum+") ");
                                }
                        }
                        else if (goalEnvironmentVar === "air quality"){
                            var outsideIndex;
                            var nameParent = parentAction;
                            switch (airQualityOutside) {
                                case "Good":
                                    outsideIndex = 1;
                                    break;
                                case "Fair":
                                    outsideIndex = 2;
                                    break;
                                case "Moderate":
                                    outsideIndex = 3;
                                    break;
                                case "Poor":
                                    outsideIndex = 4;
                                    break;
                                case "Very Poor":
                                    outsideIndex = 5;
                                    break;
                            }
                            var roomAirQual;
                            var insideIndex;
                            if (parentAction === "bedroom") {
                                roomAirQual = airQualityBedroom;
                                switch (airQualityBedroom) {
                                    case "Good":
                                        insideIndex = 1;
                                        break;
                                    case "Fair":
                                        insideIndex = 2;
                                        break;
                                    case "Moderate":
                                        insideIndex = 3;
                                        break;
                                    case "Poor":
                                        insideIndex = 4;
                                        break;
                                    case "Very Poor":
                                        insideIndex = 5;
                                        break;
                                }
                            } else if (parentAction === "kitchen") {
                                roomAirQual = airQualityKitchen;
                                switch (airQualityKitchen) {
                                    case "Good":
                                        insideIndex = 1;
                                        break;
                                    case "Fair":
                                        insideIndex = 2;
                                        break;
                                    case "Moderate":
                                        insideIndex = 3;
                                        break;
                                    case "Poor":
                                        insideIndex = 4;
                                        break;
                                    case "Very Poor":
                                        insideIndex = 5;
                                        break;
                                }
                            }
                            else if (parentAction === "livingroom") {
                                nameParent = "living room";
                                roomAirQual = airQualityLivingRoom;
                                switch (airQualityLivingRoom) {
                                    case "Good":
                                        insideIndex = 1;
                                        break;
                                    case "Fair":
                                        insideIndex = 2;
                                        break;
                                    case "Moderate":
                                        insideIndex = 3;
                                        break;
                                    case "Poor":
                                        insideIndex = 4;
                                        break;
                                    case "Very Poor":
                                        insideIndex = 5;
                                        break;
                                }
                            }
                            else if (parentAction === "home") {
                                roomAirQual = airQualityHome;
                                switch (airQualityHome) {
                                    case "Good":
                                        insideIndex = 1;
                                        break;
                                    case "Fair":
                                        insideIndex = 2;
                                        break;
                                    case "Moderate":
                                        insideIndex = 3;
                                        break;
                                    case "Poor":
                                        insideIndex = 4;
                                        break;
                                    case "Very Poor":
                                        insideIndex = 5;
                                        break;
                                }
                            }
                            else if (parentAction === "bathroom") {
                                roomAirQual = airQualityBathroom;
                                switch (airQualityBathroom) {
                                    case "Good":
                                        insideIndex = 1;
                                        break;
                                    case "Fair":
                                        insideIndex = 2;
                                        break;
                                    case "Moderate":
                                        insideIndex = 3;
                                        break;
                                    case "Poor":
                                        insideIndex = 4;
                                        break;
                                    case "Very Poor":
                                        insideIndex = 5;
                                        break;
                                }
                            }      
                            //Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
                            if(outsideIndex > insideIndex){  
                                goal.description = goal.description.replace("external air quality value", "external air quality value ("+airQualityOutside+") ");
                                goal.description = goal.description.replace(nameParent+" air quality value", nameParent+" air quality value ("+roomAirQual+") ");
                            }
                            else {
                                if(variablesNotInvolved[parentAction].variables === undefined){
                                    variablesNotInvolved[parentAction] = {
                                        variables: ["air quality"]
                                    };
                                }
                                else {
                                    variablesNotInvolved[parentAction].variables.push('air quality');
                                } 
                            }
                        }
                   }
                        }
                        else if (valueOperator === "close"){
                            if (goalEnvironmentVar !== undefined){
                                
                                if (goalEnvironmentVar === "temperature") {
                                    var roomTemp, desideredTemperature;
                                    var nameParent = parentAction;
                                    if (parentAction === "bedroom") {
                                        roomTemp = temperatureBedroom;
                                        desideredTemperature = desideredBedroomTemperature;
                                    } else if (parentAction === "kitchen") {
                                        roomTemp = temperatureKitchen;
                                        desideredTemperature = desideredKitchenTemperature;
                                    }
                                    else if (parentAction === "livingroom") {
                                        roomTemp = temperatureLivingRoom;
                                        desideredTemperature = desideredLivingRoomTemperature;
                                        nameParent = "living room";
                                    }
                                    else if (parentAction === "home") {
                                        roomTemp = temperatureHome;
                                        desideredTemperature = desideredHomeTemperature;
                                    }
                                    else if (parentAction === "bathroom") {
                                        roomTemp = temperatureBathroom;
                                        desideredTemperature = desideredBathroomTemperature;
                                    }
                                    if ((roomTemp === desideredTemperature) ||
                                        (roomTemp > desideredTemperature && temperatureOutside > desideredTemperature && temperatureOutside > roomTemp) ||
                                        (roomTemp < desideredTemperature && temperatureOutside < desideredTemperature && temperatureOutside < roomTemp)) {
                                            if(variablesNotInvolved[parentAction].variables === undefined){
                                                variablesNotInvolved[parentAction] = {
                                                    variables: ["temperature"]
                                                };
                                            }
                                            else {
                                                variablesNotInvolved[parentAction].variables.push('temperature');
                                            }  
                                    }
                                    else if (desideredTemperature === temperatureOutside && temperatureOutside > roomTemp){ 
                                        goal.description = goal.description.replace("external temperature is less", "external temperature (" + temperatureOutside + "&deg) is more ");
                                        goal.description = goal.description.replace(nameParent + " temperature", nameParent + " temperature (" + roomTemp + "&deg) ");   
                                    }
                                    else {
                                        goal.description = goal.description.replace("external temperature", "external temperature (" + temperatureOutside + "&deg) ");
                                        goal.description = goal.description.replace(nameParent + " temperature", nameParent + " temperature (" + roomTemp + "&deg) ");
                                    }
                                }
                                
                                if (goalEnvironmentVar === "humidity") {
                                    var roomHum, desideredHumidity;
                                    var nameParent = parentAction;
                                    if (parentAction === "bedroom") {
                                        roomHum = humidityBedroom;
                                        desideredHumidity = desideredBedroomHumidity;
                                    } else if (parentAction === "kitchen") {
                                        roomHum = humidityKitchen;
                                        desideredHumidity = desideredKitchenHumidity;
                                    }
                                    else if (parentAction === "livingroom") {
                                        roomHum = humidityLivingRoom;
                                        desideredHumidity = desideredLivingRoomHumidity;
                                        nameParent = "living room";
                                    }
                                    else if (parentAction === "home") {
                                        roomHum = humidityHome;
                                        desideredHumidity = desideredHomeHumidity;
                                    }
                                    else if (parentAction === "bathroom") {
                                        roomHum = humidityBathroom;
                                        desideredHumidity = desideredBathroomHumidity;
                                    } 
                                    if ((roomHum === desideredHumidity) ||
                                        (roomHum > desideredHumidity && humidityOutside > desideredHumidity && humidityOutside > roomHum) ||
                                        (roomHum < desideredHumidity && humidityOutside < desideredHumidity && humidityOutside < roomHum)){
                                            if(variablesNotInvolved[parentAction].variables === undefined){
                                                variablesNotInvolved[parentAction] = {
                                                    variables: ["humidity"]
                                                };
                                            }
                                            else {
                                                variablesNotInvolved[parentAction].variables.push('humidity');
                                            }                                           
                                    }
                                    else if (desideredHumidity === humidityOutside && humidityOutside > roomHum){
                                        goal.description = goal.description.replace("external humidity is less", "external humidity (" + humidityOutside + ") is more ");
                                        goal.description = goal.description.replace(nameParent + " temperature", nameParent + " humidity (" + roomHum + ") ");
                                    }
                                    else {
                                        goal.description = goal.description.replace("external humidity", "external humidity ("+humidityOutside+") ");
                                        goal.description = goal.description.replace(nameParent+" humidity", nameParent+" humidity ("+roomHum+") ");
                                    }
                                }
                                
                                else if (goalEnvironmentVar === "noise") {
                                    var roomNoise;
                                    var nameParent = parentAction;
                                    if (parentAction === "bedroom") {
                                        roomNoise = noiseBedroom;
                                    } 
                                    else if (parentAction === "kitchen") {
                                        roomNoise = noiseKitchen;
                                    }
                                    else if (parentAction === "livingroom") {
                                        roomNoise = noiseLivingRoom;
                                        nameParent = "living room";
                                    }
                                    else if (parentAction === "home") {
                                        roomNoise = noiseHome;
                                    }
                                    else if (parentAction === "bathroom") {
                                        roomNoise = noiseBathroom;
                                    }
                                    if (noiseOutside < roomNoise) {
                                        goal.description = goal.description.replace("external noise", "external noise level (" + noiseOutside + ") ");
                                        goal.description = goal.description.replace(nameParent + " noise level", nameParent + " noise level (" + roomNoise + ") ");
                                    } else {
                                        if(variablesNotInvolved[parentAction].variables === undefined){
                                            variablesNotInvolved[parentAction] = {
                                                variables: ["noise"]
                                            };
                                        }
                                        else {
                                            variablesNotInvolved[parentAction].variables.push('noise');
                                        } 
                                    }
                                }
                                
                                else if (goalEnvironmentVar === "air quality"){
                                    var outsideIndex;
                                    var nameParent = parentAction;
                                    switch (airQualityOutside) {
                                        case "Good":
                                            outsideIndex = 1;
                                            break;
                                        case "Fair":
                                            outsideIndex = 2;
                                            break;
                                        case "Moderate":
                                            outsideIndex = 3;
                                            break;
                                        case "Poor":
                                            outsideIndex = 4;
                                            break;
                                        case "Very Poor":
                                            outsideIndex = 5;
                                            break;
                                    }
                                    var roomAirQual;
                                    var insideIndex;
                                    if (parentAction === "bedroom") {
                                        roomAirQual = airQualityBedroom;
                                        switch (airQualityBedroom) {
                                            case "Good":
                                                insideIndex = 1;
                                                break;
                                            case "Fair":
                                                insideIndex = 2;
                                                break;
                                            case "Moderate":
                                                insideIndex = 3;
                                                break;
                                            case "Poor":
                                                insideIndex = 4;
                                                break;
                                            case "Very Poor":
                                                insideIndex = 5;
                                                break;
                                        }
                                    } else if (parentAction === "kitchen") {
                                        roomAirQual = airQualityKitchen;
                                        switch (airQualityKitchen) {
                                            case "Good":
                                                insideIndex = 1;
                                                break;
                                            case "Fair":
                                                insideIndex = 2;
                                                break;
                                            case "Moderate":
                                                insideIndex = 3;
                                                break;
                                            case "Poor":
                                                insideIndex = 4;
                                                break;
                                            case "Very Poor":
                                                insideIndex = 5;
                                                break;
                                        }
                                    }
                                    else if (parentAction === "livingroom") {
                                        roomAirQual = airQualityLivingRoom;
                                        nameParent = "living room";
                                        switch (airQualityLivingRoom) {
                                            case "Good":
                                                insideIndex = 1;
                                                break;
                                            case "Fair":
                                                insideIndex = 2;
                                                break;
                                            case "Moderate":
                                                insideIndex = 3;
                                                break;
                                            case "Poor":
                                                insideIndex = 4;
                                                break;
                                            case "Very Poor":
                                                insideIndex = 5;
                                                break;
                                        }
                                    }
                                    else if (parentAction === "home") {
                                        roomAirQual = airQualityHome;
                                        switch (airQualityHome) {
                                            case "Good":
                                                insideIndex = 1;
                                                break;
                                            case "Fair":
                                                insideIndex = 2;
                                                break;
                                            case "Moderate":
                                                insideIndex = 3;
                                                break;
                                            case "Poor":
                                                insideIndex = 4;
                                                break;
                                            case "Very Poor":
                                                insideIndex = 5;
                                                break;
                                        }
                                    }
                                    else if (parentAction === "bathroom") {
                                        roomAirQual = airQualityBathroom;
                                        switch (airQualityBathroom) {
                                            case "Good":
                                                insideIndex = 1;
                                                break;
                                            case "Fair":
                                                insideIndex = 2;
                                                break;
                                            case "Moderate":
                                                insideIndex = 3;
                                                break;
                                            case "Poor":
                                                insideIndex = 4;
                                                break;
                                            case "Very Poor":
                                                insideIndex = 5;
                                                break;
                                        }
                                    }      
                                    //Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
                                    if(outsideIndex < insideIndex){  
                                        goal.description = goal.description.replace("external air quality value", "external air quality value ("+airQualityOutside+") ");
                                        goal.description = goal.description.replace(nameParent+" air quality value", nameParent+" air quality value ("+roomAirQual+") ");
                                    }
                                    else {
                                        if(variablesNotInvolved[parentAction].variables === undefined){
                                            variablesNotInvolved[parentAction] = {
                                                variables: ["air quality"]
                                            };
                                        }
                                        else {
                                            variablesNotInvolved[parentAction].variables.push('air quality');
                                        } 
                                    }
                                  }
                                                               
                            }
                        }
                        var textOperator = "";                   
                   switch (valueOperator) {
                        case "on":
                            textOperator = "<strong>turning on</strong> the <strong>" + displayedNameAction + "</strong>";
                            break;
                        case "off":
                            textOperator = "<strong>turning off</strong> the <strong>" + displayedNameAction + "</strong>";
                            break;
                        case "open":
                            textOperator = "<strong>opening the " + displayedNameAction + "</strong>";
                            break;
                        case "close":
                            textOperator = "<strong>closing the " + displayedNameAction + "</strong>";
                            break;
                        default:
                            break;
                    }
                    
                    var parentName = parentAction.toLowerCase();
                    if(parentName === "livingroom"){
                        parentName = "living room";
                    }

                    if(arrayText[parentAction].text === undefined) {
                        if(goalEnvironmentVar === "humidity"){
                            var humidityVariables = {
                                bedroom: humidityBedroom,
                                kitchen: humidityKitchen,
                                bathroom: humidityBathroom,
                                livingroom: humidityLivingRoom
                            };
                            var humidityValue = humidityVariables[parentAction];
                            if (humidityValue !== undefined){
                                if(variablesNotInvolved[parentAction].variables === undefined){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                                else if (!variablesNotInvolved[parentAction].variables.includes("humidity")){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                            }
                        }
                        
                        else if(goalEnvironmentVar === "temperature"){
                            var temperatureVariables = {
                                bedroom: temperatureBedroom,
                                kitchen: temperatureKitchen,
                                bathroom: temperatureBathroom,
                                livingroom: temperatureLivingRoom
                            };
                            var temperatureValue = temperatureVariables[parentAction];
                            if (temperatureValue !== undefined){
                                if(variablesNotInvolved[parentAction].variables === undefined){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                                else if (!variablesNotInvolved[parentAction].variables.includes("temperature")){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                            }
                        }
                        
                        else if(goalEnvironmentVar === "noise"){
                            var noiseVariables = {
                                bedroom: noiseBedroom,
                                kitchen: noiseKitchen,
                                bathroom: noiseBathroom,
                                livingroom: noiseLivingRoom
                            };
                            var noiseValue = noiseVariables[parentAction];
                            if (noiseValue !== undefined){
                                if(variablesNotInvolved[parentAction].variables === undefined){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                                else if (!variablesNotInvolved[parentAction].variables.includes("noise")){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                            }
                        }
                                                                                                         
                        else if(goalEnvironmentVar === "air quality"){
                            var airQualityVariables = {
                                bedroom: airQualityBedroom,
                                kitchen: airQualityKitchen,
                                bathroom: airQualityBathroom,
                                livingroom: airQualityLivingRoom
                            };
                            var airQualityValue = airQualityVariables[parentAction];
                            if (airQualityValue !== undefined){
                                if(variablesNotInvolved[parentAction].variables === undefined){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                                else if (!variablesNotInvolved[parentAction].variables.includes("air quality")){
                                    arrayText[parentAction] = {
                                        text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                        rule: rule.ruleName
                                    };
                                }
                            }
                        }
                        
                        else if (goalEnvironmentVar === undefined){
                            arrayText[parentAction] = {
                                text: `The action of ${textOperator} in the <strong>${parentName}</strong> of the <i>${rule.ruleName}</i> may be problematic with the <strong>${goal.goal}</strong> goal because ${goal.description.toLowerCase()}`,
                                rule: rule.ruleName
                            };
                        }

                    }
                    else {
                        if(goalEnvironmentVar === "humidity"){
                            var humidityVariables = [humidityBedroom, humidityBathroom, humidityKitchen, humidityLivingRoom];
                            for (var humidity of humidityVariables) {
                                if (humidity !== undefined && !arrayText[parentAction].text.includes(goal.description.toLowerCase())){
                                    if(variablesNotInvolved[parentAction].variables === undefined){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                    else if (!variablesNotInvolved[parentAction].variables.includes("humidity")){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                }
                            }
                        }
                        else if(goalEnvironmentVar === "temperature"){
                            var temperatureVariables = [temperatureBedroom, temperatureBathroom, temperatureKitchen, temperatureLivingRoom];
                            for (var temperature of temperatureVariables) {
                                if (temperature !== undefined && !arrayText[parentAction].text.includes(goal.description.toLowerCase())){
                                    if(variablesNotInvolved[parentAction].variables === undefined){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                    else if (!variablesNotInvolved[parentAction].variables.includes("temperature")){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                }
                            }
                        }
                        else if(goalEnvironmentVar === "noise"){
                            var noiseVariables = [noiseBedroom, noiseBathroom, noiseKitchen, noiseLivingRoom];
                            for (var noise of noiseVariables) {
                                if (noise !== undefined && !arrayText[parentAction].text.includes(goal.description.toLowerCase())){
                                    if(variablesNotInvolved[parentAction].variables === undefined){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                    else if (!variablesNotInvolved[parentAction].variables.includes("noise")){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                }
                            }
                        }
                        else if(goalEnvironmentVar === "air quality"){
                            var airQualityVariables = [airQualityBedroom, airQualityBathroom, airQualityKitchen, airQualityLivingRoom];
                            for (var airQuality of airQualityVariables) {
                                if (airQuality !== undefined && !arrayText[parentAction].text.includes(goal.description.toLowerCase())){
                                    if(variablesNotInvolved[parentAction].variables === undefined){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                    else if (!variablesNotInvolved[parentAction].variables.includes("air quality")){
                                        arrayText[parentAction].text += `and ${goal.description.toLowerCase()} `;
                                    }
                                }
                            }
                        }
                        else if (goalEnvironmentVar === undefined){
                            if(!arrayText[parentAction].text.includes(goal.description.toLowerCase())){
                                arrayText[parentAction].text += "and "+goal.description.toLowerCase()+" ";
                            }
                        }
                    }
                    goal.description = originalGoalDescription;
                    //lista delle variabili d'ambiente impattate dall'azione
                    increaseEnvironmentVariables = getIncreaseEnvironmentVariables(realNameAction, parentAction, valueOperator);
                    decreaseEnvironmentVariables = getDecreaseEnvironmentVariables(realNameAction, parentAction, valueOperator);
                }
            });
            if(variablesNotInvolved[parentAction.toLowerCase()].variables !== undefined){
                alternativeAction = getalternativeAction(parentAction, increaseEnvironmentVariables, decreaseEnvironmentVariables, variablesNotInvolved[parentAction].variables, realNameAction, valueOperator);
            }
            else {
                 alternativeAction = getalternativeAction(parentAction, increaseEnvironmentVariables, decreaseEnvironmentVariables, "", realNameAction, valueOperator);
            }
            devicesInConflict = {
                device: displayedNameAction,
                whyText: [],
                rule: rule.ruleName,
                suggestions: alternativeAction,
                parent: parentAction
            }; 
            if(arrayText[parentAction.toLowerCase()].text !== undefined){
                devicesInConflict.whyText += arrayText[parentAction.toLowerCase()].text;
                conflictWithGoal.push(devicesInConflict);
            }
                
            }
            }
        });
    });
    
    updateInfoGoalOptimization(conflictWithGoal);
    if($('.expandeRuleSugg').length === 0){
        $infoRules.find('.infoSuggestions').append("<p>There is no suggestions</p>"); 
    }
}

var iconSuggestions = "";
iconSuggestions += '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg"><rect x="11" y="18" width="7" height="5" fill="#EBE9E9"/><path d="M19.5937 9.62155C21.7506 18.6008 14.8261 17.9913 10.4384 17.9913C8.75292 17.9913 7 16.0356 7 12.8577C7 9.67973 11.4181 5 13.1036 5C14.7891 5 19.5937 6.4436 19.5937 9.62155Z" fill="#F6E871"/>';
iconSuggestions += '<path d="M13.1792 13.6115H14.6549V17.3006H13.1792V13.6115Z" fill="#272727"/><path d="M11 12.0493L12.0434 11.0059L14.6521 13.6145L13.6086 14.6579L11 12.0493Z" fill="#272727"/><path d="M14.2202 14.6521L13.1768 13.6087L15.7854 11L16.8288 12.0435L14.2202 14.6521Z" fill="#272727"/>';
iconSuggestions += '<path d="M21.1152 11.006C21.1004 10.9469 21.1004 10.8879 21.0857 10.8289C20.9971 10.4157 20.8643 10.0025 20.702 9.61884C20.6725 9.54506 20.643 9.48603 20.6135 9.41225C20.4511 9.02858 20.2445 8.67442 20.0232 8.32025C19.9789 8.26123 19.9494 8.2022 19.9051 8.15793C19.669 7.81853 19.4034 7.47912 19.0935 7.18399C19.064 7.15448 19.0492 7.13972 19.0197 7.11021C18.7246 6.81507 18.4 6.54945 18.0458 6.31335C18.0163 6.28383 17.9868 6.26907 17.9573 6.23956C17.6031 6.00345 17.2342 5.81162 16.8505 5.63454C16.7915 5.60502 16.7177 5.57551 16.6587 5.546C16.275 5.38367 15.8766 5.26562 15.4634 5.17708C15.3896 5.16232 15.3158 5.14757 15.242 5.13281C14.8141 5.05903 14.3714 5.01476 13.9287 5C13.9139 5 13.8844 5 13.8696 5C13.7221 5 13.5598 5.01476 13.4122 5.02951C13.3237 5.02951 13.2351 5.02951 13.1466 5.04427C12.8514 5.05903 12.5711 5.1033 12.2907 5.16232C9.42789 5.75259 7.1406 8.11366 6.62412 10.9912C6.16666 13.5294 7.00779 15.8609 8.58676 17.4842C9.118 18.0449 9.44264 18.7827 9.44264 19.5648V22.7228C9.44264 23.5344 10.1067 24.1985 10.9183 24.1985H11.3315C11.848 25.0839 12.7777 25.6741 13.8696 25.6741C14.9616 25.6741 15.9061 25.0839 16.4078 24.1985H16.821C17.6326 24.1985 18.2967 23.5344 18.2967 22.7228V19.5796C18.2967 18.8123 18.6065 18.0744 19.1525 17.5137C20.4364 16.1708 21.248 14.3705 21.248 12.3783C21.248 11.9061 21.189 11.4487 21.1152 11.006ZM16.821 22.708H13.8696H10.9183V21.2324H16.821V22.708ZM16.821 19.7567H10.9183V18.281H16.821V19.7567ZM18.0901 16.4659C17.9868 16.5692 17.913 16.6873 17.8097 16.8053H9.91486C9.82632 16.6873 9.73778 16.5692 9.63448 16.4512C8.29162 15.0641 7.71611 13.1752 8.07027 11.2568C8.49822 8.94004 10.3133 7.08069 12.5858 6.59372C13.0138 6.51994 13.4417 6.47567 13.8696 6.47567C17.1309 6.47567 19.7723 9.11712 19.7723 12.3783C19.7723 13.913 19.1821 15.3592 18.0901 16.4659Z" fill="#272727"/>';
iconSuggestions += '<path d="M25.6783 12.3231H22.737C22.3306 12.3231 22 12.0672 22 11.7496C22 11.4326 22.3306 11.176 22.737 11.176H25.6783C26.0847 11.176 26.4129 11.4326 26.4129 11.7496C26.4129 12.0672 26.0847 12.3231 25.6783 12.3231Z" fill="#272727"/>';
iconSuggestions += '<path d="M5.67673 12.1471H2.73454C2.32816 12.1471 2 11.8912 2 11.5736C2 11.2566 2.32816 11 2.73454 11H5.67592C6.0823 11 6.41288 11.2566 6.41288 11.5736C6.41369 11.8912 6.08311 12.1471 5.67673 12.1471Z" fill="#272727"/>';
iconSuggestions += '<path d="M14.0368 3.94261C13.6296 3.94261 13.2998 3.68665 13.2998 3.36905V1.07356C13.2998 0.757221 13.6296 0.5 14.0368 0.5C14.4439 0.5 14.7721 0.757221 14.7721 1.07356V3.36842C14.7721 3.68602 14.4439 3.94261 14.0368 3.94261Z" fill="#272727"/>';
iconSuggestions += '<path d="M23.8164 18.8124C23.6294 18.8124 23.4415 18.7565 23.2972 18.6439L21.2177 17.0213C20.9307 16.7981 20.9307 16.4339 21.2177 16.2094C21.5056 15.9855 21.9708 15.9868 22.2579 16.2107L24.3373 17.8326C24.6251 18.0571 24.6251 18.4213 24.3373 18.6451C24.1938 18.7577 24.0067 18.8124 23.8164 18.8124Z" fill="#272727"/>';
iconSuggestions += '<path d="M6.31459 6.77094C6.12753 6.77094 5.93886 6.71497 5.79372 6.6024L3.71589 4.98109C3.42804 4.75657 3.42804 4.39243 3.71589 4.16792C4.00374 3.94403 4.46897 3.94403 4.75601 4.16792L6.83546 5.78986C7.12331 6.01374 7.12331 6.37851 6.83546 6.6024C6.69194 6.71497 6.50407 6.77094 6.31459 6.77094Z" fill="#272727"/>';
iconSuggestions += '<path d="M4.18078 18.8123C3.99291 18.8123 3.80504 18.7576 3.66071 18.645C3.37286 18.4211 3.37286 18.057 3.66071 17.8325L5.74177 16.2093C6.0272 15.9854 6.49244 15.9854 6.78029 16.2093C7.06814 16.4338 7.06814 16.798 6.78029 17.0225L4.70084 18.645C4.55651 18.757 4.36945 18.8123 4.18078 18.8123Z" fill="#272727"/>';
iconSuggestions += '<path d="M21.2349 6.77031C21.0471 6.77031 20.8592 6.71434 20.7141 6.60177C20.4286 6.37788 20.4286 6.01437 20.7141 5.79048L22.7935 4.16855C23.079 3.94466 23.5474 3.9434 23.8337 4.16729C24.1215 4.39181 24.1215 4.75468 23.8337 4.9792L21.7558 6.60051C21.6123 6.71308 21.4244 6.77031 21.2349 6.77031Z" fill="#272727"/></svg>';

function updateInfoGoalOptimization(conflictWithGoal){
    var conflictWithGoalbyRule = {};
    conflictWithGoal.forEach((oggetto, indice) => {
        var { rule } = oggetto;
        if (!conflictWithGoalbyRule[rule]) {
            conflictWithGoalbyRule[rule] = {};
        }
        conflictWithGoalbyRule[rule][indice] = oggetto;
    });
      
    var text = "";
    var textGoal = userGoal;
    if(userGoal === "wellbeing"){
        textGoal = "Well Being";
    }
    if(userGoal === "energysaving"){
        textGoal = "Energy Saving";
    }
    
    $infoRules.append('<div class="infoTitle">'+iconSuggestions+'<span id="titleInfo"> Suggestions For Your Goal "'+textGoal.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })+'": </span></div><div class="infoSuggestions whyInfo"></div>');

    for (var rule in conflictWithGoalbyRule) {
        var nameRule = rule; 
        text += "<div id='infoSugg_"+nameRule+"'>";
        text += "<p><span class='material-symbols-rounded ruleClose expandeRuleSugg' id='expande_"+nameRule+"'>expand_more</span> ";
        text += "<span id='nameRuleSugg_"+nameRule+"' class='ruleNameSuggGoal'><i>"+nameRule + "</i></span></p><div id='whyConflict_"+nameRule+"'>";
        
        for (const index in conflictWithGoalbyRule[rule]) {
            var conflict = conflictWithGoalbyRule[rule][index];
            if(conflict.whyText !== undefined) { 
                var parentName = conflict.parent.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                if (parentName === "Livingroom"){
                    parentName = "Living Room";
                }
                text += "<p class='parentRule'>&emsp;<span class='material-symbols-rounded parentClose expandeParentSugg' id='expande_parent_"+conflict.parent+"_"+conflict.rule+"'>expand_more</span> ";
                text += "<span id='nameParentSugg_"+conflict.parent+"_"+conflict.rule+"' class='ruleNameSuggGoal'><i>"+parentName+ "</i></span></p><div class='whyConflictParent' id='whyConflictParent_"+conflict.parent+"_"+conflict.rule+"'>";

                text += "<p id='suggText_"+conflict.rule+"_"+conflict.parent+"' class='whyConflictWithGoal whyText_"+conflict.rule+"'>"+conflict.whyText+".</p>";

                text += "<ul class='whyConflictWithGoal suggestions_"+conflict.rule+"'>"+conflict.suggestions+"</ul>";
                text += "</div>";
                
            }
        }
        text += "</div>";
    }
    
    $infoRules.find('.infoSuggestions').append(text);   

    $(' [id^="whyConflictParent_"]').hide();
    $(' [id^="whyConflict_"]').hide();
    
    $('.expandeRuleSugg').on('click', function () {
        var id = $(this).attr('id');
        var idRule = id.match(/_(.+)/)[1];
        if($(this).attr('class').includes('ruleClose')===true){
            $('#whyConflict_'+idRule).show();
            $(this).removeClass("ruleClose").addClass("ruleOpen");
            $('#nameRuleSugg_' + idRule).css('font-weight', '800');  
            $(".infoSuggestions span.expandeRuleSugg:not(#"+id+")").each(function() {
                var idRule2 = $(this).attr('id');
                var idRuleToHide = idRule2.match(/_(.+)/)[1];
                $('#nameRuleSugg_' + idRuleToHide).css('font-weight', 'normal');
                $('#whyConflict_'+idRuleToHide).hide();
                $(this).removeClass("ruleOpen").addClass("ruleClose");
                 
                $(".whyConflictParent:not([id*='"+idRule+"'])").hide();
                $(".ruleNameSuggGoal:not([id*='"+idRule+"'])").css('font-weight', 'normal');

            });
        }  
        else{       
            $('#whyConflict_'+idRule).hide();
            $(this).removeClass("ruleOpen").addClass("ruleClose");
            $('#nameRuleSugg_' + idRule).css('font-weight', 'normal');
        } 
        
        var cont = 0;
        $('.expandeParentSugg').on('click', function () {
            cont++;
            if(cont === 1){
                var id = $(this).attr('id');
                var idName = id.split("expande_parent_")[1];
                var parent = idName.split('_')[0];
                var ruleName = idName.split('_').slice(1).join('_');
                if($(this).attr('class').includes('parentClose')===true){
                    $('#whyConflictParent_'+parent+"_"+ruleName).show();
                    $(this).removeClass("parentClose").addClass("parentOpen");
                    $('#nameParentSugg_' + parent+"_"+ruleName).css('font-weight', '800');
                }  
                 else{       
                    $('#whyConflictParent_'+parent+"_"+ruleName).hide(); 
                    $(this).removeClass("parentOpen").addClass("parentClose");
                    $('#nameParentSugg_' + parent+"_"+ruleName).css('font-weight', 'normal');
                } 
            }      
        });  
    });
}

$('#helpSuggGoalOptimization').on('click', function () {
    var textHelp = "<p id='text_goalOpt'>Choose a goal to receive personalized suggestions to improve your rules based on your choice.</p>";
    if($(this).attr('class').includes('closeHelp')===true){
        $('#overlapHelpOptim').show();
        $(this).removeClass("closeHelp").addClass("openHelp"); 
        $('#textHelpOptim').append(textHelp);
   }  
    else{       
        $('#text_goalOpt').remove();
        $('#overlapHelpOptim').hide();
        $(this).removeClass("openHelp").addClass("closeHelp");
    } 
});


function negativeGoalsForAction(realName, parent, operator) {
    var negativeGoalsList;
    semantic.action.forEach(function(azione){
      if(azione.realName !== "Devices"){        //TODO: cerca una soluzione migliore
        azione.nodes.forEach(function(nodo){
           if(nodo.realName === parent){ 
              if(nodo.attributes !== undefined){ 
                  nodo.attributes.forEach(function(attributo){
                     if(attributo.realName === realName){
                        attributo.possibleValues.forEach(function(valore){
                            if(valore.value.toLowerCase() === operator){
                               negativeGoalsList = valore.hasNegativeEffectOnGoals;
                            }
                        });
                     }
                  });
              }
          }
        });
      }
      else {
          azione.nodes.forEach(function(nodo){
            if(nodo.realName === realName){
                nodo.possibleValues.forEach(function(valore){
                    if(valore.value.toLowerCase() === operator){
                       negativeGoalsList = valore.hasNegativeEffectOnGoals;
                    }
               });
            }
          });
       }
    });
    return negativeGoalsList;
}

function getIncreaseEnvironmentVariables(realName, parent, operator) {
    var environmentVariables = new Array();
    semantic.action.forEach(function(azione){
        if(azione.realName !== "Devices"){        //TODO: cerca una soluzione migliore
            azione.nodes.forEach(function(nodo){
               if(nodo.realName.toLowerCase() === parent){
                 nodo.attributes.forEach(function(attributo){
                    if(attributo.realName === realName){
                       attributo.possibleValues.forEach(function(valore){
                           if(valore.value.toLowerCase() === operator){
                               valore.confidentlyIncreaseEnvironmentVariables.forEach(function(val){
                                   environmentVariables.push(val);
                               });
                               valore.canIncreaseEnvironmentVariables.forEach(function(val){
                                   environmentVariables.push(val);
                               });     
                           }
                       });
                    }
                 });
               }
            });
        }
        else {
            azione.nodes.forEach(function(nodo){
            if(nodo.realName === realName){
                nodo.possibleValues.forEach(function(valore){
                    if(valore.value.toLowerCase() === operator){
                       environmentVariables = valore.confidentlyIncreaseEnvironmentVariables;
                       valore.canIncreaseEnvironmentVariables.forEach(function(variabile){
                           environmentVariables.push(variabile);
                       });
                    }
               });
            }
          });
        }
    });
    return environmentVariables;
}

function getDecreaseEnvironmentVariables(realName, parent, operator) {
    var environmentVariables = new Array();
    semantic.action.forEach(function(azione){
        if(azione.realName !== "Devices"){        //TODO: cerca una soluzione migliore
            azione.nodes.forEach(function(nodo){
               if(nodo.realName.toLowerCase() === parent){
                 nodo.attributes.forEach(function(attributo){
                    if(attributo.realName === realName){
                       attributo.possibleValues.forEach(function(valore){
                           if(valore.value.toLowerCase() === operator){
                               valore.confidentlyDecreaseEnvironmentVariables.forEach(function(val){
                                   environmentVariables.push(val);
                               });
                               valore.canDecreaseEnvironmentVariables.forEach(function(val){
                                   environmentVariables.push(val);
                               });  
                           }
                       });
                    }
                 });
               }
            });
        }
        else {
            azione.nodes.forEach(function(nodo){
            if(nodo.realName === realName){
                nodo.possibleValues.forEach(function(valore){
                    if(valore.value.toLowerCase() === operator){
                       environmentVariables = valore.confidentlyDecreaseEnvironmentVariables;
                       valore.canDecreaseEnvironmentVariables.forEach(function(variabile){
                           environmentVariables.push(variabile);
                       });
                    }
               });
            }
          });
        }
    });
    return environmentVariables;
}

function getalternativeAction(parent, increaseEnvironmentVariables, decreaseEnvironmentVariables, variablesNotInvolved, actionRule, operatorRule){
    var text = '';
    semantic.action.forEach(function(azione){
        if(azione.realName !== "Devices"){
            azione.nodes.forEach(function(nodo){
               if(nodo.realName.toLowerCase() === parent || nodo.realName === "Home"){
                   nodo.attributes.forEach(function(attributo){
                       attributo.possibleValues.forEach(function(valore){
                          var nameAttribute = attributo.realName.replace("allWindow", "window");
                          nameAttribute = attributo.realName.replace("allLight", "light");
                          if(operatorRule !== valore.value.toLowerCase() && !actionRule.toLowerCase().includes(nameAttribute) && increaseEnvironmentVariables !== undefined){
                            var commonIncreaseEnvironmentVariables = valore.confidentlyIncreaseEnvironmentVariables.filter(value => increaseEnvironmentVariables.includes(value));
                            if(commonIncreaseEnvironmentVariables.length === 0){
                                commonIncreaseEnvironmentVariables = valore.canIncreaseEnvironmentVariables.filter(value => increaseEnvironmentVariables.includes(value));
                            }
                            if(commonIncreaseEnvironmentVariables.length > 0){ 
                                valore.hasPositiveEffectOnGoals.forEach(function(goal){
                                    if(goal.goal.replace(/\s/g, '').replace(/-/g, '') === userGoal && increaseEnvironmentVariables.includes(goal.environment_variable) && !variablesNotInvolved.includes(goal.environment_variable)){
                                          var state;
                                          var nameDevice;
                                          var room = parent.toLowerCase();
                                          if (valore.value.toLowerCase() === "on" || valore.value.toLowerCase() === "off"){
                                              state = valore.value.toUpperCase();
                                          }  
                                          else {
                                              state = valore.value.toLowerCase();
                                          }
                                          if (attributo.displayedName.includes("all")){
                                              nameDevice = attributo.displayedName;
                                              room = "house";
                                          }
                                          else {
                                              nameDevice = "the " + attributo.displayedName;
                                          }
                                          var alternative ="";
                                          if (text.includes(state) && text.includes(nameDevice)){
                                              if(!text.includes(goal.description.toLowerCase())){
                                                text = text.replace("</li>", "");
                                                text += "and " +goal.description.toLowerCase() +"</li>";
                                              }
                                          }
                                          else {
                                              alternative = "<li id='"+nameDevice.replace(/\s/g, '')+"_"+state+"_alt'>set on <strong>"+state+" "+ nameDevice +"</strong> in the <strong>"+ room +"</strong> because "+goal.description.toLowerCase()+"</li>";
                              
                                          }
                                          if(!text.includes(alternative) && !text.includes(+goal.description.toLowerCase())){
                                                text += alternative;
                                                //text += " ----- <b style='color:blue;'>"+goal.environment_variable+"</b>";
                                           }
                                    }
                                });
                            }                 
                  
                            var commonDecreaseEnvironmentVariables = valore.confidentlyDecreaseEnvironmentVariables.filter(value => decreaseEnvironmentVariables.includes(value));
                            if(commonDecreaseEnvironmentVariables.length === 0){
                                commonDecreaseEnvironmentVariables = valore.canDecreaseEnvironmentVariables.filter(value => decreaseEnvironmentVariables.includes(value));
                            }
                            if(commonDecreaseEnvironmentVariables.length > 0){ 
                                valore.hasPositiveEffectOnGoals.forEach(function(goal){
                                    if(goal.goal.replace(/\s/g, '').replace(/-/g, '') === userGoal && decreaseEnvironmentVariables.includes(goal.environment_variable) && !variablesNotInvolved.includes(goal.environment_variable)){
                                        var state;
                                        var nameDevice;
                                        var room = parent.toLowerCase();
                                        if (valore.value.toLowerCase() === "on" || valore.value.toLowerCase() === "off"){
                                            state = valore.value.toUpperCase();
                                        }  
                                        else {
                                            state = valore.value.toLowerCase();
                                        }
                                        if (attributo.displayedName.includes("all")){
                                            nameDevice = attributo.displayedName;
                                            room = "house";
                                        }
                                        else {
                                            nameDevice = "the " + attributo.displayedName;
                                        }
                                        var alternative ="";  
                                        if (text.includes(state) && text.includes(nameDevice)){
                                              if(!text.includes(goal.description.toLowerCase())){
                                                text = text.replace("</li>", "");
                                                text += "and " +goal.description.toLowerCase() +"</li>";
                                              }
                                          }
                                        else {
                                            alternative = "<li id='"+nameDevice.replace(/\s/g, '')+"_"+state+"_alt'>set on <strong>"+state+" "+ nameDevice +"</strong> in the <strong>"+ room +"</strong> because "+goal.description.toLowerCase()+"</li>";  
                                        }
                                        if(!text.includes(alternative) && !text.includes(goal.description.toLowerCase())){
                                              text += alternative;
                                              //text += " ----- <b style='color:blue;'>"+goal.environment_variable+"</b>";;
                                        }
                                    }
                                });
                            }
                        }
                       });
                   });
               }
           });
      }
      else {
          azione.nodes.forEach(function(nodo){
            var currentNode = nodo.realName;
            nodo.possibleValues.forEach(function(valore){
                if(increaseEnvironmentVariables !== undefined){
                    var commonIncreaseEnvironmentVariables = valore.confidentlyIncreaseEnvironmentVariables.filter(value => increaseEnvironmentVariables.includes(value));
                    if(commonIncreaseEnvironmentVariables.length === 0){
                        commonIncreaseEnvironmentVariables = valore.canIncreaseEnvironmentVariables.filter(value => increaseEnvironmentVariables.includes(value));
                    }
                    if(commonIncreaseEnvironmentVariables.length > 0){ 
                        valore.hasPositiveEffectOnGoals.forEach(function(goal){
                            if(goal.goal.replace(/\s/g, '').replace(/-/g, '') === userGoal && increaseEnvironmentVariables.includes(goal.environment_variable) && !variablesNotInvolved.includes(goal.environment_variable)){
                                text += "<li>use the <strong>"+currentNode+"</strong> set on <strong>"+valore.value.toLowerCase()+"</strong> because "+goal.description.toLowerCase()+"</li>";
                            }
                        });
                    } 

                    var commonDecreaseEnvironmentVariables = valore.confidentlyDecreaseEnvironmentVariables.filter(value => decreaseEnvironmentVariables.includes(value));
                    if(commonDecreaseEnvironmentVariables.length === 0){
                        commonDecreaseEnvironmentVariables = valore.canDecreaseEnvironmentVariables.filter(value => decreaseEnvironmentVariables.includes(value));
                    }
                    if(commonDecreaseEnvironmentVariables.length > 0){ 
                        valore.hasPositiveEffectOnGoals.forEach(function(goal){
                            if(goal.goal.replace(/\s/g, '').replace(/-/g, '') === userGoal && decreaseEnvironmentVariables.includes(goal.environment_variable) && !variablesNotInvolved.includes(goal.environment_variable)){
                                text += "<li>use the <strong>"+currentNode+"</strong> set on <strong>"+valore.value.toLowerCase()+"</strong> because "+goal.description.toLowerCase()+"</li>";
                            }
                        });
                    } 
                }
           });
          });
      }
    });
    return text;
}

function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
}

function getTreeNode(node, dimension) { 
    var tmp = {
        text: node.displayedName,
        state: {
            checked: false,
            disabled: false,
            expanded: false,
            selected: false
        },
        nodes: []
    };
    
    if (node.nodes !== undefined) {
        for (var i = 0; i < node.nodes.length; i++) { 
            
            var tmpNode = getTreeNode(node.nodes[i], dimension);

            if (tmpNode.state.expanded) {
                tmpNode.text = "<span class=\"labelTree labelTreeSelected\">" + tmpNode.text+ "</span>";
                tmp.text = "<span class=\"labelTree labelTreeSelected\">" + tmp.text +"</span>";
                tmp.backColor = "#EBE9E9";
                tmp.state.expanded = true;
                tmp.nodes.push(tmpNode);
                
            }
       }
     }
    if ($.inArray(node.displayedName.replace(/\s/g, "").toLowerCase(), involvedCtxParent) > -1 || $.inArray(node.realName.replace(/\s/g, "").toLowerCase(), involvedCtxParent) > -1 || ($.inArray((node.displayedName.replace(/\s/g, "") + "_" +(node.attributes ? node.attributes[0].xPath.replace(/^.*\/([^/]+)\/.*$/, "$1") : "")).toLowerCase(),involvedCtxParent) > -1) || $.inArray(node.displayedName.replace(/\s/g, "").toLowerCase() + "_" + (node.room ? node.room.toLowerCase() : ""),involvedCtxParent) > -1) {
        if (node.attributes !== undefined) {
            for (var j = 0; j < node.attributes.length; j++) {
                var tmpAttr = getTreeAttribute(node.attributes[j], dimension, node);
                //attributeChangesTo(node.attributes[j]);

                if (tmpAttr.isExpanded) {
                    tmp.backColor = "#F5F5F5";
                    tmp.state.expanded = true;
                    tmp.text = "<span class=\"labelTree labelTreeSelected\">" + tmp.text +"</span>";
                    tmp.nodes.push(tmpAttr);
                }
            }
        }
    }
 
    return tmp;
 
}

function getTreeAttribute(attribute, dimension, node) {
    var val = "";
    var isEnum = false;
    var isInit = false;
    var event = "";
    var id = (node.realName + "_" + attribute.realName + "_" + dimension).toLowerCase();
    if(node.room !== undefined){
        id = (node.room.toLowerCase() + "_" + id).replace(/\s+/g, '');
    }
    event += "<div class='inputTriggerBox' id='"+id+"'>";

    switch (attribute.type) {
        case "xs:boolean" :
        case "custom:boolean" :
            isEnum = true;
            val = ' <option></option><option>false</option><option>true</option>';
            break;
        case "custom:int":
        case "xs:int":
            isInit = true;
            break;
         case "INTEGER":
            isInit = true;
            break;
        case "STRING":
            break;
        case "xs:string":
        case "custom:string":
            break;
            //case attribute.type.substring(0, 3) === 'tns:':
        case "TIME":
            break;
        case "DATE":
            break;
        case "BOOLEAN" :
            isEnum = true;
            val = '<option>true</option><option>false</option>';
            break;
        case "DOUBLE":
            isInit = true;
            break;
        default:
            isEnum = true;
            
            for (var chiave in attribute.possibleValues) {
                
                val += '<option>' + attribute.possibleValues[chiave] + '</option>';
                /*if(attribute.possibleValues[chiave] > 2) {
                 val += '<option>' + attribute.possibleValues[chiave] + '</option>';
                 } else {
                 val += '<label class="radio-inline"><input id=' + attribute.realName + ' type=\"radio\" name="optradio">' + attribute.possibleValues[chiave] + '</label>';
                 }*/
            }
    }
   
    var newId = attribute.realName.replace(new RegExp(" " , 'g'), "_") + '-'+ dimension;
   

    if (attribute.triggerType !== undefined) {
        if (true) {
            var idInput = (attribute.realName + "-"+ node.realName).replace(new RegExp(" ", 'g'), "_").toLowerCase();
            // modifiche chi event += "<form><div class='radioGroup' id='" + newId + "_changesTo'><label class='radio-inline "+attribute.realName+"_is' for='"+attribute.realName+"_is'><input id='"+attribute.realName+"_is' class='radio active' checked='checked' type='radio' name='"+attribute.realName+"' onclick='updateEvent(\"changeEventConditionSimulator\", \""+attribute.realName+"\", \"condition\")' value='is'/><img src='/AuthoringTool/resources/img/iconB.png' style='width: 40%;'/>" + (getSimulatorMsgLocale('Is')).toUpperCase() +"</label><label class='radio-inline "+attribute.realName+"_becomes' for='"+attribute.realName+"_becomes'><input id='"+attribute.realName+"_becomes' class='radio' type='radio' name='"+attribute.realName+"' onclick='updateEvent(\"changeEventConditionSimulator\", \""+attribute.realName+"\", \"event\")' value='becomes' /><img src='/AuthoringTool/resources/img/logoIS.png' style='width: 30%; margin-bottom: -5px; float:left'/><div class=\"evtLabel\"> "+ (getSimulatorMsgLocale('Becomes')).toUpperCase() +"</div></label></div></form>";
            event += "<form>";
            event += "<div class='radioGroup' id='" + idInput + "_changesTo'>";
            event += "<label class='radioLabel radio-inline " + idInput + "_is' for='"  + idInput + "_is'>";
            event += "<input id='"+ idInput + "_is' class='radio active' checked='checked' type='radio' name='"+ idInput + "' onclick='updateEvent(\"changeEventConditionSimulator\", \"" + idInput + "\", \"condition\")' value='is'/>";
            event += "<img src='/AuthoringTool/resources/img/iconB.png' style='width: 30%;'/>" + getSimulatorMsgLocale('Is') + "</label>";
            event += "<label class='radioLabel radio-inline " + idInput + "_becomes' for='"  + idInput + "_becomes'>";
            event += "<input id='" + idInput + "_becomes' class='radio' type='radio' name='" + idInput + "' onclick='updateEvent(\"changeEventConditionSimulator\", \"" + idInput + "\", \"event\")' value='becomes' />";
            event += "<img src='/AuthoringTool/resources/img/logoIS.png' style='width: 30%; margin-left:2%'/> " + getSimulatorMsgLocale('Becomes') + "</label>";
            event += "</div>";
            event += "</form>";
        } else {
            event += '<div class="radioGroup" ><label style=\"width:17%;\"><input type="checkbox" style=\"margin-left:10px; margin-right:10px;\" id="checkboxSuccess" value="option1">Is Event</label><7div>';
        }
    } else {
        event += "<div class='radioGroup'></div>";
    }

    var newId = (attribute.realName.replace(new RegExp(" " , 'g'), "_") + '-'+ node.realName +'-'+ dimension).toLowerCase();
    
    var input = "<input id='" + newId + "' type=\"text\" placeholder='String' class=\"textAttribute form-control inputTrigger\"  style=\"display:inline-block;\" value=\"" + val + "\" onchange='updateEvent(\"changeSimulatorValue\", \""+newId+"\", this.value)'>";

    if (isInit === true) {
        input = "<input id='" + newId + "' type=\"number\" placeholder='Number' class=\"textAttribute form-control inputTrigger\"  style=\"display:inline-block;\" value=\"" + val + "\" onchange='updateEvent(\"changeSimulatorValue\", \""+newId+"\", this.value)'>";
    }

    if (isEnum) {
        input = "<select id='" + newId + "'  onchange='updateEvent(\"changeSimulatorValue\", \""+newId+"\", this.value)' class=\"form-control inputTrigger\" style=\"display:inline-block;\"><option></option>" + val + "</select>";
    }
    var attr = {
        text: "<span class=\"labelTree\">" + attribute.displayedName + "</span>" + event + input,
        icon: "glyphicon glyphicon-stop",
        state: {
            checked: false,
            disabled: false,
            expanded: false,
            selected: false
        }
        
    };
    if (attribute.originaltype !== undefined && $.inArray(attribute.originaltype, involvedCtxEntities) > -1) {        
        attr.text = "<span class=\"labelTree labelTreeSelected\">" + attribute.displayedName + "</span>" + event + input;
        attr.isExpanded = true;
        attr.icon = "glyphicon glyphicon-ok";
        attr.backColor = "#fff";
        attr.selectable = false;
    }else if ($.inArray(attribute.xPath +"_"+node.displayedName.replace(/\s/g, "").toLowerCase(), involvedCtxEntities) > -1 || $.inArray(attribute.xPath +"_"+node.realName.replace(/\s/g, "").toLowerCase(), involvedCtxEntities) > -1 || ($.inArray((attribute.xPath +"_"+node.displayedName.replace(/\s/g, "").toLowerCase()+"_"+attribute.xPath.replace(/^.*\/([^/]+)\/.*$/, "$1")).toLowerCase(),involvedCtxEntities) > -1) || $.inArray((attribute.xPath +"_"+node.displayedName.replace(/\s/g, "")+"_"+(node.room ? node.room.toLowerCase() : "")).toLowerCase(), involvedCtxEntities) > -1){
        attr.text = "<span class=\"labelTree labelTreeSelected\">" + attribute.displayedName + "</span>" + event + input;
        attr.isExpanded = true;
        attr.icon = "glyphicon glyphicon-ok";
        attr.backColor = "#fff";
        attr.selectable = false;
    } else if (attribute.type !== undefined && $.inArray(attribute.type, involvedCtxEntities) > -1) {
        attr.text = "<span class=\"labelTree labelTreeSelected\">" + attribute.displayedName + "</span>" + event + input;
        attr.isExpanded = true;
        attr.icon = "glyphicon glyphicon-ok";
        attr.backColor = "#CCFF99";
        attr.selectable = false;
    }

    return attr;

}

function analyzeRules(arrayRules) {   
    if (arrayRules === undefined)
        return;
    for (var i = 0; i < arrayRules.length; i++) {
        for (var j = 0; j < arrayRules[i].triggers.length; j++) {
            //dimensions
            if ($.inArray(arrayRules[i].triggers[j].dimension, involvedCtxDimensions) < 0){
                involvedCtxDimensions.push(arrayRules[i].triggers[j].dimension);
            }
            //parent / location
            if ($.inArray(arrayRules[i].triggers[j].parent, involvedCtxParent) < 0){
                involvedCtxParent.push(arrayRules[i].triggers[j].parent.toLowerCase());
            }
            if(arrayRules[i].triggers[j].element.xPath === undefined){
                continue;
            }
            if (arrayRules[i].triggers[j].element.originaltype !== undefined) {
                if ($.inArray(arrayRules[i].triggers[j].element.originaltype, involvedCtxEntities) < 0) {
                    involvedCtxEntities.push(arrayRules[i].triggers[j].element.originaltype);
                    //todo: mettere valore corrent
                    //involvedCtxEntities.push();
                }
            } 
            else if (arrayRules[i].triggers[j].element.xPath !== undefined &&
                    arrayRules[i].triggers[j].element.xPath !== null) {
                if ($.inArray(arrayRules[i].triggers[j].element.xPath, involvedCtxEntities) < 0) {      
                        var involvedEntities = arrayRules[i].triggers[j].element.xPath + "_"+arrayRules[i].triggers[j].parent.toLowerCase();
                        involvedCtxEntities.push(involvedEntities);                    
                }
            }
            else {
//                if ($.inArray(rules[i].triggers[j].element.type, involvedCtxEntities) < 0)
//                    involvedCtxEntities.push(rules[i].triggers[j].element.type);
            }
        }        
        listAppliancesActions(arrayRules[i], appliancesActionList, rules);        
        listUiModificationActions(arrayRules[i], uiModificationActionList);        
    }    
}

function loadProfileConfigurationFiles() {
    var token = $("#logoutForm > input").val();
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        url: 'rest/simulator/getFileList',
        success: function (response)
        {
            $('#selectConf > option').remove();
            for (var i = 0; i < response.length; i++) {
                $('#selectConf')
                        .append($("<option></option>")
                                .attr("value", response[i])
                                .text(response[i]));
            }
        }

    });
}

function getUIModificationConflict() {
    return;
    var token = $("#logoutForm > input").val();
    $.ajax({
        type: "POST",
        headers: {            
            'X-CSRF-TOKEN': token
        },
        url: 'rest/simulator/loadDom',
        data : encodeURI("http://giove.isti.cnr.it/users/manca/jquery-test/index.html"),
        success: function (response) {
            console.log(response);
        }, 
        error : function(err) {
            console.log(err);
        }
    });
}  

window.selectAllruleSimulate =function (e) {
    var checkState = $(e).is(':checked');

    if (checkState) {
        //scorro tutti i checkbox delle regole se sono deselezionati deleziono
        $('.ruleCheckBox').each(function () {
            if (!$(this).is(':checked')) {
                $(this).prop('checked', true);
            }
        });
    } else {
        //scorro tutti i checkbox delle regole se sono selezionati deseleziono
        $('.ruleCheckBox').each(function () {
            if ($(this).is(':checked')) {
                $(this).prop('checked', false);
            }
        });
    }
};

function ruleMatch(rule, objNotVer) {
    //var triggerVerifiedAction =  new Array();

    for (var i = 0; i < rule.triggers.length; i++) {
       
        ruleTriggerName = rule.triggers[i].element.realName.replace(new RegExp(" " , 'g'), "_");
        ruleTriggerParent = rule.triggers[i].parent;
        ruleTriggerValue = rule.triggers[i].value.replace(new RegExp(" " , 'g'), "_");
        ruleTriggerOperator = rule.triggers[i].operator;
        ruleTriggerNextOperator = rule.triggers[i].nextOperator;
        dimension = rule.triggers[i].dimension;
        formTriggerName = ruleTriggerName;
        var id = (ruleTriggerName + '-' +  ruleTriggerParent + '-' + dimension).toLowerCase().replace(/_\w+/, '');
        var index;
        var textAction;
        var isRuleChainArray = false;

        formTriggerValue = $("#" + id).val() || 0;
        var isRuleChain = $("#" + id).hasClass('ruleChain');
        if(isRuleChain){
            var classe = $("#" + id).attr('class');
            var match = classe.match(/-(\d+)/);
            index = match[1];
        }
        if($("[class*='ruleChain:'][id='"+id+"']").length > 0){
            arrayIndex = $("[class*='ruleChain:'][id='"+id+"']").attr("class").split(" ").filter(value => value.includes('ruleChain:')).map(value => value.replace(/ruleChain:.*-(.*)/, '$1'));
            isRuleChainArray = true;
            isRuleChain = false;
            var newClass = $("[class*='ruleChain:'][id='"+id+"']").attr('class').replace(/\bruleChain:[^ ]+\b/g, '');
            $("[class*='ruleChain:'][id='"+id+"']").attr('class', newClass);
        }        
        
        if (ruleTriggerOperator === "equal") { // se il triger della regola non Ã¨ composto

            if (formTriggerName === ruleTriggerName) {

                if((typeof formTriggerValue) === "string" && (typeof  ruleTriggerValue) === "string") {
                    if (formTriggerValue.toLowerCase() === ruleTriggerValue.toLowerCase()) {
                        var indiceVirgola = rule.naturalLanguage.indexOf(",");
                        if (i > 0) {
                            triggerVerified = evalTrigger(triggerVerified, true, rule.triggers[i - 1].nextOperator);
                            objNotVer.VerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                        } else {
                            if(isRuleChain){
                                var triggers = new Array();
                                var textTrigger = rule.naturalLanguage.substring(0, indiceVirgola).trim(); 
                                var textActionActivated = "";
                                rule.actions.forEach(function (action, i){
                                    var value = "";
                                    if (action.operator === "is" || action.operator === "turnOn"){
                                        value = "is <b>on</b>";
                                    }
                                    else if (action.operator === "turnOff"){
                                        value = "is <b>off</b>";
                                    }
                                    else if (action.operator === "open"){
                                        value = "is <b>open</b>";
                                    }
                                    else if (action.operator === "close"){
                                        value = "is <b>close</b>";
                                    }
                                    if (i>0){
                                        textActionActivated += " and <b>"+action.action.displayedName.toLowerCase() + "</b> " + value;
                                    } else {
                                        textActionActivated += "<b>"+action.action.displayedName.toLowerCase() + "</b> " + value;
                                    }
                                });
                                if(actionUpdateContextUse[index].triggers){
                                    var exists = actionUpdateContextUse[index].triggers.some(item => item.triggeredRuleName === rule.ruleName);
                                    if (!exists) {
                                        actionUpdateContextUse[index].triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, textActionActivated: textActionActivated, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                    }
                                }
                                else {
                                    triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, textActionActivated: textActionActivated, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                    actionUpdateContextUse[index].triggers = triggers;
                                }
                            }
                            if (isRuleChainArray){
                                var indiceVirgola = rule.naturalLanguage.indexOf(",");
                                arrayIndex.forEach(function (key){
                                    var triggers = new Array();
                                    var textTrigger = rule.naturalLanguage.substring(0, indiceVirgola).trim();
                                    var textActionActivated = "";
                                    rule.actions.forEach(function (action, i){
                                        var value = "";
                                        if (action.operator === "is" || action.operator === "turnOn"){
                                            value = "is <b>on</b>";
                                        }
                                        else if (action.operator === "turnOff"){
                                            value = "is <b>off</b>";
                                        }
                                        else if (action.operator === "open"){
                                            value = "is <b>open</b>";
                                        }
                                        else if (action.operator === "close"){
                                            value = "is <b>close</b>";
                                        }
                                        if (i>0){
                                            textActionActivated += " and <b>"+action.action.displayedName.toLowerCase() + "</b> " + value;
                                        } else {
                                            textActionActivated += "<b>"+action.action.displayedName.toLowerCase() + "</b> " + value;
                                        }
                                    });
                                    if(actionUpdateContextUse[key].triggers){
                                        var exists = actionUpdateContextUse[key].triggers.some(item => item.triggeredRuleName === rule.ruleName);
                                        if (!exists) {
                                            actionUpdateContextUse[key].triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, textActionActivated: textActionActivated, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                        } 
                                    } 
                                    else {
                                        triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, textActionActivated: textActionActivated, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                        actionUpdateContextUse[key].triggers = triggers;
                                    }
                                });
                            }
                            triggerVerified = true;
                            rule.actions.forEach(action => triggerVerifiedAction.push(action));
                            textAction = rule.naturalLanguage.substring(indiceVirgola + 1).trim();
                            actionUpdateContextUse.push({action: rule.actions, actionRuleName:rule.ruleName, textAction: textAction});
                            objNotVer.VerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});      
                        }
                    } else {
                        triggerVerified = false;
                        objNotVer.notVerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref:id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                    }                        
                } else if (formTriggerValue === ruleTriggerValue) {
                    if (i > 0) {
                        triggerVerified = evalTrigger(triggerVerified, true, rule.triggers[i - 1].nextOperator);
                        objNotVer.VerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                    } else {
                        triggerVerified = true;
                        objNotVer.VerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                        
           
                    }
                } else {

                    if (i > 0) {
                        triggerVerified = evalTrigger(triggerVerified, false, rule.triggers[i - 1].nextOperator);

                        objNotVer.notVerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                    } else {

                        triggerVerified = false;
                        objNotVer.notVerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                    }
                }
            }

        } else if (ruleTriggerOperator === "more" || ruleTriggerOperator === "gt") {

            if (parseInt(formTriggerValue) > 0) {


                if (formTriggerName === ruleTriggerName) {

                    if (parseInt(formTriggerValue) > parseInt(ruleTriggerValue)) {



                        if (i > 0) {

                            triggerVerified = evalTrigger(triggerVerified, true, rule.triggers[i - 1].nextOperator);
                            objNotVer.VerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType});

                        } else {
                            if(isRuleChain){
                                var triggers = new Array();
                                var textTrigger = rule.naturalLanguage.substring(0, indiceVirgola).trim(); 
                                if(actionUpdateContextUse[index].triggers){
                                    var exists = actionUpdateContextUse[index].triggers.some(item => item.triggeredRuleName === rule.ruleName);
                                    if (!exists) {
                                        actionUpdateContextUse[index].triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                    }
                                }
                                else {
                                    triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                    actionUpdateContextUse[index].triggers = triggers;
                                }
                            }
                            if (isRuleChainArray){
                                var indiceVirgola = rule.naturalLanguage.indexOf(",");
                                arrayIndex.forEach(function (key){
                                    var triggers = new Array();
                                    var textTrigger = rule.naturalLanguage.substring(0, indiceVirgola).trim();
                                    if(actionUpdateContextUse[key].triggers){
                                        var exists = actionUpdateContextUse[key].triggers.some(item => item.triggeredRuleName === rule.ruleName);
                                        if (!exists) {
                                            actionUpdateContextUse[key].triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                        } 
                                    } 
                                    else {
                                        triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                        actionUpdateContextUse[key].triggers = triggers;
                                    }
                                });
                            }
                            triggerVerified = true;
                            rule.actions.forEach(action => triggerVerifiedAction.push(action));
                            textAction = rule.naturalLanguage.substring(indiceVirgola + 1).trim();
                            actionUpdateContextUse.push({action: rule.actions, actionRuleName:rule.ruleName, textAction: textAction});
                            objNotVer.VerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});      
                                
                        }
                        // break;
                   } else {

                        if (i > 0) {
                            triggerVerified = evalTrigger(triggerVerified, false, rule.triggers[i - 1].nextOperator);
                            objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType});
                        } else {
                            triggerVerified = false;
                            objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType});
                        }
                    }
                }

            } else {
                if (i > 0) {
                    triggerVerified = evalTrigger(triggerVerified, false, rule.triggers[i - 1].nextOperator);
                    objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType});
                } else {

                    triggerVerified = false;
                    objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                }
            }
        } else if (ruleTriggerOperator === "less" || ruleTriggerOperator === "lt") {

            if (parseInt(formTriggerValue) > 0 || parseInt(formTriggerValue) < 0) {

                if (formTriggerName === ruleTriggerName) {

                    if (parseInt(formTriggerValue) < parseInt(ruleTriggerValue)) {

                        if (i > 0) {

                            triggerVerified = evalTrigger(triggerVerified, true, rule.triggers[i - 1].nextOperator.toLowerCase());
                            objNotVer.VerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});

                        } else {
                            if(isRuleChain){
                                var triggers = new Array();
                                var textTrigger = rule.naturalLanguage.substring(0, indiceVirgola).trim(); 
                                if(actionUpdateContextUse[index].triggers){
                                    var exists = actionUpdateContextUse[index].triggers.some(item => item.triggeredRuleName === rule.ruleName);
                                    if (!exists) {
                                        actionUpdateContextUse[index].triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                    }
                                }
                                else {
                                    triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                    actionUpdateContextUse[index].triggers = triggers;
                                }
                            }
                            if (isRuleChainArray){
                                var indiceVirgola = rule.naturalLanguage.indexOf(",");
                                arrayIndex.forEach(function (key){
                                    var triggers = new Array();
                                    var textTrigger = rule.naturalLanguage.substring(0, indiceVirgola).trim();
                                    if(actionUpdateContextUse[key].triggers){
                                        var exists = actionUpdateContextUse[key].triggers.some(item => item.triggeredRuleName === rule.ruleName);
                                        if (!exists) {
                                            actionUpdateContextUse[key].triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                        } 
                                    } 
                                    else {
                                        triggers.push({triggeredRuleName: rule.ruleName,textTrigger: textTrigger, parentTrigger: rule.triggers[0].parent.toLowerCase(), valueTrigger: rule.triggers[0].value.toLowerCase()});
                                        actionUpdateContextUse[key].triggers = triggers;
                                    }
                                });
                            }
                            triggerVerified = true;
                            rule.actions.forEach(action => triggerVerifiedAction.push(action));
                            textAction = rule.naturalLanguage.substring(indiceVirgola + 1).trim();
                            actionUpdateContextUse.push({action: rule.actions, actionRuleName:rule.ruleName, textAction: textAction});
                            objNotVer.VerifiedTrigger.push({nameD: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName, value: ruleTriggerValue, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});      
                                
                        }

                    } else {

                        if (i > 0) {
                            triggerVerified = evalTrigger(triggerVerified, false, rule.triggers[i - 1].nextOperator);
                            objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});

                        } else {

                            triggerVerified = false;
                            objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                        }

                    }
                }
            } else {
                if (i > 0) {
                    triggerVerified = evalTrigger(triggerVerified, false, rule.triggers[i - 1].nextOperator);
                    objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                } else {

                    triggerVerified = false;
                    objNotVer.notVerifiedTrigger.push({name: rule.triggers[i].element.displayedName, realName: rule.triggers[i].element.realName,type: rule.triggers[i].element.type, value: ruleTriggerValue, operator: rule.triggers[i].operator, ref: id, changeto: rule.triggers[i].changesTo, triggerType: rule.triggers[i].triggerType, parent: rule.triggers[i].parent});
                }
            }
        }
    }

    $('#' + rule.ruleName.replace(regexID, '_')).removeClass('ruleInit');
    //aggiorno la vista con i valori verificati
    if (triggerVerified === true) {
        updateContextOfUse(triggerVerifiedAction, rule, triggerVerified);
        //console.log('cambio vista di ', rules.ruleName);
        $('#' + rule.ruleName.replace(regexID, '_')).removeClass('notVerified');        
        $('#' + rule.ruleName.replace(regexID, '_')).addClass('verified');
        var html = rule.ruleName+ '<span class="confButton"></span> <button id="' + rule.ruleName.replace(regexID, '_') + '_why" class="btn btn-xs btn-info whyButton"><span class="material-symbols-rounded">help</span><span class="labelEditRule"> '+ getSimulatorMsgLocale('Why') +'?</span></button>'+
            '<button id="' + rule.ruleName + '_edit" class="btn btn-xs btn-info editRuleButton" onclick="goToEditRule(' + rule.id + ');"><span class="material-symbols-rounded">edit</span><span class="labelEditRule">'+getRepositoryLabelLocale("edit")+'</span></button>';
        $('#' + rule.ruleName.replace(regexID, '_')).find('.ruleName').html(html);
    } else {

        $('#' + rule.ruleName.replace(regexID, '_')).removeClass('verified');        
        $('#' + rule.ruleName.replace(regexID, '_')).addClass('notVerified');
//        $('#' + rule.ruleName.replace(regexID, '_')).find('.ruleName').append('<button id="' + rule.ruleName + '_whyNot" class="btn btn-xs btn-info whyNotButton">Why Not?</button>');
//        $('#' + rule.ruleName.replace(regexID, '_')).find('.ruleName').append('<button id="' + rule.ruleName + '_edit" class="btn btn-xs btn-info editRuleButton" onclick="goToEditRule(' + rule.id + ');"><span class="glyphicon glyphicon-pencil"></span> '+getRepositoryLabelLocale("edit")+'</button>');
        var html = rule.ruleName+ '<span class="confButton"></span> <button id="' + rule.ruleName.replace(regexID, '_') + '_whyNot" class="btn btn-xs btn-info whyNotButton"><span class="material-symbols-rounded">help</span><span class="labelEditRule"> '+ getSimulatorMsgLocale('Why Not') +'?</span></button>'+
            '<button id="' + rule.ruleName + '_edit" class="btn editRuleButton" onclick="goToEditRule(' + rule.id + ');"><span class="material-symbols-rounded">edit</span><span class="labelEditRule">'+getRepositoryLabelLocale("edit")+'</span></button>';
        $('#' + rule.ruleName.replace(regexID, '_')).find('.ruleName').html(html);
    }
    
}

function listAppliancesActions(rule, appliancesActionList) {
    var ruleName = rule.ruleName;
    var appliancesList = new Array();
    for (var i = 0; i < rule.actions.length; i++) {
        var _action = rule.actions[i].action;
        if (_action.type === 'update:applianceState' ||
                _action.type === 'update:applianceStateBlinds' ||
                _action.type === 'update:lightColor' ||    
                _action.type === 'invokeFunctions:changeApplianceState'||
                _action.type === 'invokeFunctions:startRoutine' ||
                _action.type === 'invokeFunctions:lightScene' ||
                _action.type === 'custom:greatLuminare' ||
                _action.type === 'invokeFunctions:changeDoorState') {
            appliancesList.push({
                action: rule.actions[i],
                xPath: _action.xPath,
                value: rule.actions[i].operator
            });
        }
    }
    if (appliancesList.length > 0) {
        var obj = {
            ruleName: ruleName,
            appliancesList: appliancesList
        };
        appliancesActionList.push(obj);
    }
}

function listUiModificationActions(rule, uiModificationActionList) {
    var ruleName = rule.ruleName;
    var uiModificationList = new Array();
    for (var i = 0; i < rule.actions.length; i++) {
        var _action = rule.actions[i].action;
        if (_action.type === 'update') {
            uiModificationList.push({
                action: rule.actions[i],
                id: _action.id,
                element_attr: _action.element_attr,
                value: _action.value
            });
        }
    }
    if (uiModificationList.length > 0) {
        var obj = {
            ruleName: ruleName,
            uiModificationList: uiModificationList
        };
        uiModificationActionList.push(obj);
    }

}

function detectAppliancesConflicts(appliancesActionList) {
    for (var i = 1; i < appliancesActionList.length; i++) {
        var ruleName = appliancesActionList[i].ruleName;
        for (var z = 0; z < appliancesActionList[i].appliancesList.length; z++) {
            var xPath = appliancesActionList[i].appliancesList[z].xPath;
            if(xPath === undefined) {
                xPath = '';
            }
            var value = appliancesActionList[i].appliancesList[z].value;
            for (var j = i - 1; j >= 0; j--) {
                var _ruleName = appliancesActionList[j].ruleName;
                for (var k = 0; k < appliancesActionList[j].appliancesList.length; k++) {
                    var _xPath = appliancesActionList[j].appliancesList[k].xPath;
                    if(_xPath === undefined) {
                       _xPath = '';
                    }
                    var _value = appliancesActionList[j].appliancesList[k].value;
                    var isLightColor = xPath.includes("lightColor");
                    if ((xPath === _xPath || containsAppliance(xPath, _xPath))
                            && checkOperatorsAppliances(value, _value, isLightColor)) {
                        //console.log("* xPath "+xPath+" ruleName "+ruleName+" ruleName "+_ruleName);
                        addConflictingRules(ruleName, _ruleName);
                    }

                }
            }
        }
    }
}

function detectUiModificationConflicts(uiModificationActionList) {
    var rules = {};
    for (var i = 1; i < uiModificationActionList.length; i++) {
        var ruleName = uiModificationActionList[i].ruleName;
        for (var z = 0; z < uiModificationActionList[i].uiModificationList.length; z++) {
            var id = uiModificationActionList[i].uiModificationList[z].id;
            var element_attr = uiModificationActionList[i].uiModificationList[z].element_attr;
            var value = uiModificationActionList[i].uiModificationList[z].value;

            for (var j = i - 1; j >= 0; j--) {
                var _ruleName = uiModificationActionList[j].ruleName;
                for (var k = 0; k < uiModificationActionList[j].uiModificationList.length; k++) {
                    var _id = uiModificationActionList[j].uiModificationList[k].id;
                    var _element_attr = uiModificationActionList[j].uiModificationList[k].element_attr;
                    var _value = uiModificationActionList[j].uiModificationList[k].value;
                    //todo: controllare gli altri casi
                    if (id === _id && element_attr === _element_attr && checkOperatorsUiModification(value, _value)) {
                        addConflictingRules(ruleName, _ruleName);
                    }
                }
            }
        }
    }
    return rules;
}

function getAllTriggers(conflictRules) {
    Object.keys(conflictRules).forEach(function (key) {
        var r1 = getRulesByName(key);
        if (r1 === undefined)
            return;
        conflictRules[key].triggers = r1.triggers;
        for (var i = 0; i < conflictRules[key].conflictRules.length; i++) {
            var tmpRule = getRulesByName(conflictRules[key].conflictRules[i].ruleName);
            if (tmpRule === undefined)
                continue;
            conflictRules[key].conflictRules[i].triggers = tmpRule.triggers;
        }
    });

}

function getAllActions(conflictRules) {
    Object.keys(conflictRules).forEach(function (key) {
        var r1 = getRulesByName(key);
        if (r1 === undefined)
            return;
        conflictRules[key].actions = r1.actions;
        for (var i = 0; i < conflictRules[key].conflictRules.length; i++) {
            var tmpRule = getRulesByName(conflictRules[key].conflictRules[i].ruleName);
            if (tmpRule === undefined)
                continue;
            conflictRules[key].conflictRules[i].actions = tmpRule.actions;
        }
    });

}

function detectTriggerConflict(conflictRules) {
    Object.keys(conflictRules).forEach(function (key) {
        var triggers = conflictRules[key].triggers;
        root : for (var i = 0; i < triggers.length; i++) {
            if (conflictRules[key].foundConflict === undefined)
                conflictRules[key].foundConflict = false;
            var xPath = getXPath(triggers[i].element);
            for (var j = 0; j < conflictRules[key].conflictRules.length; j++) {
                for (var z = 0; z < conflictRules[key].conflictRules[j].triggers.length; z++) {
                    var tmpXPath = getXPath(conflictRules[key].conflictRules[j].triggers[z].element);
                    if (xPath === tmpXPath) {
                        // console.log("r1 "+key+" r2 "+conflictRules[key].conflictRules[j].ruleName);
                        if (checkOverlap(triggers[i], conflictRules[key].conflictRules[j].triggers[z],
                                conflictRules[key].conflictRules[j])) {
                            if (triggers.length === conflictRules[key].conflictRules[j].triggers.length) {
                                conflictRules[key].conflictRules[j].foundConflict = true;
                                conflictRules[key].explanation = conflictRules[key].conflictRules[j].explanation;
                            }
                        } else {
                            delete conflictRules[key];
                            break root;
                        }
                    }
                }
            }
        }
    });
}

function getConflictExplanation(conflictRules) {
    var previousActions = actions;
    var azioni = GLOBALS.actions;
    Object.keys(conflictRules).forEach(function (key) {
        actions = conflictRules[key].actions;
        conflictRules[key].actionExplanation = getPreviousActionNaturalLanguage(true, conflictRules[key].actions);

        for (var i = 0; i < conflictRules[key].conflictRules.length; i++) {
            var tmpActions = [];
            for (var j = 0; j < conflictRules[key].conflictRules[i].actions.length; j++) {
                tmpActions.push(conflictRules[key].conflictRules[i].actions[j]);
            }
            actions = tmpActions;
            conflictRules[key].conflictRules[i].actionExplanation = getPreviousActionNaturalLanguage(true, conflictRules[key].conflictRules[i].actions);
        }
        actions = previousActions;

        var triggers = conflictRules[key].triggers;
        if (conflictRules[key].explanation !== undefined &&
                conflictRules[key].explanation !== '' &&
                conflictRules[key].conflictRules.length === 1 &&
                triggers.length === conflictRules[key].conflictRules[0].triggers.length) {
            return;
        } 
//        for (var i = 0; i < triggers.length; i++) {
//            if (i === 0)
//                conflictRules[key].explanation = getExplanationForTrigger(triggers[i], true);
//            else
//                conflictRules[key].explanation += getExplanationForTrigger(triggers[i], false);
//        }
        
        //if (true || triggers.length !== conflictRules[key].conflictRules.length) {
        for (var i = 0; i < conflictRules[key].conflictRules.length; i++) {
            if(conflictRules[key].explanation === '') {
                conflictRules[key].conflictRules[i].foundConflict = false;
            }
            if ((conflictRules[key].conflictRules[i].explanation === undefined ||
                    conflictRules[key].explanation === '') &&
                    conflictRules[key].conflictRules[i] !== undefined &&                       
                    !conflictRules[key].conflictRules[i].foundConflict) {
                //conflictRules[key].conflictRules[i].explanation = originalExplanation;
                for (var j = 0; j < conflictRules[key].triggers.length; j++) {
                    if (j === 0)
                        conflictRules[key].conflictRules[i].explanation = getExplanationForTrigger(conflictRules[key].triggers[j], true);
                    else
                        conflictRules[key].conflictRules[i].explanation += getExplanationForTrigger(conflictRules[key].triggers[j], false);
                }
            }
            for (var z = 0; z < conflictRules[key].conflictRules[i].triggers.length; z++) {
                if (conflictRules[key].conflictRules[i] !== undefined &&
                        !conflictRules[key].conflictRules[i].foundConflict) {
                    conflictRules[key].conflictRules[i].explanation += getExplanationForTrigger(conflictRules[key].conflictRules[i].triggers[z], false);
                }
                if (!areSameContextEntities(conflictRules[key].conflictRules[i].triggers[z], triggers))
                    conflictRules[key].explanation += getExplanationForTrigger(conflictRules[key].conflictRules[i].triggers[z], false);
            }
        }
        //}        
    });
}

function checkOperatorsAppliances(op1, op2, isLightColor) {
    switch (op1) {
        case "turnOn":
            if (op2 === "turnOff")
                return true;
            else
                if (isLightColor === true)
                    return true;
                return false;
            break;

        case "turnOff":
            if (op2 === "turnOn")
                return true;
            else
                return false;
            break;
        case "open":
            if (op2 === "close")
                return true;
            else
                return false;
            break;
        case "close":
            if (op2 === "open")
                return true;
            else
                return false;
            break;
        case "is":
            if (op2 === "is")
                return true;
            else   
                return false;
            break;
    }
}

function addConflictingRules(rule1, rule2) {
    if (conflictRules[rule1] === undefined) {
        conflictRules[rule1] = {conflictRules: [{ruleName: rule2,
                    triggers: [], actions: []}]};
    } else {
        conflictRules[rule1].conflictRules.push({ruleName: rule2,
            triggers: [], actions: []});
    }
    if (conflictRules[rule2] === undefined) {
        conflictRules[rule2] = {conflictRules: [{ruleName: rule1,
                    triggers: [], actions: []}]};
    } else {
        conflictRules[rule2].conflictRules.push({ruleName: rule1,
            triggers: [], actions: []});
    }
}


$("body").on("click", "#viewAllPrvRules", function() {
  window.location.href = "simulator";
});

function writeRules(updateContextCont) {
    if (updateContextCont) {
        rules = selectedRules;
    }
    else {
        rules = GLOBALS.rules;
    }
    // Ottieni l'URL corrente
    var url = new URL(window.location.href);
    // Ottieni il valore del parametro di query "var"
    var selectedRulesFromPrivate = url.searchParams.get("var");
    if(selectedRulesFromPrivate !== null){
        // Rimuovi gli spazi extra e i caratteri "[" e "]"
        selectedRulesFromPrivate = selectedRulesFromPrivate.replace(/\s+/g, '').replace(/\[|\]/g, '');
        // Utilizza JSON.parse per convertire la stringa in un array
        selectedRulesFromPrivate = JSON.parse("[" + selectedRulesFromPrivate + "]");
        // Filtra l'array rules per includere solo gli oggetti con id presenti in selectedRulesFromPrivate
        selectedRulesFromPrivate = rules.filter(function(rule) {
          return selectedRulesFromPrivate.includes(rule.id);
        });
        if(selectedRulesFromPrivate.length > 0){
            rules = selectedRulesFromPrivate;
        }
    }
    else {
        $('#viewAllPrvRules').hide();
    }
    var text = '';
    if(rules.length > 0){
       if(selectedRulesFromPrivate !== null){
         text += '<div id="verifiedRules">'+getRulesListLocale("Rules")+':<div class="rulesDetails" style="float: right; margin-right: 8px; font-size:14px;"><span style="cursor: pointer;" id="viewAllPrvRules"><b>View all rules</b></span>&emsp;|&emsp;<input type="checkbox" name="selectAll" id="selectAllrule" onchange="selectAllruleSimulate(this)"> <label for="selectAllrule">Select all</label></div></div>';           
       }
       else {
         text += '<div id="verifiedRules">'+getRulesListLocale("Rules")+':<div class="rulesDetails" style="float: right; margin-right: 8px; font-size:14px;"><input type="checkbox" name="selectAll" id="selectAllrule" onchange="selectAllruleSimulate(this)"> <label for="selectAllrule">Select all</label></div></div>';
       }
    }
    GLOBALS.actions = new Array();
    for (var i = 0; i < rules.length; i++) {
        GLOBALS.rules = rules;
        GLOBALS.trigger = GLOBALS.rules[i].triggers;
        GLOBALS.actions.push(GLOBALS.rules[i].actions);
        var azione = GLOBALS.actions;
        GLOBALS.tmpAction = undefined;
        GLOBALS.tmpTrigger = undefined;
        GLOBALS.tmpTriggerArray = [];
        var className = "ruleInit rule_list";
        var idPossibleVerified = $('.possibleVerified').attr("id");
        currRuleId = rules[i].ruleName.replace(regexID, '_');
        ruleIdHashMap[currRuleId] = rules[i].ruleName;
        //rules[i].naturalLanguage.split(',')[0]
        var ruleTextTrigger = "";
        var ruleTextAction = "";
        rules[i].naturalLanguage.split(',')[0].split(' ').forEach(function(parola) {
            if (parola.toLowerCase() === "when" || parola.toLowerCase() === "if") {
                ruleTextTrigger += "<span class='wordTrigger keyWordTrigger_"+parola.toLowerCase()+"'>"+parola.toUpperCase()+"</span> ";
            }
            else if (parola === "and" || parola === "or"){
               ruleTextTrigger += "<span class='wordTrigger keyWordTrigger_"+parola.toLowerCase()+"'>"+parola.toUpperCase()+"</span> ";
            }
            else if(parola === "minutes"){
                ruleTextTrigger += "";
            }
            else {
               ruleTextTrigger += "<span class='wordTrigger'>"+parola+"</span> ";
            }
        });
 
        var testoTriggerSemplice = ruleTextTrigger.split(/(<span class='wordTrigger keyWordTrigger_and'>AND<\/span>)|(<span class='wordTrigger keyWordTrigger_or'>OR<\/span>)/);
        testoTriggerSemplice = testoTriggerSemplice.filter(function(segment) {
            return segment !== undefined && segment.trim() !== "";
        });
        
        var ruleTextTriggerWIthValue = "";
        var cont = 0;
        testoTriggerSemplice.forEach(function(trigger, index) {
             if(trigger.includes("keyWordTrigger_and")){
                ruleTextTriggerWIthValue += trigger;
                cont++;
             }
             else if(trigger.includes("keyWordTrigger_or")){
                ruleTextTriggerWIthValue += trigger;
                cont++;
             }
             else {
                if(index === 0){
                    ruleTextTriggerWIthValue += "<span class='trigger_"+index+"'>" + trigger + "</span>";
                }
                else if(index > 0){
                    if(trigger.includes("becomes")){
                        ruleTextTriggerWIthValue += " <span class='trigger_"+(index-cont)+"'><span class='wordTrigger keyWordTrigger_when'>WHEN</span>" + trigger + "</span>";
                    }
                    else if (trigger.includes("is")){
                        ruleTextTriggerWIthValue += " <span class='trigger_"+(index-cont)+"'><span class='wordTrigger keyWordTrigger_if'>IF</span>" + trigger + "</span>";                    } 
                }
             }
         });
         if(ruleTextTriggerWIthValue.includes("minutes")){
             ruleTextTriggerWIthValue.replace(/\bminutes\b/g, '').trim();
         }
         rules[i].naturalLanguage.split(',').forEach(function(frase, indice){
             if (indice > 0){
                frase.split(' ').forEach(function(parola, index) {
                    if (parola === "do"){
                        ruleTextAction += "<span class='keyWordAction_"+parola.toLowerCase()+"'>"+parola.toUpperCase()+"</span> ";
                     }
                    else if (parola === "open" || parola === "close" || parola === "turn") {
                        if(frase.split(' ')[index-2] !== "do" && parola === "on"){
                            ruleTextAction += ", "+parola;
                        }

                        else {
                            ruleTextAction += parola + " ";
                        }
                    }
                     else {
                         ruleTextAction += parola + " ";
                     }
                });
             }
         });
        
        text += '<label for="checkbox_' + currRuleId + '" style="width: 100%;"><div id="' + currRuleId + '" class="' + className + '"><div class="ruleName">' + rules[i].ruleName + ':<span class="confButton"></span></div>\n';
        text += '<div class="ruleNaturalLanguageDescription" style="margin-right: 10px; font-style: italic;"><span class="triggerText">' + ruleTextTriggerWIthValue + "</span>,<span class='actionText'>"+ruleTextAction +'</span><input type="checkbox" style="float: right; margin-top: 10px;" id="checkbox_' + currRuleId + '" class="ruleCheckBox"></div>\n';
        text += '</div></label>\n';
        
    }
        $("#simulatorResult").html(text);
        if(idPossibleVerified){
            $('#'+idPossibleVerified).addClass("possibleVerified");
        }
    }

$('#beackButton').on('click', function () {
    $('.whyInfoRuleChain').show();
    $('.whyInfoIndirectRuleChain').show();
    actionbuttoncontex(true);
    $("#verifiedRules").html("Rules:");
    /*
    $('#tree').treeview({
        data: getTree(rules, true),
        onNodeSelected: function (event, data) {
            return false;
        }
    });*/
    $('#tree').find('[style*="background: rgb(199, 239, 159);"], [style*="background: rgb(249, 209, 209);"]')
        .css({'background-color': '#fff', 'color': 'black'});
    $('.radioGroup').each(function () {
        $(this).removeAttr("style");
    });  
    $("input").each(function () {
        $(this).removeAttr("style");
    });
    $("select").each(function () {
        if($(this).hasClass('ruleChain')){
            if ($(this).css('border-color') === "rgb(255, 0, 0)"){
                $(this).css({'border': '3px solid #24BC33'});
            }
        }
        else {
            $(this).removeAttr("style");
        } 
    });
    $('.possibleVerified').css("background-color", "rgb(246, 232, 113)");
    Object.keys(getInput).forEach(function (key) {
        var val = getInput[key].val;
        
                var nameR = key.indexOf('-');
                var nameRadio = key.substring(0, nameR);

                var valRadio;

                if (getInput[key].changeTo === false) {
                    valRadio = 'is';
                } else {
                    valRadio = 'becomes';
                }

                if (valRadio === 'is') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="becomes"]').remove();

                    $('.' + nameRadio + '_is').prepend('<input  id="' + nameRadio + '_is" class="radio active" type="radio" name="' + nameRadio + '" checked="checked" value="is" />');

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" class="radio" type="radio" name="' + nameRadio + '"  value="becomes" />');

                } else if (valRadio === 'becomes') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="is"]').remove();

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" type="radio" class="radio active" name="' + nameRadio + '" checked="checked" value="becomes" />');

                    $('.' + nameRadio + '_is').prepend('<input id="' + nameRadio + '_is" class="radio" type="radio" name="' + nameRadio + '"  value="is" />');

                }

        $('#' + key).val(val);
    });
    var textRuleChain = "";
    if($(".whyInfoRuleChain").length > 0){
        textRuleChain += $(".whyInfoRuleChain").prop('outerHTML');
    }
    if($(".whyInfoIndirectRuleChain").length > 0){
        textRuleChain += $(".whyInfoIndirectRuleChain").prop('outerHTML');
    }
    writeRules(false);
    simulate(false);
    conflitInfo();
    $('#infoRules').append(textRuleChain);
});
$('#updateContext, #updateContextCont').on('click', function () {
    $('.infoTitle').remove();
    $('.whyInfo').remove();
    $('.whyNotButton').remove();
    $('.whyButton').remove();
    $(".ruleChain").removeClass("ruleChain");
    $('.radioGroup').each(function () {
        $(this).removeAttr("style");
    });
    $("select").each(function () {
        $(this).removeAttr("style");
    });
    $("input").each(function () {
        $(this).removeAttr("style");
    });
    $('#tree').find('[style*="background: rgb(199, 239, 159);"], [style*="background: rgb(249, 209, 209);"]')
        .css({'background-color': '#fff', 'color': 'black'});
    triggerVerifiedAction = new Array();
    if($(this).attr("id") === "updateContext"){
        // Trova gli input di tipo checkbox selezionati
        var checkedCheckboxes = $(".rule_list input[type=checkbox]:checked");
        if (checkedCheckboxes.length > 0) {
            // Itera sugli input di tipo checkbox selezionati
            checkedCheckboxes.each(function () {
                var selectedId = $(this).attr("id").replace("checkbox_", "");
                var matchedRule = rules.find(item => item.ruleName === selectedId);
                if (matchedRule && !selectedRules.some(rule => rule.ruleName === selectedId)) {
                  selectedRules.push(matchedRule);
                }
              });
        } else {
            $('#noRulesSelected').modal('show');
        }
        $(".rule_list input[type=checkbox]:not(:checked)").each(function () {
            var selectedId = $(this).attr("id").replace(/checkbox_/g, '');
            selectedRules = selectedRules.filter(rule => rule.ruleName !== selectedId);
        });
        writeRules(false);
    }
    else {
        var idRule = $(".rule_list.notVerified, .rule_list.verified").attr("id"); 
        selectedRules = rules.filter(function(rule) {
            return rule.ruleName === idRule;
        });
        writeRules(true);
    }
    actionUpdateContextUse = new Array();
    formValue = new Array();
    $("select[style*='border: 3px solid rgb(36, 188, 51)'], div[style*='border: 3px solid rgb(36, 188, 51)']").each(function() {
        var $this = $(this);
        if ($this.is("select")) {
            $this.val('').css("border", "1px solid #ccc");
        } else if ($this.is("div")) {
            $this.css("border", "none");
            $this.find("input[value='becomes']").removeClass("active").prop("checked", false); 
            $this.find("input[value='is']").attr("class", "radio active");
            $this.find("input[value='is']").prop("checked", true);
        }
    });
    // memorizzo i valori del form
    $('select.inputTrigger').each(function() {
      var selectedValue = $(this).val();
      var selectedId = $(this).attr('id');
      formValue[selectedId] = { value: selectedValue };
    });
    $('input[checked="checked"]').each(function() {
      var id = $(this).attr('id');
      var className = $(this).attr('class');
      formValue[id] = { className: className };
    });

    $('#whyInfo').remove();
    selectedRules.forEach(() => simulate(false));
    actionUpdateContextUse = actionUpdateContextUse.filter(function(action) {
        return action.triggers !== undefined;
    });
    if (actionUpdateContextUse.length > 0) {
        updateInfoDirectRuleChain(actionUpdateContextUse);
    }
    //elimina gli elementi duplicati
    arrayIndirectActivation = [...new Set(arrayIndirectActivation.map(JSON.stringify))].map(JSON.parse);  
    if (arrayIndirectActivation.length > 0){
        updateInfoIndirectRuleChain(arrayIndirectActivation);
    }
    conflitInfo();
    var changeConf = false;
    $('.inputTrigger').each(function () {
       var name = $(this).attr('id');
        var val = $(this).val();
         
        //var nameR = name.indexOf('-');
        var nameRadio = name.replace(/-[^-]*$/, '');
        
        var valRadio = $('input[name="' + nameRadio + '"].active').attr('value');
         
        if (valRadio === 'becomes') {
            changeConf = true;
        } else if (valRadio === 'is') {
            changeConf = false;
        }else if (valRadio === undefined) {
            changeConf = false;
        }

        getInput[name] = {
            val: val,
            changeTo: changeConf
        };

    }); 
});

//event Condiction Rule Indicator
$(document).on('click', '.conflitIndicator', function () {
    var $titleModal = $('#title_ConflictSingleButton');
    var getId = $(this).attr('id');
    var id_ext = getId.replace('_conflict', '');
    var id = id_ext;
    var htmlTitleRulein_Conflict = '';
    var htmlTitleRuleinConflict = '';
    
    var idRule = id.replace('_whyNot', '');
    var nameRule = ruleIdHashMap[idRule];


    $titleModal.html(getSimulatorMsgLocale('Rule')+': ' + '<span>' + nameRule + '</span>');
    
    
    if (conflictRules[nameRule] === undefined) {
          
       $('#bodyConflictSingle').html('<p><strong>'+getSimulatorMsgLocale('Conflicting Rules')+': </strong><span id="ruleInConflict"> </span></p>'+
                        '<p><strong>'+getSimulatorMsgLocale('When')+': </strong><span id="explanation" class="explanationAlert"></span></p>'+
                           '<p><strong>'+getSimulatorMsgLocale('Conflicting Actions')+':</strong><span id="explanationActions" class="explanationAlert"></span></p>'+
                         '<hr><br><br>');

        Object.keys(conflictRules).forEach(function (key) {
            for (var i = 0; i < conflictRules[key].conflictRules.length; i++) {

                if (conflictRules[key].conflictRules[i].ruleName === nameRule) {
                    var ruleKeyConflict = key;
                    htmlTitleRulein_Conflict += ruleKeyConflict + ', ';

                    for (var j = 0; j < conflictRules[key].conflictRules.length; j++) {

                        htmlTitleRulein_Conflict += conflictRules[key].conflictRules[j].ruleName + ', ';
                    }

                    var html = htmlTitleRulein_Conflict.replace(nameRule + ',', '');
                    var lastIndex = html.lastIndexOf(",");

                    $('#ruleInConflict').html(html.substring(0, lastIndex));
                    $('#explanation').html(conflictRules[key].explanation);
                    $('#explanationActions').html(conflictRules[key].actionExplanation + " ("+key+")");
                   
                }
            }
        });

        $('#singleRuleConflit').modal('show');

    } else {
        var htmlTitleRuleinConflict = '';
        for (var x = 0; x < conflictRules[nameRule].conflictRules.length; x++) {

            htmlTitleRuleinConflict += '<p><strong>'+getSimulatorMsgLocale('Conflicting Rules')+': </strong><span>' + nameRule + ', ' + conflictRules[nameRule].conflictRules[x].ruleName + '</span></p>' +
                    '<strong>EXPLANATION </strong><span></span></p>' +
                    '<p><strong>'+ getSimulatorMsgLocale('When') +': </strong><span class="explanationAlert">' + conflictRules[nameRule].conflictRules[x].explanation + '.</span>' +
                    '<p><strong>'+ getSimulatorMsgLocale('Conflicting Actions') +': </strong><span class="explanationAlert">' + conflictRules[nameRule].actionExplanation + " <strong> -- </strong> " + conflictRules[nameRule].conflictRules[x].actionExplanation + '.</span>'+
                    '<p style="border-bottom: 1px solid #e2e2e2;"></p>';

        }
      
        $('#bodyConflictSingle').html(htmlTitleRuleinConflict);
    }
    $('#singleRuleConflit').modal('show');
});

$('#conflictAnalisis').on('click', function () {
    conflictOnLoad();
    $('#conflictAnalisisModal').modal('show');
});

//reset value button
$('#resetValue').on('click', function () {
    $('.infoTitle').remove();
    $('.whyInfo').remove();
    $('.possibleVerified').removeClass('possibleVerified');
    //resetto le regole selezionate
    selectedRules = new Array();
    arrayIndex = new Array();
    isLoopArray = new Array();
    triggerVerifiedAction = new Array();
    arrayIndirectActivation = new Array();
    //resetta tutti i campi degli input Form
    $('.inputTrigger').each(function () {
        $(this).val('');
    });
    //rimuove il bordo colorato negli input Form e reimposta i radio button a "is", valore di default
    $('.radioGroup').each(function () {
        $(this).removeAttr("style");
    });
    $("input[value='becomes'][checked]").each(function () {
        $(this).removeClass("active");
        $(this).removeAttr("checked");
    });
    $("input[value='is']:not([checked])").each(function () {
        //$(this).attr("class", "radio active").attr("checked", "checked");
        $(this).attr("class", "radio active");
        $(this).prop('checked', true);
    });
    $("select").each(function () {
        $(this).removeAttr("style");
    });
    writeRules(false);
    actionUpdateContextUse = new Array();
});

$('#goalOptimization').on('click', function () {
    $('.infoTitle').remove();
    $('.whyInfo').remove();
    $('#overlapHelpOptim').hide();
    $('[id^="room_"]').hide();
    $('[id$="TemperatureDesidered"], [id$="HumidityDesidered"]').hide();
    $("#error_goalAdvisor_goal").hide();
    $("#error_goalChoice").hide();
    $("#kitchenHumidityDesidered").hide();
    $("#error_goalAdvisor").hide();
    $("#askForPreferences").hide();
    $("#selectGoalforOptimization").val('--none--');
    $('#noAnswer').css("text-decoration", "none");
    $('#yesAnswer').css("text-decoration", "none");
    conflictWithGoal = new Array();
    $('#whyInfo').remove();
    $('.labelEnvironmentVariables').remove();    
    // Trova gli input di tipo checkbox selezionati
    var checkedCheckboxes = $(".rule_list input[type=checkbox]:checked");
    if (checkedCheckboxes.length > 0) {
        // Itera sugli input di tipo checkbox selezionati
        checkedCheckboxes.each(function () {
            var selectedId = $(this).attr("id").replace("checkbox_", "");
            var matchedRule = rules.find(item => item.ruleName === selectedId);
            if (matchedRule && !selectedRules.some(rule => rule.ruleName === selectedId)) {
              selectedRules.push(matchedRule);
            }
        });
        //var textHtml = thresholdValues();
        //$('#selectGoalOptimization .modal-body').append(textHtml);
        $("#selectGoalforOptimization").css({'border': '1px solid #D4D4D4'});
        $('#selectGoalOptimization').modal('show');  
    } else {
        $('#noRulesSelectedGoalOptimization').modal('show');
        $("#noRulesSelectedGoalOptimization .noRulesTxt").html("No rules selected");
    } 
});

var environmentVariablesForDesideredValues = [];

$('#selectGoalOptimization').change(function() {
    var selectedRules = new Array();
    $('#desideredTemperature').off('change');
    $('#desideredHumidity').off('change');
    $("#askForPreferences").hide();
    var value = $("#selectGoalforOptimization").val();
    environmentVariablesForDesideredValues = [];
    // Trova gli input di tipo checkbox selezionati
    var checkedCheckboxes = $(".rule_list input[type=checkbox]:checked");
    if (checkedCheckboxes.length > 0) {
        // Itera sugli input di tipo checkbox selezionati
        checkedCheckboxes.each(function () {
            var selectedId = $(this).attr("id").replace("checkbox_", "");
            var matchedRule = rules.find(item => item.ruleName === selectedId);
            if (matchedRule && !selectedRules.some(rule => rule.ruleName === selectedId)) {
              selectedRules.push(matchedRule);
            }
        });
        $("#selectGoalforOptimization").css({'border': '1px solid #D4D4D4'});
        $('#selectGoalOptimization').modal('show');  
    }
    selectedRules.forEach(function(rule){
        rule.actions.forEach(function(action){
            var realNameAction = action.action.realName;
            var parentAction =  action.parent;
            if(parentAction !== "Devices" && parentAction !== "Entrance" && parentAction !== "Corridor" && parentAction !== undefined){
                if(environmentVariablesForDesideredValues[parentAction.toLowerCase()] === undefined){
                    environmentVariablesForDesideredValues[parentAction.toLowerCase()] = { env_var: [] };
                }
                var valueOperator = action.operator;
                if (valueOperator === "turnOn"){
                    valueOperator = "on";
                }
                if (valueOperator === "turnOff"){
                    valueOperator = "off";
                }
                var myNegativeGoals = negativeGoalsForAction(realNameAction, parentAction, valueOperator);
                if(myNegativeGoals !== undefined){
                    myNegativeGoals.forEach(function(goal){
                        if(goal.goal.replace(/\s/g, '').replace(/-/g, '') === value){
                            environmentVariablesForDesideredValues[parentAction.toLowerCase()].env_var.push(goal.environment_variable);
                        }
                    });
                }
            }
        });
    });
    for (let key in environmentVariablesForDesideredValues) {
        if (environmentVariablesForDesideredValues[key].env_var && environmentVariablesForDesideredValues[key].env_var[0] === undefined) {
            delete environmentVariablesForDesideredValues[key];
        }
    }
    var isTemperaturePresent = checkForTemperature(environmentVariablesForDesideredValues);
    var isHumidityPresent = checkForHumidity(environmentVariablesForDesideredValues);

    if (isTemperaturePresent || isHumidityPresent) {
        $('#askForPreferences').show();
    }
});

function checkForTemperature(data) {
  for (const room in data) {
    // Verifica se 'temperature' è presente nell'array env_var della stanza corrente
    if (data[room].env_var.includes('temperature')) {
      return true;
    }
  }
  return false; // Se 'temperature' non è presente in nessuna stanza, restituisci false
}

function checkForHumidity(data) {
  for (const room in data) {
    // Verifica se 'temperature' è presente nell'array env_var della stanza corrente
    if (data[room].env_var.includes('humidity')) {
      return true;
    }
  }
  return false; // Se 'temperature' non è presente in nessuna stanza, restituisci false
}

$('#yesAnswer').on('click', function() {
    $('#error_goalChoice').hide();
    $('#yesAnswer').css("text-decoration", "underline");
    $('#noAnswer').css("text-decoration", "none");
    $('#formValuesChoice').hide();
    for (let stanza in environmentVariablesForDesideredValues) {
        $('#room_'+stanza).show();
        if(environmentVariablesForDesideredValues[stanza].env_var.includes("humidity")){
             $('#'+stanza+"HumidityDesidered").show();
        }
        if(environmentVariablesForDesideredValues[stanza].env_var.includes("temperature")){
           $('#'+stanza+"TemperatureDesidered").show();
        } 
    }
    //$('#footerGoalSugg').css("margin-top", "45%");
    $('#formValuesChoice').show();
});

$('#noAnswer').on('click', function () {
    $('#error_goalChoice').hide();
    $('#yesAnswer').css("text-decoration", "none");
    $('#noAnswer').css("text-decoration", "underline");
    //$('#footerGoalSugg').css("margin-top", "0");
    $('.desideredValues').hide();
});

var outsideValues = [];
var internalValues = [];

$('#modalGoalOptimizationOptimizeButton').on('click', function () {
    $("#error_goalAdvisor_goal").hide();
    $("#error_goalAdvisor").hide();
    $("#error_goalChoice").hide();
    var errorChoice = false;
    
    outsideValues = [];
    internalValues = [];
    userGoal = $("#selectGoalforOptimization").val();
    var errorGoalSelect = false;
    if(userGoal === '' || userGoal === null){
        errorGoalSelect = true;
        errorChoice = false;
    }
    $("#selectGoalforOptimization").css({'border': '1px solid #D4D4D4'});
    $("#error_goalAdvisor_goal").hide();
    var errorFormOutsideValueMissing = false;
    //recupero le variabili d'ambiente dell'esterno
    $("[id*='outdoor_varEnv']").each(function() {
        var id = $(this).attr('id');
        var value = $(this).val();
        if(value === ''){
            $("#"+id).css({'border': '2px solid red'});
            errorFormOutsideValueMissing = errorFormOutsideValueMissing || true;
        }
        else {
            $("#"+id).css({'border': '1px solid #D4D4D4'});
            var variable = id.replace('_outdoor_varEnv', '');
            outsideValues.push({
                variable: variable,
                value: value
            });
        }
    });
    //recupero le variabili d'ambiente delle stanze dentro casa
    var parent = new Array();
    selectedRules.forEach(function(rule){
        rule.actions.forEach(function(action){
            if(action.parent !== "Devices" && action.parent !== undefined){
                parent.push(action.parent.toLowerCase()); 
            }
        });
    });
    var errorFormValueMissing = false;
    parent.forEach(function(node){
        $("[id*='"+node+"_varEnv']").each(function(){
            var id = $(this).attr('id');
            var value = $(this).val();
            if(value === ''){
                $("#"+id).css({'border': '2px solid red'});
                errorFormValueMissing = errorFormValueMissing || true;
            }
            else {
                $("#"+id).css({'border': '1px solid #D4D4D4'});
                var variable = id.replace('_'+node+'_varEnv', '');
                internalValues.push({
                    variable: variable,
                    value: value,
                    room: node
                });
            }
        });
    });
    if($("#askForPreferences").is(":visible") === true ){
        if(!$("#noAnswer").css("text-decoration").includes("underline") && ! $("#yesAnswer").css("text-decoration").includes("underline")){
            errorChoice = true;
        }
    }
    desideredBedroomHumidity = parseInt($("#bedroomDesideredHumidity").val()); 
    desideredBedroomTemperature = parseInt($("#bedroomDesideredTemperature").val()); 
    desideredKitchenHumidity = parseInt($("#kitchenDesideredHumidity").val()); 
    desideredKitchenTemperature = parseInt($("#kitchenDesideredTemperature").val()); 
    desideredBathroomHumidity = parseInt($("#bathroomDesideredHumidity").val()); 
    desideredBathroomTemperature = parseInt($("#bathroomDesideredTemperature").val()); 
    desideredLivingRoomHumidity = parseInt($("#livingroomDesideredHumidity").val()); 
    desideredLivingRoomTemperature = parseInt($("#livingroomDesideredTemperature").val());
    desideredHomeHumidity = parseInt($("#homeDesideredHumidity").val()); 
    desideredHomeTemperature = parseInt($("#homeDesideredTemperature").val());
 
    if(errorFormValueMissing || errorGoalSelect || errorChoice || errorFormOutsideValueMissing){
        if (errorFormValueMissing){
            $("#error_goalAdvisor").show();
            $("#error_goalAdvisor").html("Missing values in Context of Use");
        }
        if (errorGoalSelect){
            $("#selectGoalforOptimization").css({'border': '2px solid red'});
            $("#error_goalAdvisor_goal").show();
            $("#error_goalAdvisor_goal").html("Select a goal");
        }   
        if (errorChoice) {    
            $("#error_goalChoice").show();
            $("#error_goalChoice").html("Make a choice");        
        }
        if (errorFormOutsideValueMissing){
            $("#error_goalAdvisor").show();
            $("#error_goalAdvisor").html("Missing values in Context of Use");
        }
    } else {
        if (userGoal === undefined) {
            userGoal = "";
        }
        $('#selectGoalOptimization').modal('hide');
        getGoalCheck();
    }
        
    
});

$(document).on('click', '.whyNotButton', function () { //whyNot Handler
    $('.whyInfoRuleChain').hide();
    $('.whyInfoIndirectRuleChain').hide();
    
    $('.radioGroup').each(function () {
        $(this).removeAttr("style");
    });
    $("select").each(function () {
        $(this).removeAttr("style");
    });
    $("input").each(function () {
        $(this).removeAttr("style");
    });
    $('.possibleVerified').css("background-color", "rgb(249, 209, 209)");
    var id = $(this).attr('id');
    //$('#whyInfo').remove();
    var idRule = id.replace('_whyNot', '');
    var nameRule = ruleIdHashMap[idRule];
    WhyAction(nameRule, rules);
    $(".ruleCheckBox").hide();
    $(".rulesDetails").hide();
    Object.keys(getInput).forEach(function (key) {
        var val = getInput[key].val;       
                var nameR = key.indexOf('-');
                var nameRadio = key.substring(0, nameR);

                var valRadio;

                if (getInput[key].changeTo === false) {
                    valRadio = 'is';
                } else {
                    valRadio = 'becomes';
                }

                if (valRadio === 'is') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="becomes"]').remove();

                    $('.' + nameRadio + '_is').prepend('<input  id="' + nameRadio + '_is" class="radio active" type="radio" name="' + nameRadio + '" checked="checked" value="is" />');

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" class="radio" type="radio" name="' + nameRadio + '"  value="becomes" />');

                } else if (valRadio === 'becomes') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="is"]').remove();

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" type="radio" class="radio active" name="' + nameRadio + '" checked="checked" value="becomes" />');

                    $('.' + nameRadio + '_is').prepend('<input id="' + nameRadio + '_is" class="radio" type="radio" name="' + nameRadio + '"  value="is" />');

                }
        $('#' + key).val(val);
    });    
    simulate(true);
    
    errorInformation(nameRule, arrayTriggerNotVerified);
});

$(document).on('click', '.whyButton', function () { // why handler
    $('.whyInfoRuleChain').hide();
    $('.whyInfoIndirectRuleChain').hide();
    $('.radioGroup').each(function () {
        $(this).removeAttr("style");
    });
    $("select").each(function () {
        $(this).removeAttr("style");
    });
    $("input").each(function () {
        $(this).removeAttr("style");
    });
     var id = $(this).attr('id');
     var idRule = id.replace('_why', '');
     var nameRule = ruleIdHashMap[idRule];

    //var nameRule = id.replace('_why', '').replace(new RegExp("-", 'g'), ' ');

    WhyAction(nameRule, rules);
    $(".ruleCheckBox").hide();
    $(".rulesDetails").hide();
    
    Object.keys(getInput).forEach(function (key) {
        var val = getInput[key].val;
        
        
        var nameR = key.indexOf('-');
                var nameRadio = key.substring(0, nameR);

                var valRadio;

                if (getInput[key].changeTo === false) {
                    valRadio = 'is';
                } else {
                    valRadio = 'becomes';
                }

                if (valRadio === 'is') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="becomes"]').remove();

                    $('.' + nameRadio + '_is').prepend('<input  id="' + nameRadio + '_is" class="radio active" type="radio" name="' + nameRadio + '" checked="checked" value="is" />');

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" class="radio" type="radio" name="' + nameRadio + '"  value="becomes" />');

                } else if (valRadio === 'becomes') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="is"]').remove();

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" type="radio" class="radio active" name="' + nameRadio + '" checked="checked" value="becomes" />');

                    $('.' + nameRadio + '_is').prepend('<input id="' + nameRadio + '_is" class="radio" type="radio" name="' + nameRadio + '"  value="is" />');

                }

        $('#' + key).val(val);
    });    
    simulate(true);    
    conflitInfo();
});

//open modal save conf
$('#saveValueSimulator').on('click', function () {
    $('#saveConfModal').modal('show');
});

$('#loadValueSimulator').on('click', function () {
    $('#loadConfModal').modal('show');
    loadProfileConfigurationFiles();
});

function conflitInfo() {
    Object.keys(conflictRules).forEach(function (key) {
        for (var j = 0; j < conflictRules[key].conflictRules.length; j++) {

            var ruleName_Id = key.replace(regexID, '_');
            var ruleNameInConflict_ID = conflictRules[key].conflictRules[j].ruleName.replace(regexID, '_');

            if ($('#' + ruleName_Id).hasClass("verified") && $('#' + ruleNameInConflict_ID).hasClass("verified")) {

                //console.log(ruleName_Id, ruleNameInConflict_ID);
                var id1 = $('#' + key.replace(regexID, '_')).find('.confButton');
                var id2 = $('#' + conflictRules[key].conflictRules[j].ruleName.replace(regexID, '_')).find('.confButton');
                id1.html('');
                id2.html('');
                id1.html('<button id="' + key.replace(regexID, '_') + '_conflict" class="btn conflitIndicator"><span class="material-symbols-rounded">warning</span><span class="labelEditRule">'+ getSimulatorMsgLocale('Conflict') +'</span></button>');
                id2.html('<button id="' + conflictRules[key].conflictRules[j].ruleName.replace(regexID, '_') + '_conflict" class="btn conflitIndicator"><span class="material-symbols-rounded">warning</span><span class="labelEditRule">'+ getSimulatorMsgLocale('Conflict') +'</span></button>');

            }
        }
    });
}

function conflictOnLoad() {
    if(Object.keys(conflictRules).length === 0)
        $('#bodyConflictAnalisis').html(getNaturalLanguageResponseMsgLocale("no_conflict"));
    else
        $('#bodyConflictAnalisis').html('');
    
    var analyzedRules = [];
    Object.keys(conflictRules).forEach(function (key) {
        
        var confRules = "";
        var confActions = [];
        var actionBelongToRule = [];
        for (var x = 0; x < conflictRules[key].conflictRules.length; x++) {        
            if(arrayContains(analyzedRules, conflictRules[key].conflictRules[x].ruleName, key)) 
                continue;
            analyzedRules.push( {
               ruleName : conflictRules[key].conflictRules[x].ruleName, 
               conflictRuleName : key
            });
            var html = '<div class="ruleConflictBox">';
            html += '<p><strong><i>' + key + '</i> in conflict with <i>'+conflictRules[key].conflictRules[x].ruleName +'</i></strong></p>';    
            html += "There is a conflict between <i>" +key+"</i> and <i>"+ conflictRules[key].conflictRules[x].ruleName +"</i> because ";
            html += conflictRules[key].conflictRules[x].explanation.toLowerCase() +" there are these conflicting actions: ";
            html += "<ul><li><span style='color: #bb6a6a'>"+conflictRules[key].actionExplanation.toLowerCase() + "</span> (<i>"+key+"</i>)</li>";
            html += "<li> <span style='color: #bb6a6a'>" + conflictRules[key].conflictRules[x].actionExplanation.toLowerCase() + "</span> (<i>" + conflictRules[key].conflictRules[x].ruleName + "</i>)</li></ul>";
            html += "</div>";
            html += "<hr>";
            
            confRules += conflictRules[key].conflictRules[x].ruleName + ", ";
            var actionIdx = $.inArray(conflictRules[key].conflictRules[x].actionExplanation, confActions);
            if( actionIdx === -1) {
                confActions.push(conflictRules[key].conflictRules[x].actionExplanation);
                actionBelongToRule.push(conflictRules[key].conflictRules[x].ruleName);
            } else {
                actionBelongToRule[actionIdx] = actionBelongToRule[actionIdx]+", "+conflictRules[key].conflictRules[x].ruleName;
            }
            $('#bodyConflictAnalisis').append(html);
        }
        if (conflictRules[key].conflictRules.length > 1) {
            var lastIndex = confRules.lastIndexOf(",");


            var html = '<div class="ruleConflictBox">';
            html += '<p><strong><i>' + key + '</i> in conflict with <i>'+confRules.substring(0, lastIndex) +'</i></strong></p>'; 
            html += "There is a conflict between <i>" +key+"</i> and <i>"+ confRules.substring(0, lastIndex) +"</i> because ";
            html += conflictRules[key].explanation +" there are these conflicting actions: ";
            html += "<ul><li><span style='color: #bb6a6a'>"+conflictRules[key].actionExplanation+"</span> (<i>"+key+"</i>)</li>";   
            for (var x = 0; x < confActions.length; x++) {
               if(x < confActions.length-1) 
                html += " <li><span style='color: #bb6a6a'>"+confActions[x].toLowerCase()+"</span> (<i>"+actionBelongToRule[x]+"</i>)</li> "; 
               else 
                html += " <li><span style='color: #bb6a6a'>"+confActions[x].toLowerCase()+"</span> (<i>"+actionBelongToRule[x]+"</i>)</li>"; 
            }
            html += '</ul></div>';
            html += "<hr>";

            $('#bodyConflictAnalisis').append(html);
        }
        //console.log("analyzedRules", analyzedRules);
    });
}

function arrayContains(array, r1, r2) {
    for(var i = 0; i < array.length; i++) {
        if(array[i].ruleName === r2 && array[i].conflictRuleName === r1)
            return true;
    }
    return false;
}

function evalTrigger(triggerVerified, newTriggerVerified, ruleTriggerNextOperator) {

    switch (ruleTriggerNextOperator) {
        case 'and':

            return triggerVerified && newTriggerVerified;
            break;

        case 'or':

            return triggerVerified || newTriggerVerified;
            break;
    }
}

function simulate(isWhyOrWhyNot) {
    triggerVerifiedAction = new Array();
    var arrNotVer = [];
    for (var i = 0; i < selectedRules.length; i++) {
         var objNotVer = {
            ruleName: selectedRules[i].ruleName,
            notVerifiedTrigger: [],
            VerifiedTrigger: []
        };
        ruleMatch(selectedRules[i], objNotVer);
        arrNotVer.push(objNotVer);
    }
    changeTo(arrNotVer, isWhyOrWhyNot);
    arrayTriggerNotVerified = arrNotVer;
    if(!isWhyOrWhyNot)
        return;
    
    for (var i = 0; i < arrNotVer.length; i++) {

        var rulename = arrNotVer[i].ruleName;

        //var naturalLanguage = $('#' + rulename.replace(regexID, '_') + ' > .ruleNaturalLanguageDescription').html();
        for (var j = 0; j < arrNotVer[i].notVerifiedTrigger.length; j++) {
            $('#' + rulename.replace(regexID, '_')).find(".triggerValue_"+arrNotVer[i].notVerifiedTrigger[j].realName+"_"+arrNotVer[i].notVerifiedTrigger[j].value).removeClass("VerifiedValue");
            $('#' + rulename.replace(regexID, '_')).find(".triggerValue_"+arrNotVer[i].notVerifiedTrigger[j].realName+"_"+arrNotVer[i].notVerifiedTrigger[j].value).addClass("notVerifiedValue");
        }
        for (var j = 0; j < arrNotVer[i].VerifiedTrigger.length; j++) {
            $('#' + rulename.replace(regexID, '_')).find(".triggerValue_"+arrNotVer[i].VerifiedTrigger[j].realName+"_"+arrNotVer[i].VerifiedTrigger[j].value).removeClass("notVerifiedValue");
            $('#' + rulename.replace(regexID, '_')).find(".triggerValue_"+arrNotVer[i].VerifiedTrigger[j].realName+"_"+arrNotVer[i].VerifiedTrigger[j].value).addClass("VerifiedValue");                        
        }
        if($('#' + rulename.replace(regexID, '_')).hasClass('verified')) {
            $('#' + rulename.replace(regexID, '_')).find('.notVerifiedValue').removeClass("notVerifiedValue");
            $('#' + rulename.replace(regexID, '_')).find('.VerifiedValue').removeClass("VerifiedValue");
        }   
    }
}

function changeTo(obj, isWhyOrWhyNot) {
    for (var i = 0; i < obj.length; i++) {  
        
        if (obj[i].VerifiedTrigger.length > 0) {
            for (var j = 0; j < obj[i].VerifiedTrigger.length; j++) {
                var inputChange = false;
                var changeToRule;
                if (obj[i].VerifiedTrigger[j].triggerType === "event"){
                   changeToRule = true;
                }
                else 
                   changeToRule = false;
                var name =  (obj[i].VerifiedTrigger[j].realName + "-" + obj[i].VerifiedTrigger[j].parent).replace(/([^_]*_[^_]*)_.*$/, "$1").toLowerCase().replace(/_.*/, '');
                //var triggerNameStart = name.substring(0, name.length - 1);

                $('input[name=' + name + '].active').each(function () {

                    if ($(this).val() === 'is') {
                        inputChange = false;
                    } else if ($(this).val() === 'becomes') {
                        inputChange = true;
                    } else {
                        inputChange = false;
                    }
                });              
                compareChangeTo(changeToRule, inputChange, name, obj[i].ruleName, isWhyOrWhyNot);                
            }
        }

        if (obj[i].notVerifiedTrigger.length > 0) {
            if (obj[i].notVerifiedTrigger.length > 0) {
                for (var j = 0; j < obj[i].notVerifiedTrigger.length; j++) {
                    var inputChange = false;
                    var changeToRule = obj[i].notVerifiedTrigger[j].changeto;
                    var name = obj[i].notVerifiedTrigger[j].realName + "_" + obj[i].notVerifiedTrigger[j].parent.toLowerCase();
                    //var triggerNameStart = name.substring(0, name.length - 1);

                    $('input[name=' + name + '].active').each(function () {

                        if ($(this).val() === 'is') {
                            inputChange = false;
                        } else if ($(this).val() === 'becomes') {
                            inputChange = true;
                        } else {
                            inputChange = false;
                        }
                    });                
                    compareChangeTo(changeToRule, inputChange, name, obj[i].ruleName, isWhyOrWhyNot);                          
                }
            }
        }
        if($("#" + obj[i].ruleName.replace(regexID, '_')).hasClass('verified')) {
            $("#" + obj[i].ruleName.replace(regexID, '_')).find(".VerifiedValue").removeClass('VerifiedValue');
        }
    }
}

function compareChangeTo(ruleChange, simulChange, nameT, nameR, isWhyOrWhyNot) {

    var triggerNameStart = nameT.substring(0, nameT.length - 1);
    $("#checkbox_"+nameR).prop('checked', true);
    if (ruleChange !== simulChange) {   
        if(isWhyOrWhyNot) {
            $("#changesTo_" + nameR.replace(regexID, '_') + "_" + triggerNameStart).removeClass('VerifiedValue');
            $("#changesTo_" + nameR.replace(regexID, '_') + "_" + triggerNameStart).addClass('notVerifiedValue');
            $('#' + nameR.replace(regexID, '_')).find('.trigHigh').removeClass('VerifiedValue');
            $('#' + nameR.replace(regexID, '_')).find('.trigHigh').addClass('notVerifiedValue');
        }       
        if($('#' + nameR.replace(regexID, '_')).hasClass("verified")) {
            $('#' + nameR.replace(regexID, '_')).removeClass("verified");
            $('#' + nameR.replace(regexID, '_')).addClass("notVerified");
            var rule = rules.find(item => item.ruleName === nameR);
            var verified = false;
            updateContextOfUse(triggerVerifiedAction, rule, verified);              
            $('#' + nameR.replace(regexID, '_')+'_why').remove();            
            $('#' + nameR.replace(regexID, '_')).find('.ruleName').append('<button id="' + nameR.replace(regexID, '_') + '_whyNot" class="btn whyNotButton"><span class="material-symbols-rounded">help</span><span class="labelEditRule"> '+ getSimulatorMsgLocale('Why Not') +'?</span></button>');
        }
    } else {
        if(isWhyOrWhyNot) {
            $("#changesTo_" + nameR.replace(regexID, '_') + "_" + triggerNameStart).removeClass('notVerifiedValue');        
            $("#changesTo_" + nameR.replace(regexID, '_') + "_" + triggerNameStart).addClass('VerifiedValue');  
            if (!$('#' + nameR.replace(regexID, '_')).find('.trigHigh').hasClass('notVerifiedValue')) {
                $('#' + nameR.replace(regexID, '_')).find('.trigHigh').removeClass('notVerifiedValue');
                $('#' + nameR.replace(regexID, '_')).find('.trigHigh').addClass('VerifiedValue');
            }
        }
        
    }
}

function containsAppliance(appliance1, appliance2) {
    if (!stringContains(appliance1, "/") || !stringContains(appliance2, "/"))
        return;

    var appliancePath1 = appliance1.split("/");
    var appliancePath2 = appliance2.split("/");

    var room1 = appliancePath1[1];
    var room2 = appliancePath2[1];

    var applianceName1 = appliancePath1[2];
    var applianceName2 = appliancePath2[2];

    return ((room1 !== room2) && (room1 === 'all' || room2 === 'all') && (
               ( (applianceName1 === 'light' || applianceName1 === 'lightColor' || applianceName1 === 'allLight') &&
                 (applianceName2 === 'light' || applianceName2 === 'lightColor' || applianceName2 === 'allLight')
               ) || (applianceName1 === applianceName2)));

}

function areSameContextEntities(trigger1, triggerArray) {
    for (var i = 0; i < triggerArray.length; i++) {
        if (triggerArray[i].element.xPath === trigger1.element.xPath ||
                triggerArray[i].element.originaltype === trigger1.element.originaltype)
            return true;
    }
    return false;
}

function getExplanationForTrigger(trigger, firstTime) {
    var contextEntityName = trigger.element.displayedName;
    var operator = "";
    var verb = "";
    if (trigger.changesTo)
        verb = " becomes ";
    else
        verb = " is ";
    switch (trigger.operator) {
        case "more":
            if(trigger.element.realName === 'LocalTime')
                operator = verb + " after";
            else
                operator = verb + trigger.operator + " than";
            break;
        case "less":
            if(trigger.element.realName === 'LocalTime')
                operator = verb + " before";
            else
                operator = verb + trigger.operator + " than";
            break;
        case "equal":
            operator = verb + " ";
            break;
        case "gt" :
            if(trigger.element.realName === 'LocalTime')
                operator = verb + " after";
            else
                operator = verb + " greater than"; 
            break;
        case "lt" :
            if(trigger.element.realName === 'LocalTime')
                operator = verb + " before";
            else
                operator = verb + " less than"; 
            break;        
        default:
            operator = verb + trigger.operator;
            break;
    }
    var value = trigger.value;
    var if_when = " ";
    if (firstTime) {
        if (trigger.changesTo) {
            if_when = "WHEN ";
        } else {
            if_when = "IF ";
        }
    } else {
        if_when = " AND ";
        if (trigger.changesTo){
            if_when += 'WHEN ';
        } else{
             if_when += 'IF ';
        }
   
    }
    return if_when + contextEntityName + " " + operator + " " + value;
}

function checkOverlap(trigger1, trigger2, conflictRule) {
    var value = trigger1.element.displayedName;
    
    if (conflictRule.explanation !== undefined) {
        //conflictRule.explanation = "conflict if ";
//        if (trigger1.changesTo)
//            conflictRule.explanation = " WHEN ";
//        else
//            conflictRule.explanation = " IF ";
conflictRule.explanation += " AND ";
    } else {
        conflictRule.explanation = "";
    }

    var secondOperatorState = '';
    if (trigger2.triggerType !== "undefined")
        secondOperatorState = " WHEN ";
    else
        secondOperatorState = " IF ";

    var verbT1 = "";
    if (trigger1.triggerType === "event")
        verbT1 = " becomes ";
    else
        verbT1 = " is ";
    var verbT2 = "";
    if (trigger2.triggerType === "event")
        verbT2 = " becomes ";
    else
        verbT2 = " is ";

    switch (trigger1.operator) {
        case "more":
        case "gt":
            var t1Val = parseInt(trigger1.value);
            var t2Val = parseInt(trigger2.value);
            switch (trigger2.operator) {
                case "more":
                case "gt":
                    var op = " more than ";
                    if(trigger1.element.realName === 'LocalTime' && trigger1.element.realName === trigger2.element.realName) {
                        op = " after ";
                    }
                    if (t1Val > t2Val) {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + op + t1Val + " ";
                    } else {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + op + t2Val + " ";
                    }
                    break;
                case "less":
                case "lt":
                    var op1 = " more than ";
                    if(trigger1.element.realName === 'LocalTime' && trigger1.element.realName === trigger2.element.realName) {
                        op1 = " after ";
                        op2 = " before ";
                    }
                    if (t2Val > t1Val) {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + op1 + t1Val + " AND "+ secondOperatorState  + value + verbT2 + op2 + t2Val + " ";
                    } else {
                        conflictRule.explanation = "no conflict";
                        return false;
                    }
                    break;
                case "equal":
                    if (t1Val >= t2Val) {
                        conflictRule.explanation += "no conflict";
                        return false;
                    } else {
                        conflictRule.explanation = secondOperatorState + value + verbT1 + /*" equal to "*/ + t2Val + " ";
                    }
                    break;
                case "different":
                    if (t1Val > t2Val) {
                        conflictRule.explanation +=secondOperatorState + value + verbT1 + " more than " + t1Val + " ";
                    } else {
                        conflictRule.explanation +=  secondOperatorState + value + verbT1 + " more than " + t1Val + " AND different from " + t2Val + " ";
                    }
                    break;
            }
            break;
        case "less":
        case "lt":
            var t1Val = parseInt(trigger1.value);
            var t2Val = parseInt(trigger2.value);
            switch (trigger2.operator) {
                case "less":
                case "lt":
                    var op = " more than ";
                    if(trigger1.element.realName === 'LocalTime' && trigger1.element.realName === trigger2.element.realName) {
                        op = " before ";
                    }
                    if (t1Val > t2Val) {
                        conflictRule.explanation +=secondOperatorState +  value + verbT2 + op + t2Val + " ";
                    } else {
                        conflictRule.explanation += value + verbT2 + op + t1Val + " ";
                    }
                    break;
                case "more":
                case "gt":
                    var op1 = " more than ";
                    var op2 = " less than ";
                    if(trigger1.element.realName === 'LocalTime' && trigger1.element.realName === trigger2.element.realName) {
                        op1 = " after ";
                        op2 = " before ";
                    }
                    if (t1Val > t2Val) {
                        conflictRule.explanation += secondOperatorState + value + verbT2 + " more than " + t2Val + " AND " + secondOperatorState + value + verbT1 + " less than " + t1Val + " ";
                    } else {
                        conflictRule.explanation = "no conflict";
                        return false;
                    }
                    break;
                case "equal":
                    if (t1Val > t2Val) {
                        conflictRule.explanation += secondOperatorState + value + verbT2 + /*"  equal to " +*/ t2Val + " ";
                    } else {
                        conflictRule.explanation = "no conflict";
                        return false;
                    }
                    break;
                case "different":
                    if (t1Val > t2Val) {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + " less than " + t1Val + " AND different from " + t2Val + " ";
                    } else {
                        conflictRule.explanation += secondOperatorState +  value + verbT1 + " less than " + t1Val + " ";
                    }
                    break;
            }
            break;
        case "equal":
            switch (trigger2.operator) {
                case "more":
                    var t1Val = parseInt(trigger1.value);
                    var t2Val = parseInt(trigger2.value);
                    if (t1Val > t2Val) {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + " equal to " + t1Val + " ";
                    } else {
                        conflictRule.explanation = "no conflict";
                        return false;
                    }
                    break;
                case "less":
                    if (t1Val > t2Val) {
                        conflictRule.explanation = "no conflict";
                        return false;
                    } else {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + " equal to " + t1Val + " ";
                    }
                    break;
                case "equal":
                    if (trigger1.value === trigger2.value) {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + " equal to " + trigger1.value + " ";
                    } else {
                        conflictRule.explanation = "no conflict";
                        return false;
                    }
                    break;
                case "different":
                    if (trigger1.value === trigger2.value) {
                        conflictRule.explanation = "no conflict";
                        return false;
                    } else {
                        conflictRule.explanation += secondOperatorState + value + verbT1 + " equal to " + trigger1.value + " ";
                    }
                    break;
            }
            break;
        case "different":
            switch (trigger2.operator) {
                case "more":
                    var t1Val = parseInt(trigger1.value);
                    var t2Val = parseInt(trigger2.value);
                    if (t1Val > t2Val) {
                        conflictRule.explanation += secondOperatorState + value + verbT2 + " more than " + t2Val + " AND different from " + t1Val + " ";
                    } else {
                        conflictRule.explanation = "no conflict";
                        return false;
                    }
                    break;
                case "less":
                    if (t1Val > t2Val) {
                        conflictRule.explanation = "no conflict";
                        return false;
                    } else {
                        conflictRule.explanation +=secondOperatorState +  value + verbT2 + " less than " + t2Val + " AND different from " + t1Val + " ";
                    }
                    break;
                case "equal":
                    if (trigger1.value === trigger2.value) {
                        conflictRule.explanation = "no conflict";
                        return false;
                    } else {
                        conflictRule.explanation +=secondOperatorState +  value + verbT2 + " equal to " + trigger2.value + " ";
                    }
                    break;
                case "different":
                    if (trigger1.value === trigger2.value) {
                        conflictRule.explanation +=secondOperatorState +  value + verbT1 + " equal to " + trigger1.value + " ";
                    } else {
                        conflictRule.explanation = "no conflict";
                        return false;
                    }
                    break;
            }
            break;
    }
    return true;
}

function getXPath(trigger) {
    if (trigger.xPath !== undefined)
        return trigger.xPath;
    else
        trigger.originalType;
}

function getRulesByName(ruleName) {
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].ruleName === ruleName)
            return rules[i];
    }
    return undefined;
}

function errorInformation(nameRule, ruleExamined){
    var html = '';
    for( var i = 0; i< ruleExamined.length; i++){
        if(ruleExamined[i].ruleName === nameRule ){
               html = createTexterrorInfo(ruleExamined[i]);
        }
    }
    $('#infoRules').append('<div id="whyInfo"><p class="titleInfo"><span class="material-symbols-rounded">help</span> Why Not?</p><ul>'+ html +'</ul></div>');
}

function createTexterrorInfo(ruleToBeExamined) { // TODO: add operetor in model notVerifiedTrigger
    var text = '';
    var rule_triggerName;
    var rule_trigger_value;
    var context_input;
    var changeTo_context;
    var changeTo_rule;
    var parentTrigger;
    
    var rule_operator;
    
    for (var i = 0; i < ruleToBeExamined.notVerifiedTrigger.length; i++) {
        if (getInput[ruleToBeExamined.notVerifiedTrigger[i].ref] !== undefined) {
            rule_triggerName = ruleToBeExamined.notVerifiedTrigger[i].nameD === undefined ? ruleToBeExamined.notVerifiedTrigger[i].name : ruleToBeExamined.notVerifiedTrigger[i].nameD;
            rule_trigger_value = ruleToBeExamined.notVerifiedTrigger[i].value;
            context_input = getInput[ruleToBeExamined.notVerifiedTrigger[i].ref].val;
            parentTrigger =  ruleToBeExamined.notVerifiedTrigger[i].parent;

            //console.log(getInput[ruleToBeExamined.notVerifiedTrigger[i].ref], ruleToBeExamined.notVerifiedTrigger[i]);
             
            switch( ruleToBeExamined.notVerifiedTrigger[i].operator){
                case 'equal':
                    rule_operator = 'equal to';
                    break;
                case 'more':
                    rule_operator = 'more then';
                    break;
                case 'less':
                    rule_operator = 'less then';
            }
            
            switch(ruleToBeExamined.notVerifiedTrigger[i].type){
                case 'tns:proximityType':
                case 'custom:string':
                    rule_operator='';
            }
                      
            text += '<li>Because in the rule <strong>' + rule_triggerName + '</strong> value is <strong>'+ rule_operator +' '+ rule_trigger_value +
                    '</strong> and in the context <strong>' + rule_triggerName + '</strong> is set to <strong> ' + (context_input === '' ? 'empty' : context_input) + '</strong>.</li>';
            
               
            var triggerType;
            if (ruleToBeExamined.notVerifiedTrigger[i].triggerType === "event")
               triggerType = true;
            else
               triggerType = false;
               
            if (getInput[ruleToBeExamined.notVerifiedTrigger[i].ref].changeTo !== triggerType) { // controllo se condizione o azione

                switch (getInput[ruleToBeExamined.notVerifiedTrigger[i].ref].changeTo) {
                    case true:
                        case true:
                        changeTo_context = 'Becomes (Event).';
                        break;
                    case false:
                        changeTo_context = 'Is (condition).';
                }

                switch (triggerType) {
                    case true:
                        changeTo_rule = 'Event (Becomes)';
                        break;
                    case false:
                        changeTo_rule = 'Condition (Is)';
                }

                //text += '<p> - You have select <strong>' + changeTo_context + '</strong> and ' + rule_triggerName + ' is ' + changeTo_rule+'</p>';
                
                 text += '<li>Because in the rule <strong>'+ rule_triggerName +'</strong> refers to a  <strong>' + changeTo_rule + ',</strong> while in the context you have selected <strong>' + changeTo_context + '</strong></li>';
                
                // The rule refers to a condition(Is) while in the context you have selected an Event(Becomes).
                       
            } 
        }
    }
    
     if(ruleToBeExamined.VerifiedTrigger.length>0){
    for(var j = 0; j<ruleToBeExamined.VerifiedTrigger.length; j++){
        
               rule_triggerName = ruleToBeExamined.VerifiedTrigger[j].nameD === undefined ? ruleToBeExamined.VerifiedTrigger[j].name : ruleToBeExamined.VerifiedTrigger[j].nameD;
              rule_trigger_value = ruleToBeExamined.VerifiedTrigger[j].value;
              context_input = getInput[ruleToBeExamined.VerifiedTrigger[j].ref].val;
              
               var triggerType;
               if (ruleToBeExamined.VerifiedTrigger[i] !== undefined){
                  if (ruleToBeExamined.VerifiedTrigger[i].triggerType === "event")
                     triggerType = true;
                  else
                     triggerType = false;
               }
               if (ruleToBeExamined.VerifiedTrigger[j] !== undefined){
                  if (ruleToBeExamined.VerifiedTrigger[j].triggerType === "event")
                     triggerType = true;
                  else
                     triggerType = false;
               }
          
                if (getInput[ruleToBeExamined.VerifiedTrigger[j].ref].changeTo !== triggerType) { // controllo se condizione o azione

                switch (getInput[ruleToBeExamined.VerifiedTrigger[j].ref].changeTo) {
                    case true:
                        changeTo_context = 'Becomes (Event)';
                        break;
                    case false:
                        changeTo_context = 'Is (condition)';
                }

                switch (triggerType) {
                    case true:
                        changeTo_rule = 'Event (Becomes)';
                        break;
                    case false:
                        changeTo_rule = 'Condition (Is)';
                }

                text += '<li>Because in the rule <strong>'+ rule_triggerName +'</strong> refers to a  <strong>' + changeTo_rule + ',</strong> while in the context you have selected <strong>' + changeTo_context + '</strong></li>';
   
            }
            }
    }

    return text;
}

function WhyAction(key, obj) {

    var singleRule_get = [];

    for (var i = 0; i < obj.length; i++) {

        $('#' + obj[i].ruleName.replace(regexID, '_')).hide();
        $('label[for="checkbox_'+obj[i].ruleName.replace(regexID, '_')+'"]').hide();

        if (key === obj[i].ruleName) {
            singleRule_get.push(obj[i]);
            $('label[for="checkbox_'+key.replace(regexID, '_')+'"]').show();
            $('#' + key.replace(regexID, '_')).show();
            /*
            $('#tree').treeview({
                data: getTree(singleRule_get, true),
                onNodeSelected: function (event, data) {
                    return false;
                }
            });*/
            
            //console.log(arrayTriggerNotVerified,singleRule_get);
            nameGlobal = key;
            for (var j = 0; j < arrayTriggerNotVerified.length; j++) {

                if (arrayTriggerNotVerified[j].ruleName === key) {

                    whyNotView(key, arrayTriggerNotVerified[j], singleRule_get);

                }
            }
            
          
            actionbuttoncontex(false);
        }
    }
}

function whyNotView(ruleName, triggerNotVerified, currentRule) { // modifica la vista colorando i trigger interessati

    nameGlobal = ruleName;
    $("#verifiedRules").html("Analysis of the selected rule:");
    var arrayIndex = new Array();
    for (var i = 0; i < triggerNotVerified.VerifiedTrigger.length; i++) {    
        /*chi mod background : #b5ee7b */               
        
        $('#' + triggerNotVerified.VerifiedTrigger[i].ref).parent().parent('li').css({'background': '#C7EF9F', 'color': 'blacks'});
        
        $('#' + ruleName  + ' .wordTrigger').each(function(index, el) {
            var type;
            var trigger = triggerNotVerified.VerifiedTrigger[i];
            if(trigger.triggerType === "event"){
                type = "becomes";
            }
            if(trigger.triggerType === "condition") {
                type = "is";
            }
            if(el.innerText === "IF" && type === "is"){
                el.style.color = '#107012';
                el.style.fontWeight = '1000';
            }
            if(el.innerText === "WHEN" && type === "becomes"){
                el.style.color = '#107012';
                el.style.fontWeight = '1000';
            }
            if(el.innerText === trigger.value.toLowerCase() || el.innerText === type || trigger.realName.toLowerCase().includes(el.innerText) || el.innerText === trigger.parent || trigger.ref.includes(el.innerText.toLowerCase())){
                el.style.color = '#107012';
                el.style.fontWeight = '1000';
            }
        });
        
        if(triggerNotVerified.VerifiedTrigger[i].ref === 'undefined') {
                return;
        }
        var triggerType;
        if (triggerNotVerified.VerifiedTrigger[i].triggerType === "event")
          triggerType = true;
        else
           triggerType = false;
        var radioValue = ($('#' + triggerNotVerified.VerifiedTrigger[i].ref).parent().find('.active').val() === 'becomes');
        if(radioValue !== triggerType){
            $('#' + (triggerNotVerified.VerifiedTrigger[i].realName +"-"+triggerNotVerified.VerifiedTrigger[i].parent.replace(/_.*/, '')).toLowerCase()+"_changesTo").css("border", "3px solid red");
            $('#' + triggerNotVerified.VerifiedTrigger[i].ref).parent().parent('li').css({'background': '#F9D1D1', 'color': 'black'});
            currentRule[0].triggers.forEach(function(trigger, i) { 
                triggerNotVerified.VerifiedTrigger.forEach(function(triggerVerif, index) { 
                    if (trigger.element && trigger.element.displayedName === triggerVerif.nameD && !$('#' + triggerVerif.ref).parent().parent('li').css('background').includes('rgb(199, 239, 159') 
) {
                        arrayIndex.push(i);    
                    }
                });
            });
            arrayIndex.forEach(function(el, i){
                $('[class*="trigger_'+el+'"] [class="wordTrigger"]').each(function(){
                    //triggerNotVerified.verifiedTrigger[j].value.toLowerCase()
                    if(triggerNotVerified.VerifiedTrigger[i] !== undefined){
                        if( triggerNotVerified.VerifiedTrigger[i].nameD.toLowerCase().includes($(this).text()) || triggerNotVerified.VerifiedTrigger[i].ref.includes($(this).text().toLowerCase())  || triggerNotVerified.VerifiedTrigger[i].parent === $(this).text() || ( "is" === $(this).text() || $(this).text() === "becomes" )){
                           $(this).css({'color': 'red', 'font-weight': '1000'});
                           if ( "is" === $(this).text()) {
                               $('[class*="trigger_'+el+'"] .keyWordTrigger_if').css({'color': 'red', 'font-weight': '1000'});
                           }
                           else if ( "becomes" === $(this).text()) {
                               $('[class*="trigger_'+el+'"] .keyWordTrigger_when').css({'color': 'red', 'font-weight': '1000'});
                           }    
                        }  
                    }
                });
            });
                
        } else {
            $('#' + (triggerNotVerified.VerifiedTrigger[i].realName +"-"+triggerNotVerified.VerifiedTrigger[i].parent).toLowerCase()+"_changesTo").css("border", "none");
            $('#' + triggerNotVerified.VerifiedTrigger[i].ref).parent().parent('li').css({'background': '#C7EF9F', 'color': 'black'});
        }
    }
    var arrayIndex = new Array();
    for (var j = 0; j < triggerNotVerified.notVerifiedTrigger.length; j++) {         
        if(triggerNotVerified.notVerifiedTrigger[j].ref === 'undefined') {
                return;
        }

        $('#' + triggerNotVerified.notVerifiedTrigger[j].ref).css("border", "3px solid red");
        $('#' + triggerNotVerified.notVerifiedTrigger[j].ref).parent().parent('li').css({'background': '#F9D1D1', 'color': 'black'});
        
        currentRule[0].triggers.forEach(function(trigger, i) { 
            triggerNotVerified.notVerifiedTrigger.forEach(function(triggerNotVerif, index) { 
                if (trigger.element && trigger.element.displayedName === triggerNotVerif.nameD) {
                    arrayIndex.push(i);    
                }
            });
        }); 
        arrayIndex.forEach(function(el, i){
            $('[class*="trigger_'+el+'"] [class="wordTrigger"]').each(function(){
                if($(this).text() === triggerNotVerified.notVerifiedTrigger[j].value.toLowerCase() || triggerNotVerified.notVerifiedTrigger[j].ref.includes($(this).text()) || triggerNotVerified.notVerifiedTrigger[j].nameD.toLowerCase().includes($(this).text()) || triggerNotVerified.notVerifiedTrigger[j].parent === $(this).text() ){
                   $(this).css({'color': 'red', 'font-weight': '1000'});
                }  
            });
        });
        arrayIndex.forEach(function(el, i){ 
            if ($('[class*="trigger_'+el+'"] .keyWordTrigger_if').css('color') !== "rgb(255, 0, 0)"){
                $('[class*="trigger_'+el+'"] .keyWordTrigger_if').css({'color': 'rgb(16, 112, 18)', 'font-weight': '1000'});
                $('[class*="trigger_'+el+'"] [class="wordTrigger"]').each(function(){
                    if($(this).text() === "is"){
                        $(this).css({'color': 'rgb(16, 112, 18)', 'font-weight': '1000'});
                    }
                });
            }
            if ($('[class*="trigger_'+el+'"] .keyWordTrigger_when').css('color') !== "rgb(255, 0, 0)"){
                $('[class*="trigger_'+el+'"] .keyWordTrigger_when').css({'color': 'rgb(16, 112, 18)', 'font-weight': '1000'});
                $('[class*="trigger_'+el+'"] [class="wordTrigger"]').each(function(){
                    if($(this).text() === "becomes"){
                        $(this).css({'color': 'rgb(16, 112, 18)', 'font-weight': '1000'});
                    }
                });
            }
        });
        
        var triggerType;
        if(triggerNotVerified.notVerifiedTrigger[i] !== undefined) {
            if (triggerNotVerified.notVerifiedTrigger[i].triggerType === "event")
               triggerType = true;
            else
               triggerType = false;
         }
        if(triggerNotVerified.notVerifiedTrigger[j] !== undefined) {
            if (triggerNotVerified.notVerifiedTrigger[j].triggerType === "event")
               triggerType = true;
            else
               triggerType = false;
         }
        if(getInput[triggerNotVerified.notVerifiedTrigger[j].ref].changeTo !== triggerType){
             $('#' + (triggerNotVerified.notVerifiedTrigger[j].realName + "-" + triggerNotVerified.notVerifiedTrigger[j].parent.replace(/_.*/, '')).toLowerCase() +"_changesTo").css("border", "3px solid red");    
             if(triggerNotVerified.notVerifiedTrigger[j].triggerType === "event"){
                arrayIndex.forEach(function(el, i){ 
                    $('[class*="trigger_'+el+'"] .wordTrigger').each(function(){
                        if($(this).text() === "becomes" ){
                           $(this).css({'color': 'red', 'font-weight': '1000'});
                           $('[class*="trigger_'+el+'"] .wordTrigger.keyWordTrigger_when').css('color', 'red');     
                        }  
                     });
                });     
             }
             else {
                arrayIndex.forEach(function(el, i){
                    $('[class*="trigger_'+el+'"] [class="wordTrigger"]').each(function(){
                       if($(this).text() === "is" ){
                          $(this).css({'color': 'red', 'font-weight': '1000'});
                          $('[class*="trigger_'+el+'"] .wordTrigger.keyWordTrigger_if').css('color', 'red');    
                       }  
                    });
                });
             }
        } else {
              $('#' + triggerNotVerified.notVerifiedTrigger[j].ref+"_changesTo").css("border", "none");              
        }
    }
     
}

function actionbuttoncontex(whyMode) {
    if (whyMode === false) {
        $("#buttonContainer").hide();
        $("#contexButtonWhy").show();
    } else {
        $("#buttonContainer").show();
        $("#contexButtonWhy").hide();
    }
}

function stringContains(str1, str2) {
    return str1.indexOf(str2) !== -1;
}

function updateContextOfUse(triggerVerifiedAction, rule, verified) {  //aggiorno il form del contesto con i nuovi valori ricavati dai trigger verificati e evidenzio di arancione i cambiamenti
    triggerVerifiedAction.forEach(function(action) {
        var operatorAction = action.operator.charAt(0).toUpperCase() + action.operator.slice(1);
        if (operatorAction === "TurnOn"){
            operatorAction = "On";
        }
        if (operatorAction === "TurnOff"){
            operatorAction = "Off";
        }
        if (operatorAction === "Is"){
            operatorAction = "On";
        }
        var idDiv, divElement, selectElement;
        if (verified) {
            detectIndirectRuleChain(rule);
            idDiv = (action.parent + "_" + action.action.realName + "_" + action.action.dimension).toLowerCase();
            if(action.type === 'invokeFunctions:changeApplianceState')
                idDiv = (action.action.realName + "_" + 'state' + "_" + action.action.dimension).toLowerCase();
            if(action.type === 'update:lightColor') {
                idDiv = (action.action.realName+"_state_"+action.action.dimension).toLowerCase().replace(/\s+/g, '');
                var idDiv2 = (action.parent + "_"+action.action.realName+"_state_"+action.action.dimension).toLowerCase().replace(/\s+/g, '');
            }
            if(action.type === "invokeFunctions:startRoutine") {
                idDiv = "alexa_state_technology";
            }
            if ($("#" + idDiv).length > 0) {
                divElement = $("#" + idDiv);
            }
            if ($("#" + idDiv2).length > 0) {
                divElement = $("#" + idDiv2);
            }
            if (action.action.xPath.includes("all","window")){
                divElement = $('[id*=windowsensor]');
            }
            if (action.action.xPath.includes("allLight")){
                divElement = $('[id*=light]');
            }
            if (divElement !== undefined){
                selectElement = divElement.children("select");
               
                var index = actionUpdateContextUse.findIndex(item => item.actionRuleName === rule.ruleName);
                if (!selectElement.hasClass('ruleChain')) {
                    selectElement.val(operatorAction)
                        .attr("class", `form-control inputTrigger ruleChain ${rule.ruleName}-${index}`)
                        .css("border", "3px solid #24BC33");
                }
                if(selectElement.val() !== operatorAction && rule.actions[0] === action){
                    selectElement.val(operatorAction);
                    var className = 'ruleChain:'+rule.ruleName+'-'+index;
                    selectElement.addClass(className);
                    isLoopArray.push({ ruleName: rule.ruleName, selectElement: selectElement });
                }
                divElement.find("div[class='radioGroup']").css("border", "3px solid #24BC33");
                divElement.find("input[value='is']").removeClass("active").prop("checked", false); 
                divElement.find("input[value='is']").removeClass("active").removeAttr("checked");
                divElement.find("input[value='becomes']").attr("class","radio active");
                divElement.find("input[value='becomes']").prop('checked', true);  
                divElement.find("input[value='becomes']").attr("checked", "checked");
            }
        } else {
            idDiv = (rule.actions[0].parent + "_" + rule.actions[0].action.realName + "_" + rule.actions[0].action.dimension).toLowerCase();
            if (rule.actions[0].action.xPath){
                if(rule.actions[0].action.type === 'invokeFunctions:changeApplianceState')
                    idDiv = (rule.actions[0].action.realName + "_" + 'state' + "_" + rule.actions[0].action.dimension).toLowerCase();
            }
            if ($("#" + idDiv).length > 0) {
                divElement = $("#" + idDiv);
            }
            if (divElement !== undefined){
                selectElement = divElement.children("select");
                var idSelect = selectElement.attr('id');
                if (formValue.hasOwnProperty(idSelect)) {
                    selectElement.val(formValue[idSelect].value);
                } else {
                    selectElement.val('');
                }
                selectElement.css("border", "1px solid #ccc").removeClass("ruleChain");
                divElement.find("div[class='radioGroup']").css("border", "none");
                var inputElement = divElement.find("input[class='radio active']").attr('id');
                var idInput; 
                if (inputElement !== undefined) {
                    idInput = (divElement.find("input[class='radio active']").attr('id')).replace(/_becomes$|_is$/, '');
                }
                else {
                    idInput = undefined;
                }
                var foundKey = Object.keys(formValue).find(function(key) {
                    return key.startsWith(idInput+"_");
                });
                var foundValue = foundKey ? formValue[foundKey] : null;
                    if(foundValue){
                        divElement.find("input[id='"+foundKey+"']").attr("class","radio active").prop("checked", true); 
                        divElement.find('input:not([id="' + foundKey + '"])').removeClass("active").prop("checked", false); 
                    }
                var index = actionUpdateContextUse.findIndex(item => item.actionRuleName === rule.ruleName);
                $(".form-control.inputTrigger.ruleChain." + rule.ruleName + "-" + index).attr("class", "form-control inputTrigger");
                actionUpdateContextUse = actionUpdateContextUse.filter(item => item.actionRuleName !== rule.ruleName);
            }
        }
    });
}

function detectIndirectRuleChain(rule){
    var canActivateTrigger;
    semantic.action.forEach(function(azione){
        if(azione.realName !== "Devices"){        //TODO: cerca una soluzione migliore
          azione.nodes.forEach(function(nodo){
             if(nodo.realName === rule.actions[0].parent){ 
                if(nodo.attributes !== undefined){ 
                    nodo.attributes.forEach(function(attributo){
                       if(attributo.realName === rule.actions[0].action.realName){
                           canActivateTrigger = attributo.canActivate;
                       }
                    });
                }
            }
         });
        }
        else {
            azione.nodes.forEach(function(nodo){
              if(nodo.realName === rule.actions[0].action.realName){
                  canActivateTrigger = nodo.canActivate;
              }
            });
        }
    });
    selectedRules.forEach(function(currentRule){
        currentRule.triggers.forEach(function(trigger){
            if(canActivateTrigger !== undefined){
                canActivateTrigger.forEach(function(trigger2){
                    if(trigger2.trigger === trigger.element.realName){
                        var indirectActivationInfo = {
                            rule: rule.ruleName,
                            ruleAction: rule.naturalLanguage.split(",")[1].trim(),
                            ruleActivated: currentRule.ruleName,
                            ruleActivatedTrigger :currentRule.naturalLanguage.split(",")[0].trim(),
                            why: trigger2.why
                        };
                        arrayIndirectActivation.push(indirectActivationInfo);
                    }
                });      
            }
        });
    }); 
}

var iconWarningOrange = '<svg width="33" height="35" viewBox="0 0 33 35" fill="none" style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg"><g id="Component 1"><path id="Polygon 1" d="M16.5 0L30.7894 26.25H2.21058L16.5 0Z" fill="#F6E871"/><g id="&#240;&#159;&#166;&#134; icon &#34;warning&#34;"><path id="Vector" d="M31.1185 25.6665L31.1171 25.6691C30.8543 26.1339 30.4732 26.5197 30.0133 26.787C29.5533 27.0543 29.031 27.1934 28.5 27.1902H28.4985H4.49608C3.96528 27.1902 3.44375 27.0496 2.98396 26.7824C2.52415 26.5152 2.14224 26.1309 1.87679 25.6678C1.61132 25.2048 1.47174 24.6795 1.47217 24.1448C1.4726 23.6101 1.61304 23.085 1.87926 22.6224L13.8805 1.76803C14.1463 1.30617 14.528 0.922899 14.9873 0.656525C15.4466 0.390158 15.9673 0.25 16.4973 0.25C17.0273 0.25 17.548 0.390158 18.0073 0.656525C18.4666 0.922899 18.8483 1.30617 19.1141 1.76803L31.1153 22.6223L31.1161 22.6236C31.3852 23.0848 31.5273 23.6098 31.5277 24.1447C31.5282 24.6797 31.3869 25.2049 31.1185 25.6665ZM29.6597 23.4727L29.6597 23.4727L17.6585 2.61836L17.4439 2.74187L17.6585 2.61835C17.5408 2.4139 17.3717 2.24399 17.1678 2.12579C16.964 2.00759 16.7328 1.94531 16.4973 1.94531C16.2618 1.94531 16.0306 2.00759 15.8267 2.12579C15.6229 2.24399 15.4538 2.4139 15.3361 2.61835L15.3361 2.61836L3.33489 23.4727L3.33488 23.4727C3.21707 23.6775 3.15501 23.9097 3.15483 24.1461C3.15465 24.3825 3.21637 24.6149 3.33386 24.8198C3.45137 25.0248 3.62057 25.1952 3.82459 25.3138C4.02861 25.4324 4.2602 25.4949 4.49604 25.4949H4.49608H28.4985H28.4985C28.7344 25.4949 28.966 25.4324 29.17 25.3138C29.374 25.1952 29.5432 25.0248 29.6607 24.8198C29.7782 24.6149 29.8399 24.3825 29.8398 24.1461C29.8396 23.9097 29.7775 23.6775 29.6597 23.4727ZM15.656 16.4648V9.87886C15.656 9.65358 15.745 9.43782 15.9029 9.27897C16.0608 9.12016 16.2746 9.03121 16.4973 9.03121C16.72 9.03121 16.9338 9.12016 17.0917 9.27897C17.2496 9.43782 17.3386 9.65358 17.3386 9.87886V16.4648C17.3386 16.69 17.2496 16.9058 17.0917 17.0647C16.9338 17.2235 16.72 17.3124 16.4973 17.3124C16.2746 17.3124 16.0608 17.2235 15.9029 17.0647C15.745 16.9058 15.656 16.69 15.656 16.4648ZM15.7273 20.2427C15.9553 20.0895 16.2231 20.0078 16.497 20.0077H16.497C16.8644 20.0081 17.2168 20.1551 17.477 20.4168C17.7371 20.6784 17.8838 21.0335 17.8843 21.4042C17.8843 21.6807 17.8027 21.9509 17.6501 22.1806C17.4976 22.4103 17.2809 22.589 17.0276 22.6946C16.7743 22.8001 16.4957 22.8277 16.227 22.7739C15.9582 22.7201 15.7111 22.5874 15.5171 22.3922C15.323 22.197 15.1907 21.9481 15.137 21.6769C15.0834 21.4057 15.1109 21.1247 15.2161 20.8693C15.3213 20.614 15.4992 20.396 15.7273 20.2427Z" fill="#272727" stroke="#272727" stroke-width="0.5"/></g></g></svg>';
var iconWarningGreen = '<svg width="33" height="35" viewBox="0 0 33 35" fill="none" style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg"><g id="Component 1"><path id="Polygon 1" d="M16.5 0L30.7894 26.25H2.21058L16.5 0Z" fill="#BCED8A"/><g id="&#240;&#159;&#166;&#134; icon &#34;warning&#34;"><path id="Vector" d="M31.1185 25.6665L31.1171 25.6691C30.8543 26.1339 30.4732 26.5197 30.0133 26.787C29.5533 27.0543 29.031 27.1934 28.5 27.1902H28.4985H4.49608C3.96528 27.1902 3.44375 27.0496 2.98396 26.7824C2.52415 26.5152 2.14224 26.1309 1.87679 25.6678C1.61132 25.2048 1.47174 24.6795 1.47217 24.1448C1.4726 23.6101 1.61304 23.085 1.87926 22.6224L13.8805 1.76803C14.1463 1.30617 14.528 0.922899 14.9873 0.656525C15.4466 0.390158 15.9673 0.25 16.4973 0.25C17.0273 0.25 17.548 0.390158 18.0073 0.656525C18.4666 0.922899 18.8483 1.30617 19.1141 1.76803L31.1153 22.6223L31.1161 22.6236C31.3852 23.0848 31.5273 23.6098 31.5277 24.1447C31.5282 24.6797 31.3869 25.2049 31.1185 25.6665ZM29.6597 23.4727L29.6597 23.4727L17.6585 2.61836L17.4439 2.74187L17.6585 2.61835C17.5408 2.4139 17.3717 2.24399 17.1678 2.12579C16.964 2.00759 16.7328 1.94531 16.4973 1.94531C16.2618 1.94531 16.0306 2.00759 15.8267 2.12579C15.6229 2.24399 15.4538 2.4139 15.3361 2.61835L15.3361 2.61836L3.33489 23.4727L3.33488 23.4727C3.21707 23.6775 3.15501 23.9097 3.15483 24.1461C3.15465 24.3825 3.21637 24.6149 3.33386 24.8198C3.45137 25.0248 3.62057 25.1952 3.82459 25.3138C4.02861 25.4324 4.2602 25.4949 4.49604 25.4949H4.49608H28.4985H28.4985C28.7344 25.4949 28.966 25.4324 29.17 25.3138C29.374 25.1952 29.5432 25.0248 29.6607 24.8198C29.7782 24.6149 29.8399 24.3825 29.8398 24.1461C29.8396 23.9097 29.7775 23.6775 29.6597 23.4727ZM15.656 16.4648V9.87886C15.656 9.65358 15.745 9.43782 15.9029 9.27897C16.0608 9.12016 16.2746 9.03121 16.4973 9.03121C16.72 9.03121 16.9338 9.12016 17.0917 9.27897C17.2496 9.43782 17.3386 9.65358 17.3386 9.87886V16.4648C17.3386 16.69 17.2496 16.9058 17.0917 17.0647C16.9338 17.2235 16.72 17.3124 16.4973 17.3124C16.2746 17.3124 16.0608 17.2235 15.9029 17.0647C15.745 16.9058 15.656 16.69 15.656 16.4648ZM15.7273 20.2427C15.9553 20.0895 16.2231 20.0078 16.497 20.0077H16.497C16.8644 20.0081 17.2168 20.1551 17.477 20.4168C17.7371 20.6784 17.8838 21.0335 17.8843 21.4042C17.8843 21.6807 17.8027 21.9509 17.6501 22.1806C17.4976 22.4103 17.2809 22.589 17.0276 22.6946C16.7743 22.8001 16.4957 22.8277 16.227 22.7739C15.9582 22.7201 15.7111 22.5874 15.5171 22.3922C15.323 22.197 15.1907 21.9481 15.137 21.6769C15.0834 21.4057 15.1109 21.1247 15.2161 20.8693C15.3213 20.614 15.4992 20.396 15.7273 20.2427Z" fill="#272727" stroke="#272727" stroke-width="0.5"/></g></g></svg>';

function updateInfoIndirectRuleChain(indirectActivation){
    $infoRules.append('<div class="infoTitle">'+iconWarningOrange+'<span id="infoDirectRule"> Possible Indirect Rule Activation: </span></div><div class="whyInfoIndirectRuleChain whyInfo"></div>');

    var text = "";
    indirectActivation.forEach(function(info){
        if(info.rule !== info.ruleActivated){
            $('#' + info.ruleActivated).css("background-color", "#F6E871").addClass("possibleVerified");
            text += "<li>The execution of <i>"+info.rule + "</i> (<strong>"+info.ruleAction+"</strong>) can activate <i>" + info.ruleActivated + "</i> (<strong>"+info.ruleActivatedTrigger.toLowerCase()+"</strong>) because " + info.why.toLowerCase() + ".</li>";
        }
    });
    if(text!==""){
        $infoRules.find('.whyInfoIndirectRuleChain').append("<ul>"+text+"</ul>");
    } else {
        $('#whyInfo').remove();
    }
}

function updateInfoDirectRuleChain(actionUpdateContextUse) { //stampa avviso dei cambiamenti nel contesto simulato dovuti alla rule chain
    $infoRules.append('<div class="infoTitle">'+iconWarningGreen+'<span id="infoDirectRule"> Direct Rule Activation: </span><span id="loopWarning"></span></div><div class="whyInfoRuleChain whyInfo"></div>');
    var textArray = [];
    actionUpdateContextUse.forEach(function(action) {
        action.triggers.forEach(function(trigger) {
            var phrases = action.textAction.toLowerCase().split(',');
            var isAlexa = phrases.some(phrase => phrase.includes('do launch alexa'));
            if (isAlexa){
                phrases = phrases.map(phrase => {
                    if (phrase.includes('do launch alexa')) {
                        return phrase.replace('do launch alexa', 'do turn on alexa');
                    }
                    return phrase;
                });
            }
            var parent = trigger.parentTrigger.replace(/_.*$/, '');
            var textAction = phrases.find(phrase => phrase.replace(/\s+/g, '').includes(trigger.valueTrigger) && phrase.replace(/\s+/g, '').includes(parent));
            if(action.textAction.includes('all')){
                if(action.textAction.includes('window')){
                    textAction = phrases.find(phrase => phrase.replace(/\s+/g, '').includes(trigger.valueTrigger) && phrase.includes('window'));
                }
                if(action.textAction.includes('light')){
                    textAction = phrases.find(phrase => phrase.replace(/\s+/g, '').includes(trigger.valueTrigger) && phrase.includes('light'));
                }
            }
            if (textAction !== undefined){
                textArray.push("<li>The execution of <i>"+action.actionRuleName+"</i> (<strong>"+textAction.trim().toLowerCase()+"</strong>) triggered <i>"+trigger.triggeredRuleName+"</i> (<strong>"+trigger.textTrigger.toLowerCase()+"</strong>) and now "+trigger.textActionActivated+".</li>");
            }
        }); 
    });
    $infoRules.find('.whyInfoRuleChain').append("<ul>"+textArray.join('')+"</ul>");
    loopDetector(actionUpdateContextUse);
}

//rilevatore di loop nelle esecuzioni delle regole
function loopDetector(actionUpdateContextUse){
    actionUpdateContextUse = actionUpdateContextUse.filter(elemento => {
        var rule1 = elemento.actionRuleName;
        return !elemento.triggers.some(trigger => trigger.triggeredRuleName === rule1);
    });
    
    var graph = {};

    actionUpdateContextUse.forEach(function(action) {
      var ruleName = action.actionRuleName;
      var triggeredRules = action.triggers.map(function(trigger) {
        return trigger.triggeredRuleName;
      });

      graph[ruleName] = triggeredRules;
    });

    var isLoop = isCyclic(graph);
 
    if(isLoop){
        loopInfo();
    }
}

function isCyclic(graph) {
  var visited = [];
  var stack = [];

  function hasCycle(node) {
    visited[node] = true;
    stack[node] = true;

    if (graph[node]) {
      for (var i = 0; i < graph[node].length; i++) {
        var neighbor = graph[node][i];

        if (!visited[neighbor]) {
          if (hasCycle(neighbor)) {
            return true;
          }
        } else if (stack[neighbor]) {
          return true;
        }
      }
    }

    stack[node] = false;
    return false;
  }

  for (var node in graph) {
    if (!visited[node] && hasCycle(node)) {
      return true;
    }
  }

  return false;
}

function loopInfo(){
    var ruleNameCount = {}; // Conteggio dei ruleName
    var selectError = null; 
    isLoopArray.forEach(item => {
      // Controlla se il ruleName è già stato registrato
      if (ruleNameCount[item.ruleName]) {
        // Controlla se il selectElement è uguale a quello del duplicato precedente
        if (item.selectElement === selectError.selectElement) {
          console.log("Hai almeno due valori di ruleName che si ripetono con lo stesso selectElement.");
        }
      } else {
        ruleNameCount[item.ruleName] = 1;
      }
      if (!selectError) {
        selectError = item;
      }
    });
    selectError.selectElement.css({'border': '3px solid red'}).val("");
    var html = "<span id='loopDetectionTitle'>  Loop Detected</span>";
    $('#loopWarning').append(html);
}

function loadProfileConfigurationFiles() {
    var token = $("#logoutForm > input").val();
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        url: 'rest/simulator/getFileList',
        success: function (response)
        {
            $('#selectConf > option').remove();
            for (var i = 0; i < response.length; i++) {
                $('#selectConf')
                        .append($("<option></option>")
                                .attr("value", response[i])
                                .text(response[i]));
            }
        }

    });
}

$(document).on('click', 'input[type="radio"]', function () {

    var name = $(this).attr('name');
    var id = $(this).attr('id');
    var value = $(this).attr('value');
    var parent = $(this).parent().attr('class').split(' ').pop();

    if (value === 'is') {
        $('input[name="' + name + '"][value="' + value + '"]').remove();
        $('input[name="' + name + '"][value="becomes"]').remove();
        $('.' + parent).prepend('<input  id="' + name + '_is" class="radio active" type="radio" name="' + name + '" checked="checked" value="is" />');
        $('.' + name + '_becomes').prepend('<input id="' + name + '_becomes" class="radio" type="radio" name="' + name + '"  value="becomes" />');
    } else if (value === 'becomes') {
        $('input[name="' + name + '"][value="' + value + '"]').remove();
        $('input[name="' + name + '"][value="is"]').remove();
        $('.' + parent).prepend('<input id="' + name + '_becomes" type="radio" class="radio active" name="' + name + '" checked="checked" value="becomes" />');
        $('.' + name + '_is').prepend('<input id="' + name + '_is" class="radio" type="radio" name="' + name + '"  value="is" />');
    }
});

$(document).on('click', '.radioLabel', function(){
    var name = $(this).children().attr('name');
    var id = $(this).children().attr('id');
    var value = $(this).children().attr('value');
    var parent = $(this).attr('class').split(' ').pop();
    
    if (value === 'is') {
        $('input[name="' + name + '"][value="' + value + '"]').remove();
        $('input[name="' +  name + '"][value="becomes"]').remove();
        $('.' + parent).prepend('<input  id="' + name + '_is" class="radio active" type="radio" name="' + name + '" checked="checked" value="is" />');
        $('.' + name + '_becomes').prepend('<input id="' + name + '_becomes" class="radio" type="radio" name="' + name + '"  value="becomes" />');
    } else if (value === 'becomes') {
        $('input[name="' + name + '"][value="' + value + '"]').remove();
        $('input[name="' + name + '"][value="is"]').remove();
        $('.' + parent).prepend('<input id="' + name + '_becomes" type="radio" class="radio active" name="' + name + '" checked="checked" value="becomes" />');
        $('.' + name + '_is').prepend('<input id="' + name + '_is" class="radio" type="radio" name="' + name + '"  value="is" />');
    }
});

//salvo le configurazioni dell'utente e mando al server per salvare sul file
$('#saveConf').on('click', function () {

    $('.inputTrigger').each(function () {

        var changeConf = false;
        var idValueTrigger = $(this).attr('id');
        var valuetrigger = $('#' + idValueTrigger).val();

        var name = idValueTrigger.indexOf('-');
        var nameRadio = idValueTrigger.substring(0, name);

        var valRadio = $('input[name="' + nameRadio + '"].active').attr('value');

        if (valRadio === 'becomes') {
            changeConf = true;
        } else if (valRadio === 'is') {
            changeConf = false;
        }

        simulatorValue[idValueTrigger] = {
            val: valuetrigger,
            changeTo: changeConf
        };
    });


    var fileName = $('#nameConf').val();

    if (fileName !== '') {

        var url = 'rest/simulator/save/fileName/' + fileName;

        var token = $("#logoutForm > input").val();

        $.ajax({// invio l'oggetto al server

            headers: {
                'Accept': 'application/json',
                'Content-Type': "text/plain",
                'X-CSRF-TOKEN': token
            },
            type: "POST",
            url: url,
            'dataType': 'json',
            data: JSON.stringify(simulatorValue),
            success: function (response)
            {
                console.log('succes', response, simulatorValue);
                $('#alertSave').html('');
                $('#alertSave').html('<div class="alert alert-success">File saved</div>');
            },
            error: function (err) {
                console.log(err);
                $('#alertSave').html('<div class="alert alert-danger">' + err + '</div>');
            }
        });

    } else {
        $('#alertSave').html('');
        $('#alertSave').html('<div class="alert alert-danger">Input Text is empty</div>');
    }

});

$('#loadConf').on('click', function () {

    var fileName = $('#selectConf').val();

    var token = $("#logoutForm > input").val();

    $.ajax({
        type: "GET",
        headers: {
            'X-CSRF-TOKEN': token
        },
        url: "rest/simulator/get/file/" + fileName,

        success: function (response)
        {
            var data = JSON.parse(response);

            simulatorValue = data;

            $('.inputTrigger').each(function () {


                var idValueTrigger = $(this).attr('id');
                var valuetrigger = $('#' + idValueTrigger).val();

                $('#' + idValueTrigger).val(simulatorValue[idValueTrigger].val);


                var nameR = idValueTrigger.indexOf('-');
                var nameRadio = idValueTrigger.substring(0, nameR);

                var valRadio;

                if (simulatorValue[idValueTrigger].changeTo === false) {
                    valRadio = 'is';
                } else {
                    valRadio = 'becomes';
                }

                if (valRadio === 'is') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="becomes"]').remove();

                    $('.' + nameRadio + '_is').prepend('<input  id="' + nameRadio + '_is" class="radio active" type="radio" name="' + nameRadio + '" checked="checked" value="is" />');

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" class="radio" type="radio" name="' + nameRadio + '"  value="becomes" />');

                } else if (valRadio === 'becomes') {

                    $('input[name="' + nameRadio + '"][value="' + valRadio + '"]').remove();
                    $('input[name="' + nameRadio + '"][value="is"]').remove();

                    $('.' + nameRadio + '_becomes').prepend('<input id="' + nameRadio + '_becomes" type="radio" class="radio active" name="' + nameRadio + '" checked="checked" value="becomes" />');

                    $('.' + nameRadio + '_is').prepend('<input id="' + nameRadio + '_is" class="radio" type="radio" name="' + nameRadio + '"  value="is" />');

                }

                //console.log(nameRadio, valRadio);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#loadConfModal').modal('hide');
});

function getTree(arrayRules, reDraw) {
    //console.log('reDraw',reDraw);
    involvedCtxDimensions = new Array();
    //var involvedCtxEntities = new Array();
    analyzeRules(arrayRules);
    if (reDraw === false) {
        //get rule with commons appliances
        detectAppliancesConflicts(appliancesActionList);
        //get rule with commons ui modifications
        detectUiModificationConflicts(uiModificationActionList);      
        //retrieve triggers belonging to potential conflicting rules
        getAllTriggers(conflictRules);
        //retrieve actions belonging to potential conflicting rules
        getAllActions(conflictRules);
        //check if potential conflicting rules are in really in conflict
        detectTriggerConflict(conflictRules);
        //explanain why those rules are in conflict
        getConflictExplanation(conflictRules);
        getUIModificationConflict();
    }

    var tree_tmp = new Array();
    
    var isUserExpanded = $.inArray("users", involvedCtxDimensions) > -1;
    var user = {
        text: "<span class=\"labelTree labelTreeNotSelected\">" + getDimensionLocale("users") + "</span>",
        backColor : "rgba(33, 164, 208, 0.34)",
        color: '#272727',         
        //modifiche chi color: '#000000',
        state: {
            checked: false,
            disabled: false,
            expanded: isUserExpanded,
            selected: false
        },
        nodes: []
    };
  
    if (isUserExpanded) {
        user.text = "<span class=\"labelTree labelTreeSelected\">" + user.text + "</span>";
       //user.backColor = "#E5FFCC";
    }
    for (var i = 0; i < ctx['users'].length; i++) {
       
        var node = getTreeNode(ctx['users'][i],'users', i);
        if (node.state.expanded)
            user.nodes.push(node);
        
    }
    tree_tmp.push(user);
    
    var isEnvironmentExpanded = $.inArray("environments", involvedCtxDimensions) > -1;

    var environment = {
        text: "<span class=\"labelTree labelTreeNotSelected\">" + getDimensionLocale("environments") + "</span>",
        backColor : "rgba(33, 164, 208, 0.34)",
        color: '#272727',        
        //modifiche chi color: '#000000',
        state: {
            checked: false,
            disabled: false,
            expanded: isEnvironmentExpanded,
            selected: false
        },
        nodes: []
    };

    if (isEnvironmentExpanded) {
        environment.text = "<span class=\"labelTree labelTreeSelected\">" + environment.text + "</span>";
        //environment.backColor = "#E5FFCC";
    }
    for (var i = 0; i < ctx['environments'].length; i++) {
        var node = getTreeNode(ctx['environments'][i],'environments');
        if (node.state.expanded)
            environment.nodes.push(node);
    }
    tree_tmp.push(environment);
    
    var isTechnologyExpanded = $.inArray("technology", involvedCtxDimensions) > -1;

    var technology = {
        text: "<span class=\"labelTree labelTreeNotSelected\">" + getDimensionLocale("technology") + "</span>",
        backColor : "rgba(33, 164, 208, 0.34)",
        color: '#272727',       
        //modifiche chi color: '#000000',
        state: {
            checked: false,
            disabled: false,
            expanded: isTechnologyExpanded,
            selected: false
        },
        nodes: []
    };
   
    if (isTechnologyExpanded) {
        technology.text = "<span class=\"labelTree labelTreeSelected\">" + technology.text + "</span>";
        //technology.backColor = "#E5FFCC";
    }
    for (var i = 0; i < ctx['technology'].length; i++) {
        var node = getTreeNode(ctx['technology'][i],"technology");
        if (node.state.expanded)
            technology.nodes.push(node);
    }
    tree_tmp.push(technology);
    
    var environmentVar = {
        text: "<span class=\"labelTree labelTreeSelected\">Environment Variables</span>",
        backColor : "rgba(33, 164, 208, 0.34)",
        color: '#272727',         
        state: {
            checked: false,
            disabled: false,
            expanded: true,
            selected: false
        },
        nodes: []
    };
    
    var textExternal = "Outdoor Values";
    var externelNode = thresholdValues(textExternal);
    environmentVar.nodes.push(externelNode);
    
    rules.forEach(function(rule){
        var parent = new Array();
        rule.actions.forEach(function(action){
            parent.push(action.parent);
        });
        parent.forEach(function(node){
            if(node !== undefined && node !== "Devices" && node !== "Entrance" && node !== "Corridor"){
                var textInternal = node.replace(/([a-z])([A-Z])/g, '$1 $2') + " Values";
                if(!environmentVar.nodes.some(elemento => elemento.text.includes(textInternal))){
                    var internalNode = thresholdValues(textInternal);
                    environmentVar.nodes.push(internalNode);
                }  
            }
        });
    });
    
    tree_tmp.push(environmentVar);
        
    return tree_tmp;
}

var environmentVarValues = {
    "temperature": {
        name: "Temperature",
        type: "isInit"
    },
    "humidity": {
        name: "Humidity",
        type: "isInit"
    },
    "noise": {
        name: "Noise",
        type: "isInit"
    },
    "air quality": {
        name: "Air quality",
        type: "isEnum",
        option: ["Good", "Fair", "Moderate", "Poor", "Very Poor"]
    }
};
//air Quality Index --> Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor

function thresholdValues(text){
    var listVariables = "<ul class='envVarList'>";
    
    var tmp = {
        text: text,
        state: {
            checked: false,
            disabled: false,
            expanded: true,
            selected: false
        },
        nodes: []
    };
     if (tmp.state.expanded) {
        tmp.text = "<span class=\"labelTree labelTreeSelected\">" + tmp.text+ "</span>";
        tmp.text = "<span class=\"labelTree labelTreeSelected\">" + tmp.text +"</span>";
        tmp.backColor = "#EBE9E9";
        tmp.state.expanded = true;
    }
    
    rules.forEach(function(rule){
        var realNameAction = rule.actions[0].action.realName;
        var parentAction = rule.actions[0].parent;
        var valueOperator = rule.actions[0].operator;
        if (valueOperator === "turnOn"){
            valueOperator = "on";
        }
        if (valueOperator === "turnOff"){
            valueOperator = "off";
        }
        var parent;
        if (parentAction === undefined){
            parent = "";
        }
        else {
            parent = parentAction.toLowerCase();
        }
        var environmentVariables = getIncreaseEnvironmentVariables(realNameAction, parent, valueOperator);
        if (text === "Outside Values"){
            text = "outside";
        }
        else {
            text = text.replace(" Values", "");
        }
        environmentVariables.forEach(function(variable){
            if (environmentVarValues.hasOwnProperty(variable)) {
                var value = environmentVarValues[variable];
                var val = "";
                var input;
                if (value.type === "isEnum") { 
                    var options = value.option;
                    options.forEach(function(option) {
                        val += '<option>' + option + '</option>';
                    });
                }
                if (value.type === "isEnum"){
                    input = "<select id='"+value.name.toLowerCase().replace(/\s/g, '')+"_"+text.toLowerCase().replace(/\s/g, '')+"_varEnv' class=\"form-control inputTrigger\" style=\"display:inline-block;\"><option></option>" + val + "</select>";
                }
                if (value.type ===  "isInit"){
                    input = "<input id='"+value.name.toLowerCase().replace(/\s/g, '')+"_"+text.toLowerCase().replace(/\s/g, '')+"_varEnv'' type=\"number\" placeholder='Number' class=\"textAttribute form-control inputTrigger\"  style=\"display:inline-block;\">";
                }
                var nameVariable = variable.charAt(0).toUpperCase() + variable.slice(1);
                var textList = "<li><div><span class='markerVar'>&#8226;</span><span class='labelVar'>"+ nameVariable +"</span></div>"+ input + "</li>";
                if (!listVariables.includes(textList)){
                    listVariables += textList;
                }
            }
        });
    
    });
    tmp.backColor = "#F5F5F5";
    tmp.state.expanded = true;
    tmp.text = "<span class=\"labelTree labelTreeSelected\">" + tmp.text +"</span>";     
    var attr = {
        text: listVariables+"</ul>"
    };
    attr.isExpanded = true;
    attr.backColor = "#fff";
    attr.selectable = false;

    tmp.nodes.push(attr);
            
    return tmp;
}