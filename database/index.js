var sequelize = require('sequelize')
var path = require('path')
var fs = require('fs')

var driver = new sequelize({
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    dialect: 'postgres',
    database: 'core',
    operatorsAliases: false,
    logging: false,
    dialectOptions: {
        encrypt: true,
        requestTimeout: 60000
    },
    pool: {
        max: 100,
        idle: 30000,
        acquire: 60000,
    }
})

var db = {
	driver: driver
}

fs.readdirSync(__dirname + '/models').filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js' && file !== path.basename(__filename)).forEach(function (file) {
    var model = db.driver.import(path.join(__dirname + '/models/', file))
    db[model.name] = model
})

Object.keys(db).forEach(function (model) {
  if (db[model].associate) {
    db[model].associate(db)
  }
})

module.exports = db