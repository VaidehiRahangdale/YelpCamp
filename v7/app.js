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

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


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

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started!!");
});