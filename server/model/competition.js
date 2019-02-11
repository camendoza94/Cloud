module.exports = (sequelize, Sequelize) => {
	const Competition = sequelize.define('competition', {
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
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
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
	
	return Competition;
}