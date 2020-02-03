var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

//COMMENTS - NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
});

//COMMENTS - CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
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
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back")
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		}
	})
})

//COMMENTS - UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//COMMENTS - DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})






module.exports = router;