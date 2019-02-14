module.exports = (sequelize, Sequelize) => {
    return sequelize.define('contest', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        payment: {
            type: Sequelize.DECIMAL
        },
        text: {
            type: Sequelize.TEXT
        },
        recommendations: {
            type: Sequelize.TEXT
        }
    });
};