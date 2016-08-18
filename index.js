var express     = require("express")
var app         = express()
var router      = express.Router()

router.use(function(req, res, next) {
    console.log("w00t")
    next();
})
router.get("/", function(req, res) {
    res.json({message: "h3110 w0r14"})
})

app.use("/api", router)
app.listen(3000);
console.log("It's happening.")
