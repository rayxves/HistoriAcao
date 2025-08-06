import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5219/api", 
});

export default api;
