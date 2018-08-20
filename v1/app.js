var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
        {name: "Salmon Greek", image:"https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg"},
        {name: "Granite Hill", image:"https://cdn.pixabay.com/photo/2015/11/07/11/26/coffee-1031139__340.jpg"},
        {name: "Mountains Goat's Rest", image:"https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"}
     ]

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    
    //2nd campgrounds is the data(array) we are passing
     //1st campgrounds is just the name we want to give.
     res.render("campgrounds",{campgrounds: campgrounds});
});

//to create a new campground
app.post("/campgrounds", function(req, res){
    //res.send("You hit the post button")
    //get data from form and add it to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground ={name: name, image: image}
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

//show the form that sends data to post route
app.get("/campgrounds/new", function(req,res){
   res.render("new.ejs"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started!!");
});

