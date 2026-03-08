import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://192.168.100.146:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
