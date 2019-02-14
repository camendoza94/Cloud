module.exports = (sequelize, Sequelize) => {
    return sequelize.define('participantRecord', {
        state: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        originalFile: {
            type: Sequelize.STRING
        },
        convertedFile: {
            type: Sequelize.STRING
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        observations: {
            type: Sequelize.TEXT
        }
    });
};