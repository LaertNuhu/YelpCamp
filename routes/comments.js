var express =require("express")
var router = express.Router()
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")

// New
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn ,function (req,res) {
  // "Comments Form"
  Campground.findById(req.params.id,function (err,campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new",{campground:campground})
    }
  })
})

// Create
router.post("/campgrounds/:id/comments",middleware.isLoggedIn ,function (req,res) {
  var text = req.body.text
  var author = req.body.author
  var newComment = {text:text,author:author}

  // lookup campground using id
  Campground.findById(req.params.id,function (err,campground) {
    if (err) {
      console.log(err);
    }else {
      // create new comment
      Comment.create(newComment,function (err,comment) {
        if (err) {
          req.flash("error",err.message)
          console.log(err);
        } else {
          // connect new comment to campground
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()
          campground.comments.push(comment)
          campground.save()
          // redirect to showpage
          req.flash("success","Added")
          res.redirect("/campgrounds/"+req.params.id)
        }
      })
    }
  })
})

// Edit
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership ,function (req,res) {
    Comment.findById(req.params.comment_id ,function (err, comment) {
      if (err) {
        res.redirect("back")
      } else {
        res.render("comments/edit",{campground:req.params.id,comment:comment})
      }
  })
})


// Update
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership ,function (req,res) {
  var text = req.body.text
    Comment.findByIdAndUpdate(req.params.comment_id ,{text:text},function (err, updComment) {
      if (err) {
        res.redirect("back")
      } else {
        res.redirect("/campgrounds/"+req.params.id)
      }
    })
})


// Desert
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership ,function (req,res) {
  Comment.findByIdAndRemove(req.params.comment_id,function (err) {
    req.flash("success","Deleted")
    res.redirect("/campgrounds/"+req.params.id)
  })
})

module.exports = router
