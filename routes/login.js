var express = require('express')
var bcrypt = require('bcrypt')
var jsonwebtoken = require('jsonwebtoken')
var services = require('../services')
var config = require('../config')
var db = require('../database')

var op = db.driver.Op

var router = express.Router()

router.get('/', function(req, res, next) {
    services.verify(req.cookies.authentication, function (error, decoded) {
        if (error ) {
            res.render('login')
        } else {
            res.redirect('/livestream')
        }
    })
})

router.post('/login', function (req, res, next) {
    db.user.findOne({
        where: {
            username: req.body.username
        }
    }).then(function (user) {
        if (user === null) {
            res.sendStatus(401)
        } else {
            bcrypt.compare(req.body.password, user.password, function (error, compare) {
                if (compare === true) {
                    // password authenticated
                    var payload = { id: user.id, name: user.username }
                    var token = jsonwebtoken.sign(payload, config.secret, { expiresIn: '7d' })

                    res.json({ token: token })
                } else {
                    res.sendStatus(401)
                }
            })
        }
    }).catch(function (error) {
        res.json({ error: error })
    })
})

router.post('/register', function (req, res, next) {
    db.user.findOne({
        where: {
            username: req.body.username.toLowerCase()
        }
    }).then(function (user) {
        if (user === null) {
            var hash = bcrypt.hashSync(req.body.password, 10)
            db.user.create({
                username: req.body.username,
                password: hash,
                icon: null
            }).then(function () {
                res.sendStatus(200)
            })
        } else {        
            res.json({ error: 'Username already exists' })
        }
    }).catch(function (error) {
        res.json({ error: error })
    })
})

router.post('/reset', function (req, res, next) {
    res.json({})
})

module.exports = router