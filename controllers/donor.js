var CONFIG  = require("../config")
var Donor   = require("../models/donor")
var crypto  = require("crypto")

function API_ERROR(res, err, code) {
    if (CONFIG.DEBUG) {
        console.log(err)
    }
    // Invalid data posted
    res.sendStatus(code)
    // @TODO Improve this (maybe redirect to page? show dynamic message?)
}

// GET /donor/{id}
exports.uniqueGET = function(req, res) {
    Donor.find({ unique_param: req.params.id }, "-_id -unique_param", function(err, donor) {
        if (!err) {
            res.json(donor[0])
        }
        else {
            API_ERROR(res, err, 404)
        }
    })
}
// PUT /donor/{id}
exports.uniquePUT = function(req, res) {
    // @TODO Add comments
    var donor = new Donor(req.body);
    donor.validate(function(err) {
        if (!err) {
            Donor.findOneAndUpdate({ unique_param: req.params.id }, req.body,
            function(err, fresh) {
                if (!err) {
                    res.sendStatus(200)
                }
                else {
                    API_ERROR(res, err, 500)
                }
            })
        }
        else {
            API_ERROR(res, err, 418)
        }
    })
}
// POST /donor/
exports.POST = function(req, res) {
    var donor = new Donor(req.body)
    // Validate the posted data
    donor.validate(function(err) {
        // Check errors
        if (!err) {
            // Generate unique_param with sha256 algorithm
            var shasum = crypto.createHash("sha256")
                .update(JSON.stringify(donor)) // Take sha256 of donor info
                .digest("hex") // To hex string
            donor.unique_param = shasum
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
            API_ERROR(res, err, 418)
        }
    })
}