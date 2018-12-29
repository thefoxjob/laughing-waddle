import AsyncSelect from 'react-select/lib/Async';
import Loader from 'react-loaders';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import script from 'react-async-script-loader';

import Weather from '../components/Weather';
import { Status, TemperatureUnit } from '../constants';


@script(['https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyA9G4I_V9DRo8dkGNtb1Cc7nUDR3R5jtAI'])
class Index extends React.Component {
  static propTypes = {
    isScriptLoaded: PropTypes.bool.isRequired,
    isScriptLoadSucceed: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.setupSearchInputListener = this.setupSearchInputListener.bind(this);

    this.state = {
      coordinates: null,
      place: null,
      status: null,
      unit: TemperatureUnit.Celsius,
    };

    this.ref = {
      search: null,
    };
  }

  componentDidMount() {
    if (this.props.isScriptLoaded && this.props.isScriptLoadSucceed) {
      this.setState({ status: Status.Ready }, () => this.setupSearchInputListener());
    }
  }

  componentWillReceiveProps(props) {
    if (props.isScriptLoaded && ! this.props.isScriptLoaded) {
      this.setState({ status: Status.Ready }, () => this.setupSearchInputListener());
    } else {
      this.setState({ status: Status.Error });
    }
  }

  setupSearchInputListener() {
    const autocomplete = new window.google.maps.places.Autocomplete(this.ref.search, {
      types: ['(cities)'],
    });

    window.google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      const coordinates = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };

      this.setState({ coordinates, place });
    });
  }

  render() {
    return (
      <div className="page index">
        { (! this.state.status || this.state.status !== Status.Ready) && (
          <Loader type="line-scale-pulse-out" />
        ) }

        { this.state.status && this.state.status === Status.Ready && (
          <div className={ classnames('container', { loaded: this.state.place }) }>
            <div className="search">
              <div className="row">
                <div className="col-12">
                  <input ref={ (component) => { this.ref.search = component; } } type="search" className="form-control" />
                </div>
              </div>
            </div>

            { this.state.place && <Weather coordinates={ this.state.coordinates } unit={ this.state.unit } /> }
          </div>
        ) }
      </div>
    );
  }
}

export default Index;
