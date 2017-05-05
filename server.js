var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var session = require('client-sessions');

var session  = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash    = require('connect-flash');

// To work on Heroku / Port to listen to
var port = process.env.PORT || 8080;
var app = express();

var db = require("./models");

require('./config/passport')(passport);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// app.use(session({
//     cookieName: 'session',
//     secret: 'zsfasfhdzbdgazsdfhdgnhmkuili',
//     duration: 30 * 60 * 1000,
//     activeDuration: 5 * 60 * 1000,
// }));
app.use(session({
	secret: 'zsfasfhdzbdgazsdfhdgnhmkuili',
	resave: true,
	saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Serve static content for the app from the "public" directory in the application directory.

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars
/*var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");*/

// Import routes and give the server access to them.
app.use(express.static("./public"));

var http = require('http').Server(app);
var io = require('socket.io')(http);

//require("./components/app.js");

//require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app,passport);
require("./routes/socket.js")(io);

db.sequelize.sync().then(function() {
    //app.listen(port, function() {
    http.listen(port, function() {
        console.log("App listening on port " + port);
    });
});
