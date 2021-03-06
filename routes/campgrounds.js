var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, price: price, author: author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground})		
	});
})

//UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
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
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})





module.exports = router;