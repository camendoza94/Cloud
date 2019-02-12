module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
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
        type: Sequelize.STRING,
        allowNull: false
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false
      }
	});
	
	return User;
}