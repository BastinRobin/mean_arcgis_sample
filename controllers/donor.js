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

// GET api/donor/{id}
exports.uniqueGET = function(req, res) {
    // Try to retrieve donor with matching unique_param
    Donor.find({ unique_param: req.params.id }, "-_id -unique_param", function(err, donor) {
        if (!err) {
            // Found record
            res.json(donor[0])
        }
        else {
            // Not match or unexpected error @TODO seperate them
            API_ERROR(res, err, 404)
        }
    })
}
// PUT api/donor/{id}
exports.uniquePUT = function(req, res) {
    // Validate the posted data
    var donor = new Donor(req.body);
    donor.validate(function(err) {
        if (!err) {
            // Try to update record with matching unique_param on database
            Donor.findOneAndUpdate({ unique_param: req.params.id }, req.body,
            function(err, fresh) {
                if (!err) {
                    // Success
                    res.sendStatus(200)
                }
                else {
                    // Unexpected error while updating database
                    API_ERROR(res, err, 500)
                }
            })
        }
        else {
            // Invalid input
            API_ERROR(res, err, 418)
        }
    })
}
// POST api/donor/
exports.POST = function(req, res) {
    // Validate the posted data
    var donor = new Donor(req.body)
    donor.validate(function(err) {
        if (!err) {
            // Generate unique_param with sha256 algorithm
            var shasum = crypto.createHash("sha256")
                .update(JSON.stringify(donor)) // Take sha256 of donor info
                .digest("hex") // To hex string
            donor.unique_param = shasum
            // Add the sender IP Address NOTE: x-forwarded-for can be spoofed.
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            // Remove IPv6 subnet prefix returned by express.js
            // Example format returning by express => ::ffff:127.0.0.1
            ip = ip.substring(7);
            // Convert IP Address string to 32 bit number
            var parts = ip.split(".")
            var int = 0
            int += parseInt(parts[0], 10) << 24
            int += parseInt(parts[1], 10) << 16
            int += parseInt(parts[2], 10) << 8
            int += parseInt(parts[3], 10)
            donor.ipv4 = int
            // Try saving
            donor.save(function(err) {
                if (!err) {
                    // Return unique id
                    res.json({ unique_param: shasum })
                }
                else {
                    API_ERROR(res, err, 500)
                }
            })
        }
        else {
            var error_code = 0
            if (err.errors.firstname) error_code |= 0x01;
            if (err.errors.lastname)  error_code |= 0x02;
            if (err.errors.phone)     error_code |= 0x04;
            if (err.errors.email)     error_code |= 0x08;
            if (err.errors.bloodtype) error_code |= 0x10;
            if (err.errors.ipv4)      error_code |= 0x20;
            if (err.errors.geo_x)     error_code |= 0x40;
            if (err.errors.geo_y)     error_code |= 0x80;
            res.status(418).json({e:error_code})
        }
    })
}