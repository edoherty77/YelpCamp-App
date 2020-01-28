var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground")
var Comment    = require("../models/comment")

//COMMENTS - NEW
router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
});

//COMMENTS - CREATE
router.post("/", isLoggedIn, function(req, res){
	// LOOKUP CAMPGROUND USING ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			// ("comment" is what we used for the names for the form)
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
	// CREATE NEW COMMENT
	// CONNECT NEW COMMENT TO CAMPGROUND
	//REDIRECT TO SHOW PAGE
})

//FUNCTION TO CHECK IF USER IS LOGGED IN
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;