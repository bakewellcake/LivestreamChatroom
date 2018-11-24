var express = require('express')
var services = require('../services')
var db = require('../database')

var op = db.driver.Op

var router = express.Router()

router.use(services.authorise)

router.get('/', function(req, res, next) {
    res.render('livestream')
})

router.get('/history', function (req, res, next) {
    db.history.findAll({
        include: [
            {
                model: db.user,
                as: 'FK_User'
            }
        ]
    }).then(function (data) {
        var messageHistory = data.map(function (element) {
            return {
                id: element.id,
                user_id: element.user_id,
                name: element.FK_User.username,
                message: element.message,
                created_datetime: element.created_datetime
            }
        })

        res.json(messageHistory)
    }).catch(function (error) {
        next(error)
    })
})

module.exports = router