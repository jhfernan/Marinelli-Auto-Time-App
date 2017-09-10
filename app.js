const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const home = require('./routes/home');
const projectsApi = require('./routes/apis/project_api');

const mongoose = require('mongoose');
const Promise = require('bluebird');

const app = express();

// Mongo Connections Setup/Options
let url = 'mongodb://localhost/mautotimekeeper';
if (app.get('env') === 'production') {
	url = process.env.MONGODB_URI;
}
const mongooseOptions = {
	useMongoClient: true,
	reconnectTries: 30
}

// Connect
mongoose.connect(url, mongooseOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// require('./seed.js');
	console.log('Successfully connected to mongo db!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);

app.use('/api', projectsApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('layouts/error');
});

module.exports = app;
