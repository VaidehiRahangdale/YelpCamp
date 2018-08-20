var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//make a DB and connect mongoose
mongoose.connect("mongodb://localhost:27017/yelp_camp");
//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

//get Campground from the exported file
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var passport = require("passport");
var LocalStrategy = require("passport-local");

//seed the database, everytime we start the server over, this code should run.
seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "Jack is the cutest dog",
    resave: false,
    saveUninitialzed: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

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
            res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
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
app.get("/campgrounds/new", function(req,res){
   res.render("campgrounds/new"); 
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
                res.render("campgrounds/show",{campground: foundCampground});
       }
   });

});

//=========================
//COMMENTS ROUTES
//=========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campround by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
             res.render("comments/new", {campground: campground});
        }
    });
   
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.render("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect('/campgrounds/'+ campground._id);
               }
           });
         }
    });
   
   //create a new comment
   //connect new comment to campground
   //redirect campground to show page
});

//=============
//AUTH ROUTES
//=============

//show register form
app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
            
        });
    });
});


//show login form
app.get("/login", function(req,res){
   res.render("login"); 
});

//handling login logic
//app.ost("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started!!");
});