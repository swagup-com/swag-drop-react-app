import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_SWAGDROP_API_ENDPOINT
});

export default instance;
