var express = require('express')
var expressEjsLayouts = require('express-ejs-layouts')
var cookieParser = require('cookie-parser')
var http = require('http')
var bodyParser = require('body-parser')
var io = require('socket.io')
var moment = require('moment')
var jsonwebtoken = require('jsonwebtoken')
var fs = require('fs')
var readline = require('readline')
var services = require('./services')
var db = require('./database')

var login = require('./routes/login')
var livestream = require('./routes/livestream')

var app = express()
var server = http.createServer(app)
var socket = io(server)

socket.on('connection', function(event) {
	event.on('auth', function (auth) {
		services.verify(auth, function (error) {
			if (!error) {				
				event.on('msg', function(msg){
					var user = jsonwebtoken.decode(auth)
					var now = moment().toJSON()

					db.history.create({
						user_id: user.id,
						message: msg,
						created_datetime: now
					}).then(function (data) {
						var message = {
							id: data.id,
							user_id: data.user_id,
							name: user.name,
							message: data.message,
							created_datetime: data.created_datetime
						}

						socket.emit('msg', message)
					}).catch(function (error) {
						next(error)
					})
				})
			}
		})
	})
})

app.set('views', [
    './views',
    './views/login',
    './views/livestream',
])
app.set('view engine', 'ejs')

app.use('/public', express.static('./public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(expressEjsLayouts)
app.use('/', login)
app.use('/livestream/', livestream)

app.use(function(error, req, res, next) {
	console.log(error)
	res.status(500).send(error)
})

server.listen(4401, function () {
	console.log('Livestream server started at port 4401...')

	var messages = []
	var rl = readline.createInterface({
		input: fs.createReadStream('./messages.txt'),
		crlfDelay: Infinity
	})
	  
	rl.on('line', (line) => {
		messages.push(line)
	})

	// code above doesn't seem to like this self-running function without the scope around it...
	{
		(function loop() {
			var rand = Math.floor(Math.random() * 10000)
			var index = Math.floor(Math.random() * messages.length)
			var user = Math.floor(Math.random() * 10) + 1
			var now = moment().toJSON()
			
			setTimeout(function() {
				db.history.create({
					user_id: user,
					message: messages[index],
					created_datetime: now
				}).then(function (data) {
					db.user.findOne({
						where: {
							id: user
						}
					}).then(function (user) {
						var message = {
							id: data.id,
							user_id: data.user_id,
							name: user.username,
							message: data.message,
							created_datetime: data.created_datetime
						}
	
						socket.emit('msg', message)
	
						loop()
					})
				}).catch(function (error) {
					console.log(error)
					process.exit()
				})
			}, rand)
		}())
	}
})