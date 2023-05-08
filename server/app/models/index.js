const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: false,
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.admindbs = require("./admin.model.js")(sequelize, Sequelize);
db.competitiondbs = require("./competition.model.js")(sequelize, Sequelize);
db.criteriadbs = require("./criteria.model.js")(sequelize, Sequelize);
db.judgedbs = require("./judge.model.js")(sequelize, Sequelize);
db.modeldbs = require("./model.model.js")(sequelize, Sequelize);
db.organizerdbs = require("./organizer.model.js")(sequelize, Sequelize);
db.participantdbs = require("./participant.model.js")(sequelize, Sequelize);
db.persondbs = require("./person.model.js")(sequelize, Sequelize);
db.sessiondbs = require("./session.model.js")(sequelize, Sequelize);
db.scoredbs = require("./score.model.js")(sequelize, Sequelize);

module.exports = { sequelize, db };
