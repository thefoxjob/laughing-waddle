import React from 'react';
import moment from 'moment';

import { Measurement, Status } from '../constants';
import api from '../utils/api';


class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.onFindMyLocationButtonClick = this.onFindMyLocationButtonClick.bind(this);
    this.renderBody = this.renderBody.bind(this);

    this.state = {
      coordinates: null,
      daily: null,
      measurement: Measurement.Celsius,
      status: null,
    };
  }

  onFindMyLocationButtonClick(e) {
    e.preventDefault();

    this.setState({ status: Status.Busy }, () => {
      window.navigator.geolocation.getCurrentPosition(async (position) => {
        const coordinates = position.coords;
        const response = await api.get(
          `api.darksky.net:443/forecast/eb426c0ce78b5e6bea63034c6d1c5d8c/${ coordinates.latitude },${ coordinates.longitude }`,
        );

        console.log(response.data);
        const daily = response.data.daily.data.splice(0, 5);

        this.setState({ coordinates, daily, status: Status.Ready });
      });
    });
  }

  renderBody() {
    switch (this.state.status) {
      case Status.Busy:
        return (
          <tr>
            <td className="text-center" colSpan="4">
              <i className="fas fa-circle-notch fa-spin" />
            </td>
          </tr>
        );
      case Status.Ready:
        return this.state.daily.map((weather) => {
          const date = moment.unix(weather.time);

          return (
            <tr key={ weather.time } className="weather">
              <td className="date">
                <span className="day">{ date.date() }</span>
                <span className="month">{ date.month() + 1 }</span>
              </td>
              <td className="summary">{ weather.summary }</td>
              <td className="temperature">
                <span className="high">
                  {
                    this.state.measurement === Measurement.Celsius
                      ? `${ ((weather.temperatureHigh - 32) * (5 / 9)).toFixed(0) }°C`
                      : `${ weather.temperatureHigh }°F`
                  }
                </span>
                <span className="low">
                  {
                    this.state.measurement === Measurement.Celsius
                      ? `${ ((weather.temperatureLow - 32) * (5 / 9)).toFixed(0) }°C`
                      : `${ weather.temperatureLow }°F`
                  }
                </span>
              </td>
              <td></td>
            </tr>
          );
        });
      case Status.Error:
        return null;
      default:
        return (
          <tr>
            <td className="text-center" colSpan="4">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={ this.onFindMyLocationButtonClick }
              >
                Find My Local Weather
              </button>
            </td>
          </tr>
        );
    }
  }

  render() {
    return (
      <div className="page weather">
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Temperature</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              { this.renderBody() }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Weather;
