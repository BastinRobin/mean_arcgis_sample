var CONFIG  = require("../config")
var Donor   = require("../models/donor")
var crypto  = require("crypto")
var validate= require("../models/validation")
var io      = require("../io")
// This function is used for responding back to client
// Whenever something wents wrong and cant proceede further
// Such as database errors, server errors, validation errors
// invalid requests... list goes on.
var sendError = function(res, err, code) {
    if (CONFIG.DEBUG) {
        console.log(err)
    }
    // Invalid data posted
    res.sendStatus(code)
    // @TODO Improve this (maybe redirect to page? show dynamic message?)
}
// Parses string ipv4 address and converts to number (32 bit)
var ipToInt = function(str) {
    var parts = str.split(".")
    var int = 0
    // Shift each part to fit an 32 bit ip number
    int += parseInt(parts[0], 10) << 24
    int += parseInt(parts[1], 10) << 16
    int += parseInt(parts[2], 10) << 8
    int += parseInt(parts[3], 10)
    return int
}
// Extract sender IP Address from request headers
// NOTE: x-forwarded-for can be spoofed.
var getIpv4 = function(req) {
    // @TODO Improve this for security reasons
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Remove IPv6 subnet prefix returned by express.js
    // Example ip format returning by express => ::ffff:127.0.0.1
    return ip.substring(7);    
}
// This function completes request operation and Returns
// proper donor information along with unique_param
var returnDonor = function(res, donor, unique_param) {
    // delete donor._id will not work
    //
    // To use delete you would need to convert the model document into a 
    // plain JavaScript object by calling toObject so that you can freely manipulate it.
    // 
    // user = user.toObject();
    // delete user.salt;
    // delete user.pass;
    //
    // http://stackoverflow.com/questions/23342558/why-cant-i-delete-a-mongoose-models-object-properties
    donor._id = undefined;
    donor.__v = undefined;
    donor.unique_param = undefined;
    // Return unique id along with the saved data
    res.json({ unique_param: unique_param, saved_data: donor })
}
// Calculate the error code and sent back to client
//
// Explanations of error codes can be found in SRS document
// Chapter 3 Other requirements #3 status messages of validation
var validationError = function(res, err) {
    var error_code = 0
    if (err.errors.firstname) error_code |= 0x01;
    if (err.errors.lastname)  error_code |= 0x02;
    if (err.errors.phone)     error_code |= 0x04;
    if (err.errors.email)     error_code |= 0x08;
    if (err.errors.bloodtype) error_code |= 0x10;
    if (err.errors.ipv4)      error_code |= 0x20;
    if (err.errors.geo_x)     error_code |= 0x40;
    if (err.errors.geo_y)     error_code |= 0x80;
    // @TODO TEAPOT
    res.status(418).json({e:error_code})
}
// GET api/donor/find/:id
exports.findID = function(req, res) {
    var id = req.params.id
    // Validate passed link
    if (validate.hex(id)) {
        // Try to retrieve donor with matching id
        // Remember this db query is asynchronous call
        Donor.find({ _id: id }, "-_id -unique_param -ipv4 -__v -geo_x -geo_y", function(err, donor) {
            if (err) {
                // Unexpected error
                sendError(res, err, 500)
            } else if (!donor.length) {
                // Record not found
                sendError(res, "Find id not found: " + id, 404)
            } else {
                // Found record
                res.json(donor[0])
            }
        })
    } else {
        // Invalid request
        sendError(res, "Request id is not in hex format", 400)
    }
}
// DELETE api/donor/{unique_param}
exports.uniqueDELETE = function(req, res) {
    var unique_param = req.params.id
    // Validate passed link parameter
    if (validate.hex(unique_param)) {
        // Try to retrieve donor with matching unique_param
        Donor.findOneAndRemove({ unique_param: unique_param }, function(err, doc, result) {
            if (err) {
                // Unexpected error
                sendError(res, err, 500)
            } else if (!doc) {
                // Not found
                sendError(res, "Record not found: " + unique_param, 404)
            } else {
                // Broadcast pinpoint delete
                if (CONFIG.DEBUG) console.log("Socket.io: Broadcast delete: " + doc._id)
                io.broadcastDelete(doc._id)
                returnDonor(res, doc, unique_param)
            }
        })
    } else {
        // Invalid request
        sendError(res, "Request id is not SHA256", 400)
    }
}
// GET api/donor/{unique_param}
exports.uniqueGET = function(req, res) {
    var unique_param = req.params.id
    if (validate.hex(unique_param)) {
        // Try to retrieve donor with matching unique_param
        Donor.find({ unique_param: unique_param }, "-_id -unique_param -__v", function(err, donor) {
            if (err) {
                // Unexpected error
                sendError(res, err, 500)
            } else if (!donor.length) {
                // Not found
                sendError(res, "Record not found: " + unique_param, 404)
            } else {
                // Found record
                res.json(donor[0])
            }
        })
    } else {
        sendError(res, "Request id is not SHA256", 400)
    }
}
// PUT api/donor/{unique_param}
exports.uniquePUT = function(req, res) {
    var unique_param = req.params.id
    // Validate the posted data
    var donor = new Donor(req.body);
    // @TODO WARNING: This still accepts geo_x ipv4 and along with Other
    // valid field update on database table even we dont allow on 
    // client-front-end
    // A PUT request amongst with those fields aswell is still acceptable
    donor.validate(function(err) {
        if (!err && validate.hex(unique_param)) {
            // Try to update record with matching unique_param on database
            Donor.findOneAndUpdate({ unique_param: unique_param }, req.body, function(err, fresh) {
                if (err) {
                    // Unexpected error while updating database
                     sendError(res, err, 500)
                // findOne... returns null if no match
                } else if (!fresh) {
                    // Not found
                     sendError(res, "Update unique_param not found", 404)
                } else {
                    // Success, let's broadcast this to everyone
                    if (CONFIG.DEBUG) console.log("Socket.io: Broadcast update: " + fresh._id)
                    io.broadcastUpdate(fresh._id, fresh.geo_x, fresh.geo_y)
                    returnDonor(res, req.body, unique_param)
                }
            })
        } else {
            validationError(res, err)
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
            // Convert IP Address string to 32 bit number
            donor.ipv4 = ipToInt(getIpv4(req))
            // Try saving
            donor.save(function(err) {
                if (!err) {
                    returnDonor(res, donor, shasum)
                } else {
                    sendError(res, err, 500)
                }
            })
        } else {
            validationError(res, err)
        }
    })
}