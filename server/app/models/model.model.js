module.exports = (sequelize, Sequelize) => {
    return sequelize.define("modeldb", {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.TEXT,
        },
        view: {
            type: Sequelize.TEXT,
        },
        scale: {
            type: Sequelize.TEXT,
        },
        text: {
            type: Sequelize.TEXT,
        },
        participant: {
            type: Sequelize.INTEGER,
        },
        score: {
            type: Sequelize.FLOAT,
        },
        dateupload: {
            type: Sequelize.DATE,
        }
    },
    {
        timestamps: false,
    });
};
