var express               = require("express"),
    app                   = express(),
    faker                 = require("faker"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    methodOverride        = require("method-override"),
    passport              = require("passport"),
    passportLocal         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressSession        = require("express-session"),
    flash                 = require("connect-flash")
    moment                = require("moment"),
    seedDB                = require("./seeds"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user")

var commentRoutes = require("./routes/comments")
var campgroundRoutes = require("./routes/campgrounds")
var indexRoutes = require("./routes/index")

// for the local route declare DATABANKURL by doing export DATABANKURL=mongodb://localhost/yelp_camp
// for heroku do heroku config:set DATABANKURL=mongodb://laert:5207@ds061158.mlab.com:61158/yelpcamp
mongoose.connect(process.env.DATABANKURL)
// mongoose.connect("mongodb://localhost/yelp_camp")

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static("public"))
app.use(flash())
app.locals.moment = require('moment');

// * Passport Configuration *
app.use(expressSession({
  secret:"jim Belushi", // wil be used to encode and decode the session
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
// takes the data and encodes it and put it in session and deencodes it
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// *------------------------*

// a Midelware will be used to provide current user on every route
app.use(function(req,res,next){
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success")
  res.locals.error=req.flash("error")
  next()
})



// seedDB()  // seed the database

// Refactoring
// you can put a mathching patern in front of indexRoutes , commentRoutes ,campgroundRoutes
// exp: app.use("/campgrounds",campgroundRoutes) and delete /campgrounds from campgrounds.js
// but don't do it
app.use(indexRoutes)
app.use(commentRoutes)
app.use(campgroundRoutes)

// PORT and IP added for local envierment
app.listen(process.env.PORT, process.env.IP,function () {
  console.log("server started");
})

// Notations

// name      url               verb        desc.
// -------------------------------------------------------------------------
// INDEX     /campgrounds      GET     Displays a list of all campgrounds
// NEW       /campgrounds/new  GET     Displays form to make a new campground
// CREATE    /campgrounds      POST    Add new campground to DB
// SHOW      /campgrounds/:id  GET     Shows info about one campground
