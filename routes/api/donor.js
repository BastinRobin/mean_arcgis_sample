var express     = require("express")
var f           = require("../../controllers/donor")
var router      = express.Router()

// Get static donor edit page
router.get("/edit/:id", unify)

// POST /donor/
// Create donor
router.post("/", f.POST)

// POST /donor/find
// Retrieve donor IDs in specified area on map
router.post("/find", unify)

// REST /donor/[id]
router.route("/:id")
    // Retrieve donor information
    .get(unify)

    // Update donor information if private ID is supplied
    .put(unify)

    // Delete donor information if private ID is supplied
    .delete(unify)

// Underlying unifier function @TODO seperate functions
function unify(req, res) {
    var json = {
        request     : req.method,
        url         : req.url,
        body        : JSON.stringify(req.body)
    }
    console.log();
    console.log(json);
    res.json(json);
}

module.exports = router;