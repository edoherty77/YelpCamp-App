var express = require("express");
var router = express.Router();
var passport = require("passport")
var User = require("../models/user")

//ROOT ROUTE
router.get("/", function(req, res){
	res.render("campgrounds/landing")
});



//==================================================
//AUTH ROUTES
//==================================================
	
//SHOW REGISTER FORM
router.get("/register", function(req, res){
	res.render("register")
})

//HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user) {
		if(err){
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds")
		})
	})
})


//SHOW LOGIN FORM
router.get("/login", function(req, res){
	res.render("login")
})

//HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
	
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
})

//FUNCTION TO CHECK IF USER IS LOGGED IN
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;