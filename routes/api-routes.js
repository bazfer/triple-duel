// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");
// Routes
// =============================================================
module.exports = function(app,passport) {
    // load the index.ejs file
  app.get('/', function(req, res) {
		res.render('index', null);

	});

    // render the page and pass in any flash data if it exists
	/*app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage') });
	});*/

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            //successRedirect : '/game', // redirect to the secure game section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        //res.redirect('/');
				/*res.sendFile("C:/wamp64/www/project/new-tri-monster/public/index.html", {
				//res.sendFile(__dirname + "/../public/index.html", {
					user : req.user // get the user out of session and pass to template
				});*/
				var userInfo = {
					login: req.user.login,
					id: req.user.id
				}
				res.send(userInfo);
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
    // render the page and pass in any flash data if it exists
	app.get('/signup', function(req, res) {
		res.render('signup', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure game section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// GAME SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
		// CDN

	app.get('/game', isLoggedIn, function(req, res) {
    /*console.log('----------------------------------');
    console.log('----------------------------------');
    console.log('----------------------------------');
    console.log('---------- GAME LOADED! ----------');
    console.log('----------------------------------');
    console.log('----------------------------------');
    console.log('----------------------------------');*/
		/*res.render('#/game', {
			user : req.user // get the user out of session and pass to template
		});*/
		res.sendFile("C:/wamp64/www/project/new-tri-monster/public/index.html", {
		//res.sendFile(__dirname + "/../public/index.html", {
			user : req.user // get the user out of session and pass to template
		});
	});
	// route to get leaderboards data
	app.get('/leaderboard', (req, res) => {
		var query = {};
		db.User_Record.findAll({
			where: query,
			order: [
				['wins','desc']
			],
      include: [db.User]
		}).then((payload) => {
			res.json(payload);
		})
	})



	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
