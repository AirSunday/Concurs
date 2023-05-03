const user = require("../controllers/users.controller");
const competition = require("../controllers/competition.controller");
module.exports = (app) => {
  const user = require("../controllers/users.controller.js");
  const competition = require("../controllers/competition.controller.js");
  const model = require("../controllers/model.controller.js");

  const router = require("express").Router();
  //
  router.post("/users/create", user.create);
  //
  router.post("/users", user.Authentication);
  //
  router.post("/users/findOneId", user.findOneId);
  //
  router.post("/users/findOneEmail", user.findOneEmail);
  //
  router.post("/users/update", user.update);
  //
  router.post("/competition/create", competition.create);
  //
  router.post("/competition/createCriteria", competition.createCriteria);
  //
  router.post("/competition/createJudge", competition.createJudge);
  //
  router.post("/competition/getCompetition", competition.getCompetition);
  //
  router.post("/model/create", model.create);
  //

  app.use("/api", router);
};
