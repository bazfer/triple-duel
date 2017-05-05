module.exports = function(sequelize, DataTypes) {
    var User_Record = sequelize.define("User_Record", {
        wins: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        losses: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        disconnects: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                User_Record.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return User_Record;
};