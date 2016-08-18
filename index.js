var express     = require("express")
var app         = express()
var api         = express.Router()
var bodyParser  = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var port = 3000;

// Create donor
api.post('/donor/', function(req, res) {
    console.log(req);
    res.json({m: "POST /donor"})
})

api.route("/donor/:donor_id")
    // Retrieve donor information
    .get(function(req, res) {
        var m = "GET /donor/ id:" + req.params.donor_id
        console.log(m)
        res.json({m: m})
    })
    // Update donor information if private ID is supplied
    .put(function(req, res) {
        // @TODO check private ID before processing anything
        var m = "PUT /donor/ body: " + JSON.stringify(req.body);
        console.log(m)
        res.json({m: m})
    })
    // Delete donor information if private ID is supplied
    .delete(function(req, res) {
        // @TODO check private ID before processing anything
        var m = "DELETE /donor/ body: " + JSON.stringify(req.body);
        console.log(m)
        res.json({m: m})
    })
// Retrieve donor IDs in specified area on map
api.post("/donor/find/", function(req, res) {
    var m = "POST /donor/find/ body: " + JSON.stringify(req.body);
    console.log(m);
    res.json({m: m})
})
// Get single page app
app.get("/", function(req, res) {
    res.send("OK")
})
// Get static donor edit page
app.get("/donor/edit/:donor_id", function(req, res) {
    res.send("OK")
})
app.use("/api", api)
app.listen(port);
console.log("It's happening.")
