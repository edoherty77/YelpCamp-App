var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX ROUTE
router.get("/", function(req, res){
	//GET ALL CAMPGROUNDS FROM DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});	
});

//CREATE CAMPGROUND
router.post("/", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	//CREATE NEW CAMPGROUND AND SAVE TO DATABASE
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//REDIRECT TO CAMPGROUNDS PAGE
			res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new")
})


//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	//FIND THE CAMPGROUND WITH PROVIDED ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//RENDER SHOW TEMPLATE WITH THAT CAMPGROUND
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//FUNCTION TO CHECK IF USER IS LOGGED IN
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;