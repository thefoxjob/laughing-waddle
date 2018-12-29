const Status = {
  Busy: 'Busy',
  Error: 'Error',
  Ready: 'Ready',
};

const TemperatureUnit = {
  Celsius: 'Celsius',
  Fahrenheit: 'Fahrenheit',
};

const Weather = {
  'clear-day': {
    icon: 'fas fa-sun',
    condition: {
      cold: false,
      rain: false,
    },
  },
  'clear-night': {
    icon: 'fas fa-moon',
    condition: {
      cold: false,
      rain: false,
    },
  },
  rain: {
    icon: 'fas fa-cloud-rain',
    condition: {
      cold: false,
      rain: true,
    },
  },
  snow: {
    icon: 'far fa-snowflake',
    condition: {
      cold: true,
      rain: false,
    },
  },
  sleet: {
    icon: 'fas fa-cloud-rain',
    condition: {
      cold: true,
      rain: false,
    },
  },
  wind: {
    icon: 'fas fa-wind',
    condition: {
      cold: false,
      rain: false,
    },
  },
  fog: {
    icon: 'fas fa-cloud',
    condition: {
      cold: false,
      rain: false,
    },
  },
  cloudy: {
    icon: 'fas fa-cloud',
    condition: {
      cold: false,
      rain: false,
    },
  },
  'partly-cloudy-day': {
    icon: 'fas fa-cloud-sun',
    condition: {
      cold: false,
      rain: false,
    },
  },
  'partly-cloudy-night': {
    icon: 'fas fa-cloud-moon',
    condition: {
      cold: false,
      rain: false,
    },
  },
  hail: {
    icon: 'fas cloud-rain',
    condition: {
      cold: true,
      rain: true,
    },
  },
  thunderstorm: {
    icon: 'fas fa-bolt',
    condition: {
      cold: true,
      rain: true,
    },
  },
  tornado: {
    icon: 'fas fa-wind',
    condition: {
      cold: false,
      rain: false,
    },
  },
};

Object.freeze(Status);
Object.freeze(TemperatureUnit);
Object.freeze(Weather);

export { Status, TemperatureUnit, Weather };
