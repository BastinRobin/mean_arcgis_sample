var express     = require("express")
var app         = express()
var bodyParser  = require("body-parser")
var mongoose    = require("mongoose")
var http        = require("http").Server(app)
var io          = require("socket.io")(http)
var port        = 3000

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Load routes
app.use("/api/donor/",  require("./routes/api/donor.js"))
app.use(express.static(__dirname + "/public"))
app.get('*',            require("./routes/index.js"));

io.on("connection", function(client) {
    console.log("Magic happens")
    client.on("1", function(msg) {
        console.log(msg)
        client.emit("2", "why cant i delete this")
    })
})
// Ready-set-GO!
mongoose.connect("mongodb://localhost/bloodonate+")
http.listen(port, function() {
    console.log()
    console.log("It's happening.")
})
//1337
