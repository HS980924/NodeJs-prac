const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            email:{
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick:{
                
            }
        })
    }

    static associate(db){

    }
}