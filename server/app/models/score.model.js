module.exports = (sequelize, Sequelize) => {
    return sequelize.define("scoredb", {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            model_id: {
                type: Sequelize.INTEGER,
            },
            criteria_id: {
                type: Sequelize.INTEGER,
            },
            judge_id: {
                type: Sequelize.INTEGER,
            },
            score: {
                type: Sequelize.INTEGER,
            },
        },
        {
            timestamps: false,
        });
};
