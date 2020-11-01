import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import isoCountries from './countryCodes.json';

class CityInput extends Component {
    constructor(props) {
        super(props);
        this.state = { city: "" }
    }

    componentDidMount() {
        //
    }

    handleChange = (value) => {
        this.setState({ city: value });
    }

    handleSelect = (description, id, object) => {
        if (object) {
            console.log(object);
            const city = object.terms[0].value;
            const country = isoCountries[object.terms[object.terms.length - 1].value];
            this.handleChange(city);
            this.props.onGetWeather(city + ", " + country);
        } else {
            this.props.onGetWeather(this.state.city);
        }
    }

    componentDidUpdate() {
        console.log("city:", this.state.city);
    }

    render() {
        return (
            <PlacesAutocomplete
                value={this.state.city}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                searchOptions={{ types: ['(cities)'] }}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: "Select City...",
                                className: "autocomplete-input"
                            })}
                        />
                        <div className="autocomplete-dropdown">
                            {loading && <div></div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? "suggestion-active"
                                    : "suggestion";
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#fafafa', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
                }
            </PlacesAutocomplete>
        )
    }
}

export default CityInput;