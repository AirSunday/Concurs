import http from "../http-common";

class Concurs {
  CreateUser(data) {
    return http.post(`/users/create`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  Authentication(data) {
    return http.post(`/users`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  findUserById(data) {
    return http.post(`/users/findOneId`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  findUserByEmail(data) {
    return http.post(`/users/findOneEmail`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  updateUser(data) {
    return http.post(`/users/update`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  createCompetition(formData) {
    return http.post('/competition/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      enctype: 'multipart/form-data'
    });
  }
  updateCompetition(formData) {
    return http.post('/competition/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      enctype: 'multipart/form-data'
    });
  }
  createCriteria(data) {
    return http.post(`/competition/createCriteria`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  createJudge(data) {
    return http.post(`/competition/createJudge`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  deleteJudge(data) {
    return http.post(`/competition/deleteJudge`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  getCompetition(data) {
    return http.post(`/competition/getCompetition`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  getOneCompetition(data) {
    return http.post(`/competition/getOneCompetition`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  deleteCompetition(data) {
    return http.post(`/competition/deleteCompetition`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  createModel(data) {
    return http.post(`/model/create`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  signIn(data) {
    return http.post(`/sign-in`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  signOut(data) {
    return http.post(`/sign-out`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  isAdmin(data) {
    return http.post(`/isAdmin`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  isJudge(data) {
    return http.post(`/isJudge`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  isOrganizer(data) {
    return http.post(`/isOrganizer`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  isParticipant(data) {
    return http.post(`/isParticipant`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
export default new Concurs();
