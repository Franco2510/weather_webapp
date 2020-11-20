import React, { Component, createRef } from 'react';
import CityImput from './CityInput';

import humidity_icon from './images/humidity.png';
import none from './images/none.png';
import flagnone from './images/flag_none.png';
import sun from './images/sun.png';
import moon from './images/moon.png';

class App extends Component {
    state = {
        city: null,
        country: null,
        temperature: null,
        description: null,
        icon: null,
        datetime: null,
        min: null,
        max: null,
        humidity: null,
        coord: {}
    }

    constructor() {
        super();
        this.state = {
            city: "",
            country: "",
            temperature: 0,
            description: "-",
            icon: none,
            datetime: "-",
        };
        this.AppRef = createRef();
        this.AppForeRef = createRef();
        this.CityRef = createRef();
    }

    getWeather = async (city) => {
        console.log(city);
        const url = "http://api.openweathermap.org/data/2.5/weather?";
        const key = "00643dce0eee944eb41d1db359bf2c55";

        const response = await fetch(`${url}q=${city}&appid=${key}&units=metric`);
        const data = await response.json();
        console.log(data);
        try {
            console.log("temp:", data.main.temp);
            this.state.datetime = Date.now();
            console.log("UTCnow:", this.state.datetime);
            console.log("Localnow:", this.state.datetime + data.timezone * 1000);
            this.setState({
                city: city,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].main,
                //icon: data.weather[0].icon,
                datetime: this.state.datetime += data.timezone * 1000,
                min: Math.round(data.main.temp_min),
                max: Math.round(data.main.temp_max),
                humidity: data.main.humidity,
                coord: data.coord
            });
            this.changeBackground(data.weather[0].icon);
        }
        catch {
            console.log("City not found!");
        }
    }

    formatDate = (datetime) => {
        const formatted_date = new Date(this.state.datetime).toUTCString();
        return formatted_date.slice(0, formatted_date.lastIndexOf(':'))
    }

    changeBackground = (icon) => {
        const type = icon.substr(0, 2); //let only for testing
        const day = icon.charAt(2);
        console.log(type, day);
        let day_icon = "";

        const app = this.AppRef.current;
        const appfore = this.AppForeRef.current;
        const city = this.CityRef.current;

        //--backgrounds
        if (day === 'd') {
            day_icon = sun;

            app.classList.remove("night");
            appfore.classList.remove("night");
            city.classList.remove("night");

            app.classList.add("day");
            appfore.classList.add("day");
            city.classList.add("day");
        } else {
            day_icon = moon;

            app.classList.remove("day");
            appfore.classList.remove("day");
            city.classList.remove("day");

            app.classList.add("night");
            appfore.classList.add("night");
            city.classList.add("night");
        }

        //type = "50";

        //--sun/moon
        switch (type) {
            case "01": { //clear
                this.removeWeatherClasses();
                this.setState({ icon: day_icon });
                break;
            }
            case "02": { //few clouds
                this.removeWeatherClasses();
                appfore.classList.add("cloudy-a");
                this.setState({ icon: day_icon });
                break;
            }
            case "03": { //middle clouds
                this.removeWeatherClasses();
                appfore.classList.add("cloudy-b");
                this.setState({ icon: day_icon });
                break;
            }
            case "04": { //full clouds
                this.removeWeatherClasses();
                appfore.classList.add("cloudy-c");
                app.classList.add("cloudy-c");
                city.classList.add("cloudy-c");
                break;
            }
            case "09": { //shower rain
                this.removeWeatherClasses();
                appfore.classList.add("rain-a");
                break;
            }
            case "10": { //rain
                this.removeWeatherClasses();
                appfore.classList.add("rain-b");
                app.classList.add("cloudy-c");
                city.classList.add("cloudy-c");
                break;
            }
            case "11": { //storm
                this.removeWeatherClasses();
                appfore.classList.add("storm");
                app.classList.add("cloudy-c");
                city.classList.add("cloudy-c");
                break;
            }
            case "13": { //snow
                this.removeWeatherClasses();
                appfore.classList.add("snow");
                break;
            }
            case "50": { //mist
                this.removeWeatherClasses();
                appfore.classList.add("mist");
                app.classList.add("cloudy-c");
                city.classList.add("cloudy-c");
                break;
            }asd
        //console.log("CITY!!", this.state.city);
        switch (this.state.city.toUpperCase()) {
            case "SYDNEY":
            case "SYDNEY, AU": {
                city.classList.add("sydney");
                city.classList.remove("paris");
                break;
            }
            case "PARIS":
            case "PARIS, FR": {
                city.classList.add("paris");
                city.classList.remove("sydney");
                break;
            }
            default: {
                city.classList.remove("sydney");
                city.classList.remove("paris");
            }
        }
    }

    removeWeatherClasses = () => {
        const app = this.AppRef.current;
        const appfore = this.AppForeRef.current;
        const city = this.CityRef.current;

        appfore.classList.remove("cloudy-a");
        appfore.classList.remove("cloudy-b");
        appfore.classList.remove("cloudy-c");
        app.classList.remove("cloudy-c");
        city.classList.remove("cloudy-c");
        appfore.classList.remove("rain-a");
        appfore.classList.remove("rain-b");
        appfore.classList.remove("storm");
        appfore.classList.remove("snow");
        appfore.classList.remove("mist");
        this.setState({ icon: none });
    }

    getWeatherHourly = async (coord) => {
        //
    }

    getWeatherDaily = async (coord) => {
        //
    }

    render() {
        return (
            <div className="app-container" ref={this.AppRef}>
                <div className="app-container-foreground" ref={this.AppForeRef}></div>
                <div className="location-container">
                    <CityImput className="location-input" onGetWeather={(city) => this.getWeather(city)} />
                    {this.state.country
                        ? <img src={`https://www.countryflags.io/${this.state.country}/shiny/32.png`}
                            alt="country flag"
                            title={this.state.country}
                            width="32" height="32"
                        />
                        : <img src={flagnone} alt="" width="32" height="32" />
                    }
                </div>
                <div className="weather-now-container">
                    <div className="weather-type-container">
                        <img className="weather-icon"
                            src={this.state.icon}
                            style={
                                this.state.icon
                                    ? { visibility: "visible" }
                                    : { visibility: "hidden" }
                            }
                            alt=""
                        />
                        <span
                            className="weather-description"
                            style={
                                this.state.description !== '-'
                                    ? { visibility: 'visible' }
                                    : { visibility: 'hidden' }
                            }
                        >
                            {this.state.description}
                        </span>
                    </div>
                    <div className="temperature-container">
                        <span className="temp-value">
                            {this.state.temperature}
                        </span>
                        <span className="temp-symbol">°C</span>
                    </div>
                    <div className="extra-data">
                        <span className="minmax">
                            {this.state.min ? this.state.min : 0}°/
                            {this.state.max ? this.state.max : 0}°
                        </span>
                        <span className="humidity">
                            <img src={humidity_icon}
                                className="humidity-icon"
                                width="25"
                                alt="humidity icon" />
                            {this.state.humidity ? this.state.humidity : 0}%
                        </span>
                    </div>
                    <div
                        className="date-time"
                        style={
                            this.state.datetime !== '-'
                                ? { visibility: 'visible' }
                                : { visibility: 'hidden' }
                        }
                    >
                        <span>
                            {this.state.datetime !== '-'
                                ? this.formatDate(this.state.datetime)
                                : this.state.datetime
                            }
                        </span>
                    </div>
                </div>
                <div className="city-background" ref={this.CityRef}></div>
            </div>
        );
    }
}

export default App;