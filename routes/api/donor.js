var express     = require("express")
var f           = require("../../controllers/donor")
var router      = express.Router()

// Get static donor edit page
router.get("/edit/:id", unify)

// POST api/donor/
// Create donor
router.post("/", f.POST)

// POST api/donor/find
// Retrieve donor IDs in specified area on map
router.post("/find", unify)

// REST api/donor/{unique_id}
router.route("/:id")
    // Retrieve donor information
    .get(f.uniqueGET)

    // Update donor information if private ID is supplied
    .put(f.uniquePUT)

    // Delete donor information if private ID is supplied
    .delete(f.uniqueDELETE)

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