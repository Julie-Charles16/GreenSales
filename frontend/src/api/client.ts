import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ton backend
});

export default api;