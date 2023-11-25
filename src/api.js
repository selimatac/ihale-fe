import axios from "axios";
const api = axios.create();

api.interceptors.request.use(
  function (config) {
    config.baseURL = process.env.REACT_APP_API_URL;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default api;
