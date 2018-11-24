var model = function (sequelize, datatypes) {
	var user = sequelize.define('user', {
		id: {
            type: datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: datatypes.STRING,
        password: datatypes.STRING
    }, { freezeTableName: true , timestamps: false, schema: 'livestream' })

	return user
}

module.exports = model