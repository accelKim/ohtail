import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL || 'https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api';
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
