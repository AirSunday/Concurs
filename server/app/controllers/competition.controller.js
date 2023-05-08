const db = require("../models").db;
var sequelize = require("sequelize");
const Person = db.persondbs;
const Judge = db.judgedbs
const Criteria = db.criteriadbs;
const Model = db.modeldbs;
const Organizer = db.organizerdbs;
const Competition = db.competitiondbs;
const Participant = db.participantdbs;
const Score = db.scoredbs;
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
        console.log(organizer)
        Competition.create({
            organizer_id: organizer.id,
            name: req.body.name,
            minitext: req.body.minitext,
            fulltext: req.body.fulltext,
            datestart: req.body.datestart,
            dateend: req.body.dateend,
            image: req.file.filename,
        }).then((competition) => {
            console.log(competition)
            res.status(200).send({
                message: "creat Competition",
                competitionId: competition.id,
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
            console.log(data)
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
            approval: false,
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

exports.deleteJudge = (req, res) => {
    const id = req.body.competitionId;
    const userId = req.body.userId;
    Competition.findByPk(id).then((competition) => {
        Judge.findOne({
            where: {
                person_id: userId,
                competitiondbId: id,
            }
        }).then(data => {
            competition.removeJudge(data).then(() => {
                Judge.destroy({ where: {
                    id: data.id,
                    }}).then(() => {
                    res.status(200).send({
                        message: "delete Judge",
                    });
                })
            }).catch(() => {
                res.status(500).send({
                    message: "Error deleting Judge",
                });
            });
        })
    })
}

exports.approvalJudge = (req, res) => {
    const judge_id = req.body.judge_id;
    const approval = req.body.approval;
    Judge.update({ approval: approval }, { where: { id: judge_id} })
        .then(() => {
            res.status(200).send("Changed Judge");
        }).catch(err => {
        res.status(500).send({
            message: "Error changing Judge",
            error: err
        });
    });
}

exports.getCompetition = (req, res) => {
    Competition.findAll().then((data) => {
        const promises = data.map(competition => {
            return Organizer.findOne({ where: { id: competition.dataValues.organizer_id } })
                .then(organizer => {
                    return Person.findOne({ where: { id: organizer.dataValues.person_id } })
                        .then(person => {
                            return {
                                id: competition.dataValues.id,
                                name: competition.dataValues.name,
                                minitext: competition.dataValues.minitext,
                                datestart: competition.dataValues.datestart,
                                dateend: competition.dataValues.dateend,
                                image_path: competition.dataValues.image,
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

const fs = require('fs');
exports.sendImage = (req, res) => {
    const { filename } = req.params;
    const filePath = `app/uploads/${filename}`;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        // если клиент запрашивает только часть файла
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'image/jpeg', // или другой формат картинки
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        // если клиент запрашивает весь файл
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'image/jpeg', // или другой формат картинки
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
}

exports.getOneCompetition = async (req, res) => {
    try {
        const competition = await Competition.findOne({ where: { id: req.body.id } });
        const organizer = await Organizer.findOne({ where: { id: competition.organizer_id } });
        const person = await Person.findOne({ where: { id: organizer.person_id } });

        const criterias = await Criteria.findAll({ where: { competitiondbId: competition.id } });
        const judges = await Judge.findAll({ where: { competitiondbId: competition.id } });
        const usersJudge = await Promise.all(judges.map(async judge => {
            const person = await Person.findOne({ where: { id: judge.person_id } });
            return { id: person.id, name: person.name, approval: judge.approval, id_judge: judge.id };
        }));

        const models = await Model.findAll(
            {order: [["score", "DESC"]]},
            { where: { competitiondbId: competition.id } });
        const usersModels = await Promise.all(models.map(async model => {
            const participant = await Participant.findOne({ where: { id: model.participant }});
            const person = await Person.findOne({ where: { id: participant.person_id } });
            return { id: model.id, person_name: person.name,
                     person_id: person.id, name: model.name, view: model.view,
                     scale: model.scale, text: model.text, image: model.image,
                     participant: model.participant, score: model.score,
                     dateupload: model.dateupload, competitiondbId: model.competitiondbId};
        }));

        const response = {
            id: competition.id,
            name: competition.name,
            minitext: competition.minitext,
            fulltext: competition.fulltext,
            datestart: competition.datestart,
            dateend: competition.dateend,
            image_path: competition.image,
            organizer_name: person.name,
            organizer_id: organizer.id,
            criterias: criterias,
            judges: usersJudge,
            models: usersModels
        };
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send({
            message: "Error sending competition",
            error: err
        });
    }
}

exports.deleteCompetition = async (req, res) => {
    const competitionId = req.body.competitionId;
    const organizerId = req.body.organizerId;
    try {
        await Organizer.destroy({ where: { id: organizerId }});
        await Criteria.destroy({ where: { competitiondbId: competitionId }});
        await Judge.destroy({ where: { competitiondbId: competitionId }});

        const models = await Model.findAll({ where: { competitiondbId: competitionId } });
        const participantIds = models.map((model) => model.participant);
        await Participant.destroy({ where: { id: { [Op.in]: participantIds } } });
        await Model.destroy({ where: { competitiondbId: competitionId } });

        const competition = await Competition.findOne({ where: {id: competitionId}});
        await fs.unlink("app/uploads/" + competition.dataValues.image, (err) => {
            if (err) {
                console.error(err);
            }
        });

        await Competition.destroy({ where: {id: competitionId}});

        res.status(200).send('Competition successfully deleted');
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteModel = async (req, res) => {
    const modelId = req.body.modelId;
    const participantId = req.body.participantId;
    try {
        await Score.destroy({where: { model_id: modelId }});
        await Participant.destroy({where: { id: participantId}});
        await Model.destroy({where: { id: modelId }});
        await fs.unlink("app/uploads/" + req.body.image, (err) => {
            if (err) {
                console.error(err);
            }
        });

        res.status(200).send('Competition successfully deleted');
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.update = async (req, res) => {
    const filedata = req.file;
    const competitionId = req.body.competitionId;
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
    Competition.update({
        name: req.body.name,
        minitext: req.body.minitext,
        fulltext: req.body.fulltext,
        datestart: req.body.datestart,
        dateend: req.body.dateend,
        image: filename,
    }, {
        where: {
            id: competitionId,
        }
    }).then(() => {
        res.status(200).send("update competition");
    }).catch((err) => {
        res.status(500).send({
            message: "Error updating competition",
        });
    })
};
