module.exports = (sequelize, Sequelize) => {
    return sequelize.define("imagedb", {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            image: {
                type: Sequelize.TEXT,
            },
            model: {
                type: Sequelize.INTEGER,
            },
        },
        {
            timestamps: false,
        });
};
