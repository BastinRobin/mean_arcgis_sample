var express     = require("express")
var router      = express.Router()

// Get single page app
router.get(function(req, res) {
    res.send("OK")
})

module.exports = router;