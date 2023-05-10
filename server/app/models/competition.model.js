module.exports = (sequelize, Sequelize) => {
    return sequelize.define("competitiondb", {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        organizer_id: {
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.TEXT,
        },
        minitext: {
            type: Sequelize.TEXT,
        },
        fulltext: {
            type: Sequelize.TEXT,
        },
        datestart: {
            type: Sequelize.DATE,
        },
        dateend: {
            type: Sequelize.DATE,
        },
        image: {
            type: Sequelize.TEXT,
        },
        fileDop: {
            type: Sequelize.TEXT,
        },

    },
    {
        timestamps: false,
    });
};
