import React from 'react';
import faker from 'faker';
import moment from 'moment';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Weather from '../../src/components/Weather';
import { TemperatureUnit, Weather as WeatherConstant } from '../../src/constants';
import api from '../../src/utils/api';


const generateMockData = (time, weather, low, high, precipitation = null, probability = null) => ({
  time,
  summary: faker.lorem.sentence(),
  icon: weather,
  temperatureLow: low,
  temperatureHigh: high,
  ...(precipitation ? {
    precipType: precipitation,
    precipProbability: probability,
  } : {}),
});

describe('<Weather />', () => {
  const stubs = {
    api: null,
  };

  const props = {
    coordinates: {
      latitude: 35.6895,
      longitude: 139.6917,
    },
    unit: TemperatureUnit.Celsius,
  };

  afterEach(() => {
    stubs.api.restore();
  });

  it('should render successfully', async () => {
    const time = moment().startOf('day');
    const next = moment().startOf('day').add(1, 'd');

    const data = {
      daily: {
        data: [
          generateMockData(time.unix(), 'clear-day', 80, 90),
          generateMockData(next.unix(), 'clear-day', 80, 90),
          generateMockData(next.add(1, 'd').unix(), 'clear-day', 80, 90),
          generateMockData(next.add(1, 'd').unix(), 'clear-day', 80, 90),
          generateMockData(next.add(1, 'd').unix(), 'clear-day', 80, 90),
        ]
      },
    };

    stubs.api = sinon.stub(api, 'get');
    stubs.api.returns(Promise.resolve({ data }));

    const wrapper = shallow(<Weather coordinates={ props.coordinates } unit={ props.unit } />);

    setImmediate(() => {
      expect(wrapper.find('.component.weather')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr')).to.have.lengthOf(5);

      const row = wrapper.find('.component.weather .table tbody tr').at(0);
      expect(row.find('.date .day').text()).to.equal(time.date().toString())
      expect(row.find('.date .month').text()).to.equal(time.format('MMMM'));
      expect(row.find('.date .year').text()).to.equal(time.year().toString());
    });
  });

  it('should show the umbrella sign on rainy day', async () => {
    const time = moment().startOf('day');

    const data = {
      daily: {
        data: [
          generateMockData(time.unix(), 'rain', 80, 90),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90),
          generateMockData(time.add(1, 'd').unix(), 'rain', 80, 90),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90),
          generateMockData(time.add(1, 'd').unix(), 'rain', 80, 90),
        ]
      },
    };

    stubs.api = sinon.stub(api, 'get');
    stubs.api.returns(Promise.resolve({ data }));

    const wrapper = shallow(<Weather coordinates={ props.coordinates } unit={ props.unit } />);

    setImmediate(() => {
      expect(wrapper.find('.component.weather')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(0).find('.icon i').is('.fas.fa-cloud-rain')).to.be.true;
      expect(wrapper.find('.component.weather .table tbody tr').at(1).find('.icon i').is('.fas.fa-sun')).to.be.true;
      expect(wrapper.find('.component.weather .table tbody tr').at(2).find('.icon i').is('.fas.fa-cloud-rain')).to.be.true;
      expect(wrapper.find('.component.weather .table tbody tr').at(3).find('.icon i').is('.fas.fa-sun')).to.be.true;
      expect(wrapper.find('.component.weather .table tbody tr').at(4).find('.icon i').is('.fas.fa-cloud-rain')).to.be.true;
    });
  });

  it('should show the umbrella sign when probability to rain is more than 70 percent', async () => {
    const time = moment().startOf('day');

    const data = {
      daily: {
        data: [
          generateMockData(time.unix(), 'rain', 80, 90),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90, 'rain', 0.5),
          generateMockData(time.add(1, 'd').unix(), 'rain', 80, 90),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90, 'rain', 0.7),
          generateMockData(time.add(1, 'd').unix(), 'rain', 80, 90),
        ]
      },
    };

    stubs.api = sinon.stub(api, 'get');
    stubs.api.returns(Promise.resolve({ data }));

    const wrapper = shallow(<Weather coordinates={ props.coordinates } unit={ props.unit } />);

    setImmediate(() => {
      expect(wrapper.find('.component.weather')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(0).find('.condition .fas.fa-umbrella').exists()).to.be.true;
      expect(wrapper.find('.component.weather .table tbody tr').at(1).find('.condition .fas.fa-umbrella')).to.have.lengthOf(0);
      expect(wrapper.find('.component.weather .table tbody tr').at(2).find('.condition .fas.fa-umbrella')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(3).find('.condition .fas.fa-umbrella')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(4).find('.condition .fas.fa-umbrella')).to.have.lengthOf(1);
    });
  });

  it('should show the snow sign on below 79 fahrenheit degree', async () => {
    const time = moment().startOf('day');

    const data = {
      daily: {
        data: [
          generateMockData(time.unix(), 'clear-day', 79, 85),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 60, 75),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 75, 80),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90),
        ]
      },
    };

    stubs.api = sinon.stub(api, 'get');
    stubs.api.returns(Promise.resolve({ data }));

    const wrapper = shallow(<Weather coordinates={ props.coordinates } unit={ props.unit } />);

    setImmediate(() => {
      expect(wrapper.find('.component.weather')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(0).find('.condition .fas.fa-mitten').exists()).to.be.false;
      expect(wrapper.find('.component.weather .table tbody tr').at(1).find('.condition .fas.fa-mitten')).to.have.lengthOf(0);
      expect(wrapper.find('.component.weather .table tbody tr').at(2).find('.condition .fas.fa-mitten')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(3).find('.condition .fas.fa-mitten')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(4).find('.condition .fas.fa-mitten')).to.have.lengthOf(0);
    });
  });

  it('should show the snow sign when probability to snow is more than 70 percent', async () => {
    const time = moment().startOf('day');

    const data = {
      daily: {
        data: [
          generateMockData(time.unix(), 'clear-day', 79, 85),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90, 'snow', 0.75),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 60, 75),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 75, 80),
          generateMockData(time.add(1, 'd').unix(), 'clear-day', 80, 90, 'snow', 0.5),
        ]
      },
    };

    stubs.api = sinon.stub(api, 'get');
    stubs.api.returns(Promise.resolve({ data }));

    const wrapper = shallow(<Weather coordinates={ props.coordinates } unit={ props.unit } />);

    setImmediate(() => {
      expect(wrapper.find('.component.weather')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(0).find('.condition .fas.fa-mitten').exists()).to.be.false;
      expect(wrapper.find('.component.weather .table tbody tr').at(1).find('.condition .fas.fa-mitten')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(2).find('.condition .fas.fa-mitten')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(3).find('.condition .fas.fa-mitten')).to.have.lengthOf(1);
      expect(wrapper.find('.component.weather .table tbody tr').at(4).find('.condition .fas.fa-mitten')).to.have.lengthOf(0);
    });
  });
});
