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
					//ADD USERNAME AND ID TO COMMENT
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//SAVE COMMENT
					comment.save()
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

//COMMENTS - EDIT
router.get("/:comment_id/edit", function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back")
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		}
	})
})

//COMMENTS - UPDATE
router.put("/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//COMMENTS - DESTROY
router.delete("/:comment_id", function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/campgrounds/" + req.params.id)
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

module.exports = router;