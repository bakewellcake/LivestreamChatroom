var model = function (sequelize, datatypes) {
	var history = sequelize.define('history', {
		id: {
            type: datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: datatypes.INTEGER,
        message: datatypes.STRING,
        created_datetime: datatypes.DATE
    }, { freezeTableName: true , timestamps: false, schema: 'livestream' })

    history.associate = function (model) {
        history.belongsTo(model.user, {
            foreignKey: 'user_id',
            as: 'FK_User'
        })
    }

	return history
}

module.exports = model