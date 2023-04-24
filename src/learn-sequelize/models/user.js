const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    // static init() 메서드는 테이블에 대한 설정
    static init(sequelize){
        // super.init() 메서드
        // 첫번째 인수는 테이블 컬럼에 대한 설정
        // 두번째 인수는 테이블 자체에 대한 설정
        // 시퀄라이즈의 자료형은 MySQL의 자료형과는 다르다.
        // varchar -> STRING
        // INT -> INTEGER
        // TINYINT -> BOOLEAN
        // DATETIME -> DATE
        // Not Null -> allowNull
        // UNIQUE -> unique
        return super.init({
            name:{
                type:Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age:{
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married:{
                type:Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type:Sequelize.TEXT,
                allowNull: true,
            },
            created_at:{
                type:Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    // static associate 메서드는 다른 모델과의 관계를 적을 때 사용
    static associate(db){
        db.User.hasMany(db.Comment,{foreignKey:'commenter', sourceKey:'id'} );
    }
};