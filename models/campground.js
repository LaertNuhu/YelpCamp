var mongoose = require("mongoose")

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name:String,
  img:String,
  price:String,
  createdAt: { type: Date, default: Date.now },
  description:String,
  location: String,
  lat: Number,
  lng: Number,
  author :{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref :"User"
    },
    username:String
  },
  comments:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    }
  ]
})
var Campground = mongoose.model("Campground",campgroundSchema)

module.exports = Campground
