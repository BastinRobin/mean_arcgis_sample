var Donor       = require("../models/donor")

// POST /donor/
exports.POST = function(req, res) {
    var donor = new Donor(req.body)
    donor.save(function(err) {
        console.log(err)
    })
    res.sendStatus(200)
}