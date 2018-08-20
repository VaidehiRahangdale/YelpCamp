//1.create a module directory
//2.use module.export
//3.require everything correctly.

var mongoose = require("mongoose");
//shema set up
var campgroundSchema = new mongoose.Schema({
    name : String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});
module.exports = mongoose.model("Campground", campgroundSchema);