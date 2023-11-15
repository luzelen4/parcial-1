const {Model, DataTypes} = require('sequelize');

const TV_TABLE = 'tvs';

const tvSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marca:{
        type: DataTypes.STRING,
        allowNull: false
    },
    referencia:{
        type: DataTypes.STRING,
        allowNull: false
    },
    modelo:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pulgadas:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    }
};

class TVModel extends Model{
    static associate(models){
        // this.belongsTo(models.UserModel, {foreignKey: 'user:id', as: 'User'});
    }

    static config(sequelize){ //envia la conexion a la base de datos
        return {
            sequelize,
            tableName: TV_TABLE,
            modelName: 'tv',
            timestamps: false
        }
    }
}

module.exports = {TV_TABLE, tvSchema, TVModel};