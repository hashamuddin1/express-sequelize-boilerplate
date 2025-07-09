const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.js').development;

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

db.User = require('./user')(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;