module.exports = (sequelize, Sequelize) => {
    return sequelize.define("criteriadb", {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.TEXT,
        },
        maxscore: {
            type: Sequelize.INTEGER,
        },
    },
    {
        timestamps: false,
    });
};
