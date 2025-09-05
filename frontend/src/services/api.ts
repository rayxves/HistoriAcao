import axios from "axios";

const api = axios.create({
  baseURL: "https://z1473drn3i.execute-api.sa-east-1.amazonaws.com/api",
  timeout: 90000,
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }
    
    const shouldRetry = (
      error.response?.status === 503 ||
      error.response?.status === 502 ||
      error.response?.status === 504 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK'
    ) && config.__retryCount < 3;
    
    if (shouldRetry) {
      config.__retryCount += 1;      
      config.timeout = 120000;
      
      await delay(6000 * Math.pow(2, config.__retryCount - 1));
      
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

export default api;