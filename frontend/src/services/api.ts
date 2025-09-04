import axios from "axios";

const api = axios.create({
  baseURL: "https://vvjd2bwsm22q5pwdu5u5vfjmmq0ailxz.lambda-url.sa-east-1.on.aws/api", 
});

export default api;
