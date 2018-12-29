import Loader from 'react-loaders';
import PropTypes from 'prop-types';
import React from 'react';
import deepcopy from 'deepcopy';
import moment from 'moment';

import { Status, TemperatureUnit, Weather as WeatherMapper } from '../constants';
import api from '../utils/api';


const TEMPERATURE_COLD_POINT = 79;

class Weather extends React.Component {
  static propTypes = {
    coordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    unit: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.renderTableBodyContent = this.renderTableBodyContent.bind(this);

    this.state = {
      weather: null,
      status: Status.Busy,
    };
  }

  async componentWillMount() {
    const { coordinates } = this.props;
    const response = await api.get(
      `api.darksky.net:443/forecast/eb426c0ce78b5e6bea63034c6d1c5d8c/${ coordinates.latitude },${ coordinates.longitude }`,
    );

    const data = [];

    response.data.daily.data.splice(0, 5).forEach((daily) => {
      const weather = deepcopy(WeatherMapper[daily.icon]);
      const { condition } = weather;

      if (! condition.cold && daily.temperatureLow < TEMPERATURE_COLD_POINT) {
        condition.cold = true;
      }

      // where the rain probability more than 70 then will show as rain
      if (! condition.rain && (daily.precipType === 'rain' && daily.precipProbability >= 0.7)) {
        condition.rain = true;
        weather.icon = WeatherMapper.rain.icon;
      }

      if (! condition.snow && (daily.precipType === 'snow' && daily.precipProbability >= 0.7)) {
        condition.cold = true;
        weather.icon = WeatherMapper.snow.icon;
      }

      data.push({
        condition,
        icon: weather.icon,
        time: daily.time,
        summary: daily.summary,
        forecast: {
          type: daily.precipType,
          probability: daily.precipProbability,
        },
        temperature: {
          high: daily.temperatureHigh,
          low: daily.temperatureLow,
        },
      });
    });

    this.setState({ weather: data, status: Status.Ready });
  }

  renderTableBodyContent() {
    if (this.state.status === Status.Busy) {
      return (
        <tr>
          <td className="text-center" colSpan="4">
            <Loader type="line-scale-pulse-out" />
          </td>
        </tr>
      );
    } else if (this.state.weather) {
      return this.state.weather.map((weather) => {
        const date = moment.unix(weather.time);

        return (
          <tr key={ weather.time } className="weather">
            <td>
              <div className="d-flex">
                <div className="date">
                  <span className="day">{ date.date() }</span>
                  <span className="month">{ date.format('MMMM') }</span>
                  <span className="year">{ date.year() }</span>
                </div>

                <div className="icon">
                  <i className={ weather.icon } />
                </div>
              </div>
            </td>
            <td className="summary">
              { weather.summary }
              { weather.forecast.type && (
                <div>{ (weather.forecast.probability * 100).toFixed(0) }% chance of { weather.forecast.type }</div>
              ) }
            </td>
            <td className="temperature">
              <span className="high">
                {
                  this.props.unit === TemperatureUnit.Celsius
                    ? `${ ((weather.temperature.high - 32) * (5 / 9)).toFixed(0) }°C`
                    : `${ weather.temperature.high.toFixed(0) }°F`
                }
              </span>
              <span className="seperator">/</span>
              <span className="low">
                {
                  this.props.unit === TemperatureUnit.Celsius
                    ? `${ ((weather.temperature.low - 32) * (5 / 9)).toFixed(0) }°C`
                    : `${ weather.temperature.low.toFixed(0) }°F`
                }
              </span>
            </td>
            <td className="condition">
              { weather.condition.rain && <i className="fas fa-umbrella mx-1" /> }
              { weather.condition.cold && <i className="fas fa-mitten mx-1" /> }
            </td>
          </tr>
        );
      });
    }

    return (
      <tr>
        <td className="text-center" colSpan="4">
          No weather information found for this location
        </td>
      </tr>
    );
  }

  render() {
    return (
      <div className="component weather">
        <table className="table">
          <thead>
            <tr>
              <th className="date-column" scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Temperature</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            { this.renderTableBodyContent() }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Weather;
