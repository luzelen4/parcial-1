const {TVModel, tvSchema} = require('./tv.model');

function setUpModels (sequelize){
    TVModel.init(tvSchema, TVModel.config(sequelize));

}

module.exports = setUpModels;