const db = require("../models").db;
var sequelize = require("sequelize");
const Model = db.modeldbs;
const Competition = db.competitiondbs;
const Participant = db.participantdbs;
const Judge = db.judgedbs;
const Organizer = db.organizerdbs;
const Admin = db.admindbs;
const Person = db.persondbs;
const Op = db.Sequelize.Op;
const Sessiondb = db.sessiondbs;

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

exports.isAdmin = (req, res) => {
    FindSession(req).then((val) => {
        const userId = val;
        Admin.findOne({where: {person_id: userId}}).then((admin) => {
            if(admin) res.status(200).send({admin: true});
            else res.status(200).send({admin: false});
        });
    });
}

exports.isJudge = (req, res) => {
    FindSession(req).then((val) => {
        const userId = val;
        const competitionId = req.body.competitionId;
        Judge.findOne({ where: {
            person_id: userId,
            competitiondbId: competitionId
        }}).then((judge) => {
            if(judge && judge.approval) res.status(200).send({judge: 'approval'});
            else if(judge) res.status(200).send({judge: 'not approval'});
            else res.status(200).send({judge: 'not judge'});
        });
    });
}

exports.isOrganizer = (req, res) => {
    FindSession(req).then((val) => {
        const userId = val;
        const organizerId = req.body.organizerId;

        Organizer.findOne({ where: {
                person_id: userId,
                id: organizerId
        }}).then((organizer) => {
            if(organizer) res.status(200).send({organizer: true});
            else res.status(200).send({organizer: false});
        });
    });
}

exports.isParticipant = (req, res) => {
    FindSession(req).then((val) => {
        const userId = val;
        const competitionId = req.body.competitionId;
        Model.findAll({ where: { competitiondbId: competitionId }})
            .then((models) => {
                Promise.all(models.map((model) => {
                    return Participant.findOne({
                        where: {
                            id: model.dataValues.participant,
                            person_id: userId
                        }
                    });
                })).then((participants) => {
                    const hasParticipant = participants.some((participant) => {
                        return participant !== null;
                    });
                    res.status(200).send({participant: hasParticipant});
                }).catch((err) => {
                    res.status(500).send({
                        message: "Error checking participant",
                        error: err
                    });
                });
        });
    });
}

