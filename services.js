var jsonwebtoken = require('jsonwebtoken')
var config = require('./config')
var db = require('./database')

var services = {
    authorise: function (req, res, next) {
        if (req.cookies.authentication) {
            services.verify(req.cookies.authentication, function (error, decoded) {
                if (error) {
                    res.redirect('/')
                } else {
                    db.user.findOne({
                        where: {
                            id: decoded.id
                        }
                    }).then(function (user) {
                        if (user === null) {
                            res.redirect('/')
                        } else {    
                            next()
                        }
                    }, function (error) {
                        res.render('503')
                    })
                }
            })
        } else {
            res.redirect('/')
        }
    },
    verify: function (auth, callback) {
        jsonwebtoken.verify(auth, config.secret, function (error, decoded) {
            callback(error, decoded)
        })
    }
}

module.exports = services