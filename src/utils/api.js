import axios from 'axios';


axios.interceptors.request.use((config) => {
  console.log(`Request [${ config.method }] ${ config.url }`, config.data);
  return config;
});

axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8000/';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
