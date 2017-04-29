var Campground = require("../models/campground")
var Comment = require("../models/comment")

var middlewareObj = {
  isLoggedIn: function (req,res,next){
    if(req.isAuthenticated()){
      return next()
    }
    req.flash("error","Please Login First!")
    res.redirect("/login")
  },
  checkCampOwnership: function (req,res,next){
    // is user logged in
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id,function (err,Elem) {
        if (err) {
          req.flash("error",err.message)
          res.redirect("back")
        } else {
          // does the user own campground
          if (Elem.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error","You don't have permission")
            res.redirect("back")
          }
        }
      })
    }else {
      // console.log("need to be logged in");
      req.flash("error","You need to bee logged in!")
      res.redirect("back")
    }
  },
  checkCommentOwnership : function (req,res,next){
    // is user logged in
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id,function (err,Elem) {
        if (err) {
          req.flash("error",err.message)
          res.redirect("back")
        } else {
          // does the user own campground
          if (Elem.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error","You don't have permission")
            res.redirect("back")
          }
        }
      })
    }else {
      // console.log("need to be logged in");
      req.flash("error","You need to bee logged in!")
      res.redirect("back")
    }
  }
}

module.exports = middlewareObj
