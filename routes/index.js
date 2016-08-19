var express     = require("express")
var router      = express.Router()

// Get single page app
router.get("*", function(req, res) {
    res.sendFile("index.html", {"root": "."})
})

module.exports = router;