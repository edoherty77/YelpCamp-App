var express       = require("express"),
	bodyParser    = require("body-parser"),
	app           = express(),
	mongoose      = require("mongoose"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment"),
	User          = require("./models/user"),
	seedDB        = require("./seeds"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "anything can go here",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true)
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");



app.get("/", function(req, res){
	res.render("campgrounds/landing")
});

app.get("/campgrounds", function(req, res){
	//GET ALL CAMPGROUNDS FROM DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});	
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
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

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new")
})


//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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


// =====================================
// COMMENT ROUTES
// =====================================

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
});

app.post("/campgrounds/:id/comments", function(req, res){
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







app.listen(3000, function(){
	console.log("The YelpCamp server has started")
})