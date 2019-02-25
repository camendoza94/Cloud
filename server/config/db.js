const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    operatorsAliases: false,

    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('../model/user.js')(sequelize, Sequelize);
db.contests = require('../model/contest.js')(sequelize, Sequelize);
db.participantRecords = require('../model/participantRecord.js')(sequelize, Sequelize);

// Associations
// User - Contest
db.users.hasMany(db.contests);
db.contests.belongsTo(db.users);

// Contest - ParticipantRecord
db.contests.hasMany(db.participantRecords, {onDelete: 'CASCADE'});
db.participantRecords.belongsTo(db.contests);
db.contests.hasOne(db.participantRecords, {as: 'winner'});


module.exports = db;