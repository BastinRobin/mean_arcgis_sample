var express     = require("express")
var bodyParser  = require("body-parser")
var mongoose    = require("mongoose")
var app         = express()
var port        = 3000

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

console.log("It's happening.")
//1337
