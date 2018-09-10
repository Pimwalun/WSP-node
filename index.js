var express = require('express')
var path = require('path')
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var flash = require('connect-flash')
var session = require('express-session')
const passport = require('passport')
var config = require('./config/database')

mongoose.connect(config.database); //connect database
let db = mongoose.connection;

db.once('open', function () {
  console.log('connected to MongooDB.')
})

db.on('error', console.error.bind(console, 'connection error.'))

var app = express()

let New = require('./models/new') //เพราะเรา export มาแค่ article
let Trophy = require('./models/trophy');


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Passport Comfig
require('./config/passport')(passport)
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

app.get('/', function (req, res) {
  New.find({}, function (err, news) {
    Trophy.find({}, function(err, trophys) {
      if (err) {
        console.log(err)
      } else {
        res.render('index', {
          new_title: 'News',
          news: news,
          trophy_title: 'Trophy',
          trophys: trophys
        })
      }
    })
  })
})


let news = require('./routes/news')
let trophys = require('./routes/trophys');
let users = require('./routes/users')
app.use('/news', news)
app.use('/trophys', trophys)
app.use('/users', users)

app.listen(4000, function () {
  console.log('Server started on port 4000...')
})
