(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    const APIKEY = "e1d1e56f53d4af1f302a370a536843b4";
    const cardsBox = document.getElementById("cards-box");
    const locationForm = document.getElementById("location-form");
    let currentCard = null;
    async function getWeatherData(latitude, longitude) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`);
        const data = await response.json();
        return data;
    }
    function getNewCard() {
        const cardHTML = `\n        <div class="card__block">\n            <div class="card__head">\n                <div class="card__head-left">\n                    <div class="card__icon"></div>\n                    <div class="card__head-left-title">\n                        <h3 class="card__title"></h3>\n                        <span class="card__subtitle"></span>\n                    </div>\n                </div>\n                <div class="card__head-right card-param">\n                    <img src="img/therm.svg" alt="">\n                    <span class="card-param-text">\n                        <span class="card-param-value card-param_temp"></span>\n                        <sup>o</sup>C\n                    </span>\n                </div>\n            </div>\n            <div class="card__footer">\n                <div class="card__footer-left card-param">\n                    <img src="img/wind.svg" alt="">\n                    <span class="card-param-text_footer">\n                        <span class="card-param-value card-param_wind"></span> м/с\n                    </span>\n                </div>\n                <div class="card__footer-right card-param">\n                    <img src="img/hum.svg" alt="">\n                    <span class="card-param-text_footer">\n                        <span class="card-param-value card-param_humidity">12</span> %\n                    </span>\n                </div>\n            </div>\n        </div>\n    `;
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = cardHTML;
        return {
            card,
            icon: card.querySelector(".card__icon"),
            title: card.querySelector(".card__title"),
            temp: card.querySelector(".card-param_temp"),
            desc: card.querySelector(".card__subtitle"),
            wind: card.querySelector(".card-param_wind"),
            humidity: card.querySelector(".card-param_humidity")
        };
    }
    locationForm.addEventListener("submit", (async function(event) {
        event.preventDefault();
        const newCard = getNewCard();
        const latitude = parseFloat(document.getElementById("latitude").value.trim());
        const longitude = parseFloat(document.getElementById("longitude").value.trim());
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("Invalid latitude or longitude values");
            return;
        }
        cardsBox.prepend(newCard.card);
        setTimeout((async function() {
            try {
                const data = await getWeatherData(latitude, longitude);
                newCard.icon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
                newCard.title.textContent = data.name;
                newCard.desc.textContent = data.weather[0].description;
                newCard.temp.textContent = data.main.temp;
                newCard.wind.textContent = data.wind.speed;
                newCard.humidity.textContent = data.main.humidity;
                console.log(data);
                setTimeout((function() {
                    if (currentCard && currentCard.card && currentCard.card.classList) ;
                    currentCard = newCard;
                    newCard.card.classList.add("done");
                }), 300);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        }), 30);
    }));
    window["FLS"] = true;
    isWebp();
})();