var CONFIG  = require("../config")
var Donor   = require("../models/donor")

// POST /donor/
exports.POST = function(req, res) {
    var donor = new Donor(req.body)
    // Validate the posted data
    donor.validate(function(err) {
        // Check errors
        if (!err) {
            // Try saving
            donor.save(function(err) {
                if (!err) {
                    //  Success
                    // @TODO return unique id Req#7
                    res.sendStatus(200)
                }
                else {
                    //  Unexpected error while saving
                    if (CONFIG.DEBUG) {
                        console.log(err)
                    }
                    // @TODO Improve this (maybe redirect to page? show dynamic message?)
                    res.sendStatus(500)
                }
            })
        }
        else {
            if (CONFIG.DEBUG) {
                console.log(err)
            }
            // Invalid data posted
            res.sendStatus(418)
            // @TODO Improve this (maybe redirect to page? show dynamic message?)
        }
    })
}