import tabJoursEnOrdre from './manageTime.js';

const token = '13b834e00ac1db7eaa07e0aae352b895';
let resultatsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const humidite = document.querySelector('.humidite');
const vent = document.querySelector('.vent');
const pression = document.querySelector('.pression');
const ventdir = document.querySelector('.ventdir');
const visibilite = document.querySelector('.visibilite');
const uv = document.querySelector('.uv');
const res = document.querySelector('.ressenti');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temp');
const imgJ = document.querySelectorAll('.img-j');
const imgH = document.querySelectorAll('.img-h');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icon-chargement');
const time = document.querySelector('.time')

if (17 >= new Date().getHours() && new Date().getHours() >= 7) {
    document.getElementsByClassName("container")[0].style.backgroundImage = 'linear-gradient(135deg, rgb(255, 201, 83), rgb(63, 142, 232) 30%)';
    document.body.style.backgroundImage = 'linear-gradient(0deg, rgb(26, 111, 190),rgb(136, 188, 255))';
    document.getElementsByClassName("overlay-icon-chargement")[0].style.backgroundImage = 'linear-gradient(0deg, rgb(26, 111, 190),rgb(136, 188, 255))';
    console.log("fond affiché : jour")
}else {
    document.getElementsByClassName("container")[0].style.backgroundImage = 'linear-gradient(135deg, #8c8fbd, #0f056b 30%)';
    document.body.style.backgroundImage = 'linear-gradient(0deg, #040441, #191970)';
    document.getElementsByClassName("overlay-icon-chargement")[0].style.backgroundImage = 'linear-gradient(0deg, #040441, #191970)';
    console.log("fond affiché : nuit")
}

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

        // console.log(position);
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        City(long, lat)
        AppelAPI(long,lat);

    }, () => {
        alert(`Vous avez refusé la géolocalisation, veuillez l'activer pour que la météo fonctionne !`)
    })
}
// var date = new Date();
// calcul.textContent=date.getHours()+" h "+date.getMinutes()+" min"

function City(long, lat) {
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${long}&lat=${lat}`)
        .then( res => res.json() )
        .then( data => localisation.innerText = data.features[0].properties.city);
}

let zero = ''
if(new Date().getMinutes() < 10) {
    zero = '0'
}
time.innerText = new Date().getHours() + "h" + zero + new Date().getMinutes()

function AppelAPI(long, lat) {
    
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${token}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        console.log(data);

        resultatsAPI = data

        temps.innerText = resultatsAPI.current.weather[0].description;
        temperature.innerText = `${Math.round(resultatsAPI.current.temp)}°C`;
        humidite.innerText = resultatsAPI.current.humidity + "%";
        vent.innerText = resultatsAPI.current.wind_speed + "km/h";
        pression.innerText = resultatsAPI.current.pressure + "hPa";
        // localisation.innerText = resultatsAPI.timezone;
        let direction = resultatsAPI.current.wind_deg;
        if ( 338 <= direction && direction < 0) {
            ventdir.innerText = "Nord";
            document.querySelector('.img-ventdir').src = "./ressources/autres/rose_nord.svg";
        }
        else if ( 0 <= direction && direction < 23) {
            ventdir.innerText = "Nord";
        }
        else if (23 <= direction && direction < 68) {
            ventdir.innerText = "N. Est";
        }
        else if (68 <= direction && direction < 113) {
            ventdir.innerText = "Est";
        }
        else if (113 <= direction && direction < 158) {
            ventdir.innerText = "S. Est";
        }
        else if (158 <= direction && direction < 203) {
            ventdir.innerText = "Sud";
        }
        else if (203 <= direction && direction < 248) {
            ventdir.innerText = "S. Ouest";
        }
        else if (248 <= direction && direction < 293) {
            ventdir.innerText = "Ouest";
        }
        else if (293 <= direction && direction < 338) {
            ventdir.innerText = "N. Ouest";
        }
        visibilite.innerText = `${(resultatsAPI.current.visibility)/1000}km`;
        uv.innerText = resultatsAPI.current.uvi;
        res.innerText = `Ressenti : ${resultatsAPI.current.feels_like}°C`


        let heureActuelle = new Date().getHours();
        
        for(let i = 0; i < heure.length; i++) {

            let heureIncr = heureActuelle + i * 3;

            if(heureIncr >= 24) {
                heure[i].innerText = `${heureIncr - 24} h`;
            // } else if(heureIncr === 24) {
            //     heure[i].innerText == "00h"
            } else {
            heure[i].innerText = `${heureIncr} h`;
            }
        }

        for(let j = 0; j < tempPourH.length; j++) {
            tempPourH[j].innerText = `${Math.round(resultatsAPI.hourly[j * 3].temp)}°C`;
            imgH[j].src = `./ressources/logo/${resultatsAPI.hourly[j * 3].weather[0].icon}.svg`;
        }


        for(let k = 0; k < tabJoursEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }


        for(let m = 0; m < 7; m++) {
            tempJoursDiv[m].innerText = `${Math.round(resultatsAPI.daily[m + 1].temp.day)}°C`;
            imgJ[m].src = `./ressources/logo/${resultatsAPI.daily[m].weather[0].icon}.svg`;
            
        }



        imgIcone.src = `./ressources/logo/${resultatsAPI.current.weather[0].icon}.svg`
        

        chargementContainer.classList.add('disparition');

    })
    
}
