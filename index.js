var express     = require("express")
var app         = express()
var bodyParser  = require("body-parser")
var port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/",            require("./routes/index"))
app.use("/api/donor/",  require("./routes/api/donor"))

app.listen(port);
console.log("It's happening.")
