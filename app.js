var express        = require("express"),
	bodyParser     = require("body-parser"),
	app            = express(),
	mongoose       = require("mongoose"),
	methodOverride = require("method-override"),
	Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	flash          = require("connect-flash"),
	User           = require("./models/user"),
	seedDB         = require("./seeds"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local");

//REQUIRING ROUTES
var commentRoutes     = require("./routes/comments"),
	campgroundRoutes  = require("./routes/campgrounds"),
	indexRoutes       = require("./routes/index")
	

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
app.use(methodOverride("_method"));
app.use(flash());

//A MIDDLEWARE FOR EVERY ROUTE IN ORDER TO REQ.USER
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next();
})

app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)



app.listen(3000, function(){
	console.log("The YelpCamp server has started")
})