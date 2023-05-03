module.exports = (sequelize, Sequelize) => {
    return sequelize.define("judgedb", {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        person_id: {
            type: Sequelize.INTEGER,
        },
        approval: {
            type: Sequelize.BOOLEAN,
        },
    },
    {
        timestamps: false,
    });
};
