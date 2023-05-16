const db = require("../models").db;
var sequelize = require("sequelize");
const fs = require("fs");
const Model = db.modeldbs;
const Image = db.imagedbs;
const Participant = db.participantdbs;
const Competition = db.competitiondbs;
const Score = db.scoredbs;
const Person = db.persondbs;
const Judge = db.judgedbs;
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

exports.create = async (req, res) => {
    try {
        const filedata = req.files;
        if (!filedata)
            res.send("Ошибка при загрузке файла");

        const userId = await FindSession(req);
        const participant = await CreateParticipant(userId);
        const today = new Date();
        const model = await Model.create({
            participant: participant.id,
            name: req.body.name,
            view: req.body.view,
            scale: req.body.scale,
            text: req.body.text,
            score: 0,
            dateupload: today,
        });
        await Promise.all(filedata.map(async (image) => {
            await Image.create({
                model: model.id,
                image: image.filename
            })
        }))
        const competition = await Competition.findByPk(req.body.competitionId);
        await competition.addModel(model);

        res.status(200).send({
            message: "creat Model",
        });
    }
    catch{
        res.status(500).send({
            message: "Error creating Model",
        });
    }
};

exports.update = async (req, res) => {
    try {
        const filedata = req.files;
        const modelId = req.body.modelId;
        if(filedata) {
            const images = await Image.findAll({ where: { model: modelId } });
            await Promise.all(images.map(async (image) => {
                await fs.unlink("app/uploads/" + image.image, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }));
            await Image.destroy({ where: { model: modelId } });
            await Promise.all(filedata.map(async (image) => {
                console.log(image);
                await Image.create({
                    model: modelId,
                    image: image.filename
                })
            }))
        }

        await Model.update({
            name: req.body.name,
            view: req.body.view,
            text: req.body.text,
            scale: req.body.scale,
        }, {
            where: {
                id: modelId,
            }
        })

        res.status(200).send({
            message: "update Model",
        });
    }
    catch{
        res.status(500).send({
            message: "Error updating Model",
        });
    }
};

exports.sendScore = async (req, res) => {
    const criteriaId = req.body.criteriaId;
    const competitionId = req.body.competitionId;
    const modelId = req.body.modelId;
    const maxScore = req.body.maxScore;
    const score = req.body.score;

    const personId = await FindSession(req)

    const judge = await Judge.findOne({where: {
        person_id: personId,
        competitiondbId: competitionId,
    }})

    const findScore = await Score.findOne({where: {
            model_id: modelId,
            criteria_id: criteriaId,
            judge_id: judge.id,
        }})

    if(findScore){
        await Score.update( {score: score},  {where: {
                id: findScore.dataValues.id
            }})
    }
    else {
        await Score.create({
            model_id: modelId,
            criteria_id: criteriaId,
            judge_id: judge.id,
            score: score,
            maxscore: maxScore,
        })
    }

    const nowScore = await Score.findAll({where: {model_id: modelId}});

    let mathScore = 0;
    await nowScore.forEach(score => mathScore += parseFloat((100 * score.score / score.maxscore).toFixed(2)));

    mathScore = parseFloat((mathScore / nowScore.length).toFixed(2));

    await Model.update({
        score: mathScore,
    }, { where: {id: modelId}})
    .then(() => {
        res.status(200).send("Add score");
    }).catch((err) => {
        res.status(500).send({
            message: "Error adiing score",
        });
    })
}

exports.getScore = async (req, res) => {
    try {
        const modelId = req.body.modelId;
        const competitionId = req.body.competitionId;

        const personId = await FindSession(req);

        const judge = await Judge.findOne({
            where: {
                person_id: personId,
                competitiondbId: competitionId,
            }
        })
        let criterias = [];
        if(judge)
            criterias = await Score.findAll({
                where: {
                    model_id: modelId,
                    judge_id: judge.id,
                }
            })

        res.status(200).send(criterias);
    }
    catch{
        res.status(500).send("Error in geting score");
    }
}

exports.getOneModel = async (req, res) => {
    try {
        const model = await Model.findOne({where: {id: req.body.id}});
        const participant = await Participant.findOne({where: {id: model.participant}});
        const person = await Person.findOne({where: {id: participant.person_id}});
        const images = await Image.findAll({where: {model: req.body.id }})

        res.status(200).send({
            ...model,
            person_id: person.id,
            person_name: person.name,
            imageUrlPerson: person.photo,
            ...images,
        });
    } catch (err) {
        res.status(500).send({
            message: "Error sending competition",
            error: err
        });
    }
}

exports.GetModelImages = async (req, res) => {
    try {
        const modelId = req.body.modelId;
        const images = await Image.findAll({where: {model: modelId}});
        res.status(200).send(images);
    }
    catch{
        res.status(500).send({
            message: "Error sending image Model",
        });
    }
}

exports.getCountModel = async (req, res) => {
    try {
        const competitionId = req.body.competitionId;
        const userId = await FindSession(req);
        const participants = await Participant.findAll({ where: { person_id: userId } });

        let count = 0;
        for (const participant of participants) {
            const model = await Model.findOne({ where: { participant: participant.id, competitiondbId: competitionId } });
            if (model) {
                count++;
            }
        }

        res.send({ count: count });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred' });
    }
}
