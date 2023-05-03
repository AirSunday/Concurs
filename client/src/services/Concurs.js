import http from "../http-common";

class Concurs {
  CreateUser(data) {
    return http.post(`/users/create`, data);
  }
  Authentication(data) {
    return http.post(`/users`, data);
  }
  findUserById(data) {
    return http.post(`/users/findOneId`, data);
  }
  findUserByEmail(data) {
    return http.post(`/users/findOneEmail`, data);
  }
  updateUser(data) {
    return http.post(`/users/update`, data);
  }
  createCompetition(data) {
    return http.post(`/competition/create`, data);
  }
  createCriteria(data) {
    return http.post(`/competition/createCriteria`, data);
  }
  createJudge(data) {
    return http.post(`/competition/createJudge`, data);
  }
  getCompetition(data) {
    return http.post(`/competition/getCompetition`, data);
  }
  createModel(data) {
    return http.post(`/model/create`, data);
  }
  signIn(data) {
    return http.post(`/sign-in`, data);
  }
  signOut(data) {
    return http.post(`/sign-out`, data);
  }
}
export default new Concurs();
