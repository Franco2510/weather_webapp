import React, { Component } from 'react';
import CityImput from './CityInput';

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
        humidity: null
    }

    constructor() {
        super();
        this.state = {
            city: "",
            country: "",
            temperature: 0,
            description: "",
            icon: "",
            datetime: ""
        };
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
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].main,
                icon: data.weather[0].icon,
                datetime: this.state.datetime += data.timezone * 1000,
                min: Math.round(data.main.temp_min),
                max: Math.round(data.main.temp_max),
                humidity: data.main.humidity
            });
        }
        catch {
            console.log("City not found!");
        }
    }

    formatDate = (datetime) => {
        const formatted_date = new Date(this.state.datetime).toUTCString();
        return formatted_date.slice(0, formatted_date.lastIndexOf(':'))
    }

    render() {
        return (
            <div className="app-container">
                <div className="location-container">
                    <CityImput onGetWeather={(city) => this.getWeather(city)} />
                    {this.state.country
                        ? <img src={`https://www.countryflags.io/${this.state.country}/flat/32.png`}
                            alt="country flag"
                            title={this.state.country}
                            width="32" height="32"
                        />
                        : <img width="32" height="32" style={{ display: "none" }} />
                    }
                </div>
                <div className="weather-now-container">
                    <div className="weather-icon">
                        {this.state.icon
                            ? <img src={`http://openweathermap.org/img/wn/${this.state.icon}@2x.png`}
                                alt="weather icon"
                            />
                            : <img style={{ display: "none" }} />
                        }
                        <span className="weather-description">{this.state.description}</span>
                    </div>
                    <div className="temperature">
                        <span className="temp-value">
                            {this.state.temperature}
                        </span>
                        <span className="temp-symbol">°C</span>
                    </div>
                    <div className="extra-data">
                        <span className="minmax">Min:{this.state.min}°/Max:{this.state.max}°</span>
                        <span className="humidity">Humidity:{this.state.humidity}%</span>
                    </div>
                    <div className="date-time">
                        <span>
                            {this.state.datetime
                                ? this.formatDate(this.state.datetime)
                                : ""
                            }
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;