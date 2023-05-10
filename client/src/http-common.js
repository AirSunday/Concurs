import axios from "axios";
import path from "@/services/path";

const instance = axios.create({
  withCredentials: true,
  baseURL: path.path,
});
//modelCard CardCompetition Competition server http-common
export default instance;
