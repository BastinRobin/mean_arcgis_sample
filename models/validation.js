// This file is responsible for all validation on server side
// It is meant to be used with mongoose custom validation mechanism
//
// This file will be usually used with models with validation before
// Saving model data to MongoDB
//
//
//  Example usage:
//  var validation  = require("../models/validation")
//
//  var cat = new Schema({name: { type: String, validate: { validator: validation.name } }})
//  This will return exports.name anonymous function defined below to valite: { validator }

// Returns a function to test if regex matches with string value
var regex = function(reg) {
    return function(v) {
        return reg.test(v)
    }
}
// Returns a function to check given type matches with type of value
//
// Example: type(10, "number") will yield true
// For more information about types please refer to:
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/typeof
var typecheck = function(type) {
    return function(v) {
        return typeof v === type;
    }
}
exports.name      = typecheck("string") // @TODO Real unicode name regexpr
exports.phone     = regex(/^(0{2}|\+)[0-9]{12}$/)
exports.email     = regex(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)
exports.bloodtype = regex(/^([ABO]|(AB))[\+\-]$/)
exports.double    = regex(/^[-+]?[0-9]*\.?[0-9]+$/)
exports.hex       = regex(/^[a-f0-9]*$/)