var express =require("express")
var router = express.Router()
var Campground = require("../models/campground")
var Comment = require("../models/comment"),
    passport= require("passport"),
    User = require("../models/user")


router.get("/",function (req,res) {
  res.render("home")
})

// SignUp
router.get("/signup",function (req,res) {
  res.render("signup",{page:"signup"})
})

router.post("/signup",function (req,res) {
  var username = req.body.username
  var password = req.body.password
  var newUser =new User({username:username})
  User.register(newUser,password,function (err,user) {
    if (err) {
      console.log(err);
      req.flash("error",err.message)
      return res.redirect("/signup")
    }
    passport.authenticate("local")(req,res,function () {
      req.flash("success","Welcome "+ user.username)
      res.redirect("/campgrounds")
    })
  })

})

// Login
router.get("/login",function (req,res) {
  res.render("login",{page:"login"})
})
// router.post("/login",middleware,callback)
router.post("/login",passport.authenticate("local",{   // middleware
  successRedirect:"/campgrounds",                   // middleware
  failureRedirect:"/login"                          // middleware
}),function (req,res) {

})

// Logout
router.get("/logout",function (req,res) {
  req.logout()
  req.flash("success","Logged you out!")
  res.redirect("/campgrounds")
})

module.exports = router
