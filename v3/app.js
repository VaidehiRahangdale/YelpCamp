var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//make a DB and connect mongoose
mongoose.connect("mongodb://localhost:27017/yelp_camp");
//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

//get Campground from the exported file
var Campground = require("./models/campground");
//var Comment = require("./models/comment");
//var User = require("./models/user");
var seedDB = require("./seeds");

//seed the database, everytime we start the server over, this code should run.
seedDB();

//Campground.create({
  //name: "Granite Hill",
   //image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg",
    //description: "This is a huge hill. No bathrooms. No drinking water. Scene is beautiful."
//},
   
   //function(err, campground){
    //if(err){
     //   console.log(err);
    //}else{
      // console.log("Newly added campground");
    //    console.log(campground);
    //}
//});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX- show all the campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB and then render that file.
    //now the source is not an array we defined earlier, but the DB.
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index",{campgrounds: allCampgrounds});
        }
    });
});

//CREATE- add new campground to DB
app.post("/campgrounds", function(req, res){
    //res.send("You hit the post button")
    //get data from form and add tp campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground ={name: name, image: image, description: desc}
    
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
app.get("/campgrounds/new", function(req,res){
   res.render("new.ejs"); 
});

//SHOW- shows more info about campground
app.get("/campgrounds/:id", function(req, res){
   //find the campground with provided ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       }else{
                console.log(foundCampground);
              //render show template with that campground
                res.render("show",{campground: foundCampground});
       }
   });

});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started!!");
});

