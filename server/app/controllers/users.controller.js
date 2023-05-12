const db = require("../models").db;
var sequelize = require("sequelize");
const PersonDB = db.persondbs;
const AdminDB = db.admindbs;
const JudgeDB = db.judgedbs;
const Sessiondb = db.sessiondbs;
const Op = db.Sequelize.Op;

async function FindSession(req, res) {
  var nowSid;
  try {
    nowSid = req.headers.cookie.split("%3A")[1].split(".")[0];
  } catch (e) {
    nowSid = "";
  }
  return await Sessiondb.findOne({ where: { sid: nowSid } }).then((session) => {
    if (session && JSON.parse(session.data).passport) {
      return JSON.parse(session.data).passport.user;
    }
    return 0;
  });
}

exports.Authentication = (req, res) => {
  FindSession(req).then((val) => {
    res.send({ userId: val });
  });
};

exports.isAuthenticated = (req, res) => {
    FindSession(req).then((val) => {
        PersonDB.findOne({where: {id: val}}).then((person) => {
            if(person)
                res.status(200).send({ login: true });
            else
                res.status(200).send({ login: false });
        });
    }).catch(() => {
        res.status(500).send({ login: false });
    })
}

exports.create = (req, res) => {

    let filePath;
    const filedata = req.file;
    if(!filedata) filePath = '';
    else filePath = filedata.filename;


  PersonDB.findAll({
    attributes: [[sequelize.fn("count", sequelize.col("name")), "user_count"]],
  }).then((CountUser) => {
    const person = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      photo: filePath,
    };

    PersonDB.create(person)
      .then((data) => {
        if (CountUser[0].dataValues.user_count == 0) {
          AdminDB.create({person_id: data.dataValues.id })
              .catch((err) => {
                res.status(500).send({
                  message:
                      err.message || "Some error with create Admin",
                });
              });
        }
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error with create User",
        });
      });
  });
};

exports.findOneId = (req, res) => {
  const id = req.body.userId;
  PersonDB.findOne({ where: { id: id } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          status: false,
          message: `Cannot find Usersdb with userId=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Error retrieving Usersdb with Email=" + id,
      });
    });
};

exports.findOneEmail = (req, res) => {
  const email = req.body.email;
  PersonDB.findOne({ where: { email: email } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          status: false,
          message: `Cannot find Usersdb with email=${email}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Error retrieving Usersdb with Email=" + email,
      });
    });
};

exports.update = (req, res) => {
  const filedata = req.file;
  const id = req.body.userId;
  PersonDB.findOne({ where: { id: id } }).then((user) => {
    if (user) {
      user.name = req.body.name === "" ? user.name : req.body.name;
      user.email = req.body.email === "" ? user.email : req.body.email;
      user.password =
        req.body.password === "" ? user.password : req.body.password;
      if(filedata) user.photo = filedata.filename;
    }

    user
      .save()
      .then(() => {
        res.status(200).send({
          message: "update complite",
        });
      })
      .catch(() => {
        res.status(500).send({
          message: "Error update",
        });
      });
  });
};

exports.getUserById = (userId) =>
    PersonDB.findOne({
      where: { id: userId },
    });
exports.getUserByEmail = (email) =>
    PersonDB.findOne({
      where: { email },
    });
