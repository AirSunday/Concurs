import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  // baseURL: "http://45.131.41.167:8080/api",
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});

export default instance;
