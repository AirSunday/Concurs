const db = require("../models").db;
var sequelize = require("sequelize");
const Person = db.persondbs;
const Image = db.imagedbs;
const Judge = db.judgedbs
const Criteria = db.criteriadbs;
const Model = db.modeldbs;
const Organizer = db.organizerdbs;
const Competition = db.competitiondbs;
const Participant = db.participantdbs;
const Score = db.scoredbs;
const Op = db.Sequelize.Op;
const fs = require('fs');

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
    const filedata = req.files;
    if(!filedata)
        res.send("Ошибка при загрузке файла");

    const imageName = filedata[0].filename;
    let fileName = '';
    if(filedata[1]){
        fileName = filedata[1].filename;
    }

    CreateOrganizer(req.body.userId, res).then((organizer) => {
        Competition.create({
            organizer_id: organizer.id,
            name: req.body.name,
            category: req.body.category,
            minitext: req.body.minitext,
            fulltext: req.body.fulltext,
            datestart: req.body.datestart,
            dateend: req.body.dateend,
            image: imageName,
            fileDop: fileName,
        }).then((competition) => {
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
    const dateNow = new Date();
    Competition.findAll({
        where: sequelize.literal(`"dateend" >= '${dateNow.toISOString()}'`)
    }).then((data) => {
        const promises = data.map(competition => {
            return Organizer.findOne({ where: { id: competition.dataValues.organizer_id } })
                .then(organizer => {
                    return Person.findOne({ where: { id: organizer.dataValues.person_id } })
                        .then(person => {
                            return {
                                id: competition.dataValues.id,
                                name: competition.dataValues.name,
                                category: competition.dataValues.category,
                                minitext: competition.dataValues.minitext,
                                datestart: competition.dataValues.datestart,
                                dateend: competition.dataValues.dateend,
                                image_path: competition.dataValues.image,
                                fileDop: competition.dataValues.fileDop,
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

exports.getCompetitionEnd = (req, res) => {
    const dateNow = new Date();
    Competition.findAll({
        where: sequelize.literal(`"dateend" < '${dateNow.toISOString()}'`)
    }).then((data) => {
        const promises = data.map(competition => {
            return Organizer.findOne({ where: { id: competition.dataValues.organizer_id } })
                .then(organizer => {
                    return Person.findOne({ where: { id: organizer.dataValues.person_id } })
                        .then(person => {
                            return {
                                id: competition.dataValues.id,
                                name: competition.dataValues.name,
                                category: competition.dataValues.category,
                                minitext: competition.dataValues.minitext,
                                datestart: competition.dataValues.datestart,
                                dateend: competition.dataValues.dateend,
                                image_path: competition.dataValues.image,
                                fileDop: competition.dataValues.fileDop,
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

const { promisify } = require('util');
const access = promisify(fs.access);
exports.sendImage = async (req, res) => {
    const { filename } = req.params;
    let filePath = `app/uploads/${filename}`;
    try {
        await access(filePath, fs.constants.F_OK);
    } catch (err) {
        filePath = 'app/uploads/no_image';
    }
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

exports.sendFile = (req, res) => {
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
            'Content-Type': 'application/pdf', // или другой формат картинки
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        // если клиент запрашивает весь файл
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'application/pdf', // или другой формат картинки
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

        const models = await Model.findAll({
                    order: [["score", "DESC"]],
                    where: { competitiondbId: competition.id }
        });
        const usersModels = await Promise.all(models.map(async model => {
            const participant = await Participant.findOne({ where: { id: model.participant }});
            const person = await Person.findOne({ where: { id: participant.person_id } });
            return { id: model.id, person_name: person.name,
                     person_id: person.id, name: model.name, view: model.view,
                     scale: model.scale, text: model.text,
                     participant: model.participant, score: model.score,
                     dateupload: model.dateupload, competitiondbId: model.competitiondbId};
        }));

        const response = {
            id: competition.id,
            name: competition.name,
            category: competition.category,
            minitext: competition.minitext,
            fulltext: competition.fulltext,
            datestart: competition.datestart,
            dateend: competition.dateend,
            image_path: competition.image,
            fileDop: competition.fileDop,
            organizer_name: person.name,
            imageUrlPerson: person.photo,
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
        await Promise.all(models.map(async (model) => {
            const images = await Image.findAll({ where: { model: model.id } });
            await Promise.all(images.map(async (image) => {
                await fs.unlink("app/uploads/" + image.image, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }));
            await Image.destroy({ where: { model: model.id } });
        }))
        const participantIds = models.map((model) => model.participant);
        await Participant.destroy({ where: { id: { [Op.in]: participantIds } } });
        await Model.destroy({ where: { competitiondbId: competitionId } });

        const competition = await Competition.findOne({ where: {id: competitionId}});
        await fs.unlink("app/uploads/" + competition.dataValues.image, (err) => {
            if (err) {
                console.error(err);
            }
        });
        if(competition.dataValues.fileDop !== '')
        await fs.unlink("app/uploads/" + competition.dataValues.fileDop, (err) => {
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
        const images = await Image.findAll({ where: { model: modelId } });
        await Promise.all(images.map(async (image) => {
            await fs.unlink("app/uploads/" + image.image, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }));
        await Image.destroy({ where: { model: modelId } });

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
        category: req.body.category,
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

exports.GetParticipants = async (req, res) => {
    try {
        const personId = req.body.personId;
        const participants = await Participant.findAll({where: {person_id: personId}});
        const modelPromises = participants.map((participant) => {
            return Model.findAll({where: {participant: participant.id}});
        });
        const models = await Promise.all(modelPromises);
        const competitionPromises = models.map((model) => {
            return Competition.findAll({where: {id: model[0].competitiondbId}});
        });
        const competitions = await Promise.all(competitionPromises);
        res.status(200).send(competitions);
    }
    catch {
        res.status(500).send({
            message: "Error getting participants",
        });
    }
}

exports.GetJudges = async (req, res) => {
    try {
        const personId = req.body.personId;
        const judges = await Judge.findAll({where: {person_id: personId, approval: true}});
        const competitionPromises = judges.map((judges) => {
            return Competition.findAll({where: {id: judges.competitiondbId}});
        });
        const competitions = await Promise.all(competitionPromises);
        res.status(200).send(competitions);
    }
    catch {
        res.status(500).send({
            message: "Error getting Judges",
        });
    }
}

exports.GetOrganizers = async (req, res) => {
    try {
        const personId = req.body.personId;
        const organizers = await Organizer.findAll({where: {person_id: personId}});
        const competitionPromises = organizers.map((organizer) => {
            return Competition.findAll({where: {organizer_id: organizer.id}});
        });
        const competitions = await Promise.all(competitionPromises);
        res.status(200).send(competitions);
    }
    catch {
        res.status(500).send({
            message: "Error getting Organizers ",
        });
    }
}

exports.getWinner = async (req, res) => {
    try {
        const competitionId = req.body.competitionId;
        const models = await Model.findAll({
            order: [["score", "DESC"]],
            limit: 3,
            where: { competitiondbId: competitionId }
        });
        const usersModels = await Promise.all(models.map(async model => {
            const participant = await Participant.findOne({ where: { id: model.participant }});
            const person = await Person.findOne({ where: { id: participant.person_id } });
            return { id: model.id, person_name: person.name, name: model.name, score: model.score };
        }));
        res.status(200).send(usersModels);
    } catch (err) {
        res.status(500).send({
            message: "Error sending competition",
            error: err
        });
}
}

exports.getCriteria = (req, res) => {
    const competitionId = req.body.competitionId;
    Criteria.findAll({where: {competitiondbId: competitionId}})
        .then(criteria => {
            res.status(200).send(criteria);
        })
        .catch(() => {
            res.status(500).send('Error sending criteria')
        })
}
