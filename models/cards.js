module.exports = function(sequelize, DataTypes) {
    var Cards = sequelize.define("Cards", {
        /*name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 150]
            }
        },*/
        powers: {
            type: DataTypes.TEXT,
            allowNull: false
        }/*,
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 150]
            }
        }*/
    });
    return Cards;
};
