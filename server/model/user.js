module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
	  firstname: {
        type: Sequelize.STRING,
	  },
	  lastname: {
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