const {Sequelize} = require ('sequelize');
const setUpModels = require('../../db/models');

const sequelize = new Sequelize('tvs','postgres', 'luz123',{
host: 'localhost',
dialect: 'postgres',
logging: true
});

setUpModels (sequelize)

module.exports = sequelize;