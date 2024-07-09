import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
