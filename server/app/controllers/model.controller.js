const db = require("../models").db;
var sequelize = require("sequelize");
const Model = db.modeldbs;
const Participant = db.participantdbs;
const Competition = db.competitiondbs;
const Op = db.Sequelize.Op;

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

exports.create = (req, res) => {
    CreateParticipant(req.body.userId, res).then((participant) => {
        const today = new Date();
        Model.create({
            participant: participant.id,
            name: req.body.name,
            view: req.body.view,
            scale: req.body.scale,
            text: req.body.text,
            image: req.body.image,
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
};


