var express     = require("express")
var bodyParser  = require("body-parser")
var mongoose    = require("mongoose")
var app         = express()
var port        = 3000
// Load models
var Donor       = require("./data/models/donor")

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Load routes
app.use(express.static(__dirname + "/public"))
app.use("/api/donor/",  require("./routes/api/donor.js"))
app.use("/",            require("./routes/index.js"))

// Ready-set-GO!
mongoose.connect("mongodb://localhost/bloodonate+")
app.listen(port);

var bear = new Donor();
bear.firstname = "aa";
bear.lastname = "bbb";
bear.email = "ccc";
bear.bloodtype = "ffff";
bear.geo_x = 3.4;
bear.geo_y = 4.3;
bear.save(function(err){
    if(err){
        console.log(err)
    }
    console.log('ok')
})

console.log("It's happening.")
//1337
