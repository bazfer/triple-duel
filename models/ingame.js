module.exports = function(sequelize, DataTypes) {
    var Ingame = sequelize.define("Ingame", {
        hand1: {
            type: DataTypes.TEXT,
            allowNull: false
            //defaultValue: ""
        },
        hand2: {
            type: DataTypes.TEXT,
            allowNull: false
            //defaultValue: ""
        },
        board: {
            type: DataTypes.TEXT,
            allowNull: false
            //defaultValue: ""
        }
    }, {
        classMethods: {
            associate: function(models) {
                Ingame.belongsTo(models.Room, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Ingame;
};
