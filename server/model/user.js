module.exports = (sequelize, Sequelize) => {
    return sequelize.define('user', {
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hash: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        salt: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });
};