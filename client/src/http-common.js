import axios from "axios";

const instance = axios.create({
  withCredentials: true,
   baseURL: "https://whoisa.ru/api",
  // baseURL: "http://localhost:8080/api",
});
//modelCard CardCompetition Competition server http-common
export default instance;
