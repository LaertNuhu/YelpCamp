var express =require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")
var geocoder = require('geocoder')


// Current user with req.user -if logedin there is a current user else it is undefined
// we add it to evry route with help of a middleware which is defined before seedDB()
router.get("/campgrounds",function (req ,res) {

  Campground.find({},function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index",{campgrounds:allCampgrounds,page:"campgrounds"})
    }
  })
})

// CREATE
router.post("/campgrounds",middleware.isLoggedIn ,function (req,res) {
  // get data from form and add to campgrounds[]
  var name =req.body.name
  var img = req.body.imageUrl
  var price = req.body.price
  var description = req.body.description
  var author ={
    id: req.user._id,
    username : req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCamp = {name:name,img:img,description:description,author:author,price:price, location: location, lat: lat, lng: lng}
    // create a new campground and save to db
    Campground.create(newCamp,function (err,newCampgroung) {
      if (err) {
        console.log(err);
      } else {
        // redirect
        res.redirect("/campgrounds")
      }
    })
  })
})

// NEW
router.get("/campgrounds/new", middleware.isLoggedIn ,function (req,res) {
  res.render("campgrounds/new")
})



// SHOW
// should come after campgrounds/new becouse it will allwas show
router.get("/campgrounds/:id",function (req,res) {
  // findById
  Campground.findById(req.params.id).populate("comments").exec(function (err , foundCamp) {
    if (err) {
      console.log(err);
    } else {
      // console.log(foundCamp);
      res.render("campgrounds/show",{campground:foundCamp,key:"AIzaSyADVTcEJ4DHZwD7yispNtxB4E0Uohthae4"})
    }
  })

})
// Edit -now every error will be handeled by the middleware
router.get("/campgrounds/:id/edit",middleware.checkCampOwnership ,function (req,res){
  Campground.findById(req.params.id,function (err,Elem) {
    res.render("campgrounds/edit",{Elem:Elem})
  })
})

// Update
router.put("/campgrounds/:id",middleware.checkCampOwnership ,function (req,res) {
  var name =req.body.name
  var img = req.body.imageUrl
  var description = req.body.description
  var price = req.body.price
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var updCamp = {name:name,img:img,description:description,price:price,location: location, lat: lat, lng: lng}
    Campground.findByIdAndUpdate(req.params.id,updCamp,function (err,upd) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back")
      } else {
        res.redirect("/campgrounds/"+req.params.id)
      }
    })
  })
})

//Delete -now every error will be handeled by the middleware
router.delete("/campgrounds/:id", middleware.checkCampOwnership ,function (req,res) {
  Campground.findByIdAndRemove(req.params.id,function (err) {
    res.redirect("/campgrounds")
  })
})

module.exports = router
