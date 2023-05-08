const db = require("../models").db;
var sequelize = require("sequelize");
const fs = require("fs");
const Model = db.modeldbs;
const Participant = db.participantdbs;
const Competition = db.competitiondbs;
const Op = db.Sequelize.Op;
const Sessiondb = db.sessiondbs;

async function CreateParticipant(userId, res) {
    return await Participant.create({
        person_id: userId,
    }).then((data) => {
        return {id: data.dataValues.id};
    }).catch(() => {
        res.status(500).send({
            message: "Error creating Participant",
        });
    });
}

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

exports.create = (req, res) => {

    const filedata = req.file;
    if(!filedata)
        res.send("Ошибка при загрузке файла");

    FindSession(req).then((userId) => {
        CreateParticipant(userId).then((participant) => {
            const today = new Date();
            Model.create({
                participant: participant.id,
                name: req.body.name,
                view: req.body.view,
                scale: req.body.scale,
                text: req.body.text,
                image: filedata.filename,
                score: 0,
                dateupload: today,
            }).then((model) => {
                Competition.findByPk(req.body.competitionId)
                    .then((competition) => {
                        competition.addModel(model).then(() => {
                            res.status(200).send({
                                message: "creat Model",
                            });
                        }).catch(() => {
                            res.status(500).send({
                                message: "Error creating Model",
                            });
                        });
                    })
            }).catch(() => {
                res.status(500).send({
                    message: "Error creating Model",
                });
            });
        })
    });
};

exports.update = async (req, res) => {
    const filedata = req.file;
    const modelId = req.body.modelId;
    if(filedata) {
        await fs.unlink("app/uploads/" + req.body.imageUrl, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    let filename = '';
    if(!filedata) filename = req.body.imageUrl;
    else filename = req.file.filename;
    Model.update({
        name: req.body.name,
        view: req.body.view,
        text: req.body.text,
        scale: req.body.scale,
        image: filename,
    }, {
        where: {
            id: modelId,
        }
    }).then(() => {
        res.status(200).send("update competition");
    }).catch((err) => {
        res.status(500).send({
            message: "Error updating competition",
        });
    })
};
