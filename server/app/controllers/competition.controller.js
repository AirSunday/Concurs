const db = require("../models").db;
var sequelize = require("sequelize");
const Person = db.persondbs;
const Judge = db.judgedbs
const Criteria = db.criteriadbs;
const Model = db.modeldbs;
const Organizer = db.organizerdbs;
const Competition = db.competitiondbs;
const Op = db.Sequelize.Op;

Competition.hasMany(Judge, {as: 'judge'});
Competition.hasMany(Criteria, {as: 'criteria'});
Competition.hasMany(Model, {as: 'model'});

async function CreateOrganizer(userId, res) {
    return await Organizer.create({
        person_id: userId,
    }).then((data) => {
        return {id: data.dataValues.id};
    }).catch(() => {
        res.status(500).send({
            message: "Error creating organizer",
        });
    });
}

exports.create = (req, res) => {
    const filedata = req.file;
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    CreateOrganizer(req.body.userId, res).then((organizer) => {
        Competition.create({
            organizer_id: organizer.id,
            name: req.body.name,
            minitext: req.body.minitext,
            fulltext: req.body.fulltext,
            datestart: req.body.datestart,
            dateend: req.body.dateend,
            image: req.file.path,
        }).then(() => {
            res.status(200).send({
                message: "creat Competition",
            });
        }).catch(() => {
            res.status(500).send({
                message: "Error creating Competition",
            });
        });
    })
};

exports.createCriteria = (req, res) => {
    const id = req.body.competitionId;
    Competition.findByPk(id).then((competition) => {
        Criteria.create({
            name: req.body.name,
            maxscore: req.body.maxscore,
        }).then(data => {
            competition.addCriteria(data).then(() => {
                res.status(200).send({
                    message: "creat Criteria",
                });
            }).catch(() => {
                res.status(500).send({
                    message: "Error creating Criteria",
                });
            });
        })
    })
}

exports.createJudge = (req, res) => {
    const id = req.body.competitionId;
    const userId = req.body.userId;
    Competition.findByPk(id).then((competition) => {
        Judge.create({
            person_id: userId,
        }).then(data => {
            competition.addJudge(data).then(() => {
                res.status(200).send({
                    message: "creat Judge",
                });
            }).catch(() => {
                res.status(500).send({
                    message: "Error creating Judge",
                });
            });
        })
    })
}

exports.getCompetition = (req, res) => {
    Competition.findAll().then((data) => {
        const promises = data.map(competition => {
            return Organizer.findOne({ where: { id: competition.dataValues.organizer_id } })
                .then(organizer => {
                    return Person.findOne({ where: { id: organizer.dataValues.person_id } })
                        .then(person => {
                            return {
                                name: competition.dataValues.name,
                                minitext: competition.dataValues.minitext,
                                datestart: competition.dataValues.datestart,
                                dateend: competition.dataValues.dateend,
                                organizer_name: person.dataValues.name
                            };
                        });
                });
        });
        return Promise.all(promises);
    }).then(response => {
        res.status(200).send(response);
    }).catch(err => {
        res.status(500).send({
            message: "Error sending competition",
            error: err
        });
    });
}
