var express = require("express");
var router = express.Router();
var Campground = require("../modules/campground");

//INDEX- show all the campgrounds
router.get("/", function(req, res){
    //get all campgrounds from DB and then render that file.
    //now the source is not an array we defined earlier, but the DB.
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE- add new campground to DB
router.post("/", function(req, res){
    //res.send("You hit the post button")
    //get data from form and add tp campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground ={name: name, image: image, description: desc};
    
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
             //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW- show form to create a new campground and that sends data to post route
router.get("/new", function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW- shows more info about campground
router.get("/:id", function(req, res){
   //find the campground with provided ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       }else{
                console.log(foundCampground);
              //render show template with that campground
                res.render("campgrounds/show",{campground: foundCampground});
       }
   });

});

module.exports = router;