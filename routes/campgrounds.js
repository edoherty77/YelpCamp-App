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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground})		
	});
})

//UPDATE CAMPGROUND
router.put("/:id", checkCampgroundOwnership, function(req, res){
	//FIND AND UPDATE THE CORRECT CAMPGROUND
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res. redirect("/campgrounds/" + req.params.id)
		}
	})
	//REDIRECT SOMEWHERE(SHOW PAGE)
})

//DELETE ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})

//FUNCTION TO CHECK IF USER IS LOGGED IN
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back")
			} else {
				//DOES USER OWN CAMPGROUND
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back")
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

module.exports = router;