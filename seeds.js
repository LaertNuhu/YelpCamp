// var mongoose = require("mongoose"),
var Campground = require("./models/campground"),
    Comment   = require("./models/comment"),
    moment    = require("moment")



    var data =[
      {
        name:"Cloud's Rest",
        img:"http://www.earlychildhoodeducationzone.com/wp-content/uploads/2015/04/Camp-Killooleet.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author:{
          username:"Larry",
          id:"58fe4f1905ea765b33882f33"
        },
        price:"10"
      },
      {
        name:"Desert Kim",
        img:"https://source.unsplash.com/WLUHO9A_xik",
        description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author:{
          username:"Larry",
          id:"58fe4f1905ea765b33882f33"
        },
        price:"10"
      },
      {
        name:"Canyon",
        img:"http://www.earlychildhoodeducationzone.com/wp-content/uploads/2015/04/Camp-Weequahic.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author:{
          username:"Larry",
          id:"58fe4f1905ea765b33882f33"
        },
        price:"10"
      }
    ]


function seedDB(){
  // remove campgrounds
  Campground.remove({},function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("all removed from campgrounds");
      // add campgrounds
      data.forEach(function (seed) {
        Campground.create(seed,function (err,campground) {
          if (err) {
            console.log(err);
          } else {
            console.log("Add a campground");
            // Delete comments
            Comment.remove({},function (err) {
              if (err) {
                console.log(err);
              }else {
                console.log("comments removed");
                // create comments
                Comment.create(
                  {
                    text:"This place is great",
                    author:{username:"Larry",id:"58fe4f1905ea765b33882f33"}
                  },function (err,comment) {
                    if (err) {
                      console.log(err);
                    } else {
                      campground.comments.push(comment)
                      campground.save()
                      console.log("created new comments");
                    }
                  }
                )
              }
            })
          }
        })
      })
    }
  })

}

module.exports = seedDB
