module.exports = function(sequelize, DataTypes) {
    var Room = sequelize.define("Room", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 150]
            }
        },
        guest: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        winner: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        classMethods: {
            associate: function(models) {
                Room.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Room;
};
