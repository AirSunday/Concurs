const user = require("../controllers/users.controller");
const competition = require("../controllers/competition.controller");
module.exports = (app) => {
  const user = require("../controllers/users.controller.js");
  const competition = require("../controllers/competition.controller.js");
  const model = require("../controllers/model.controller.js");
  const role = require("../controllers/role.controller.js");
  const multer  = require('multer')
  const upload = multer({ dest: 'app/uploads/' })

  const router = require("express").Router();
  //
  router.post("/users/create", upload.single('filedata'), user.create);
  //
  router.post("/users", user.Authentication);
  //
  router.post("/users/isAuthenticated", user.isAuthenticated);
  //
  router.post("/users/findOneId", user.findOneId);
  //
  router.post("/users/findOneEmail", user.findOneEmail);
  //
  router.post("/users/update", upload.single('filedata'), user.update);
  //
  router.post("/competition/create", upload.array('files', 2), competition.create);
  //
  router.post("/competition/getWinner", competition.getWinner);
  //
  router.post("/competition/update", upload.single('filedata'), competition.update);
  //
  router.post("/competition/createCriteria", competition.createCriteria);
  //
  router.post("/competition/createJudge", competition.createJudge);
  //
  router.post("/competition/approvalJudge", competition.approvalJudge);
  //
  router.post("/competition/deleteJudge", competition.deleteJudge);
  //
  router.post("/competition/getCompetition", competition.getCompetition);
  //
  router.post("/competition/getCompetitionEnd", competition.getCompetitionEnd);
  //
  router.post("/competition/getOneCompetition", competition.getOneCompetition);
  //
  router.post("/model/GetOneModel", model.getOneModel);
  //
  router.post("/competition/deleteCompetition", competition.deleteCompetition);
  //
  router.post("/competition/deleteModel", competition.deleteModel);
  //
  router.post("/competition/GetParticipants", competition.GetParticipants);
  //
  router.post("/competition/GetJudges", competition.GetJudges);
  //
  router.post("/competition/GetOrganizers", competition.GetOrganizers);
  //
  router.post("/competition/getCriteria", competition.getCriteria);
  //
  router.post("/model/create", upload.single('filedata'), model.create);
  //
  router.post("/model/update", upload.single('filedata'), model.update);
  //
  router.post("/model/sendScore", model.sendScore);
  //
  router.post("/model/getScore", model.getScore);
  //
  router.get("/image/:filename", competition.sendImage);
  //
  router.get("/file/:filename", competition.sendFile);
  //
  router.post("/isAdmin", role.isAdmin);
  //
  router.post("/isJudge", role.isJudge);
  //
  router.post("/isOrganizer", role.isOrganizer);
  //
  router.post("/isParticipant", role.isParticipant);
  //

  app.use("/api", router);
};
