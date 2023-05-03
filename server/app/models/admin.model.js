module.exports = (sequelize, Sequelize) => {
    return sequelize.define("admindb", {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        person_id: {
            type: Sequelize.INTEGER,
        },
    },
    {
        timestamps: false,
    });
};
