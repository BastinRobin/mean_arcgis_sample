var mongoose    = require("mongoose")
var validation  = require("../models/validation")
var Schema = mongoose.Schema
var donorSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        validate: {
            validator: validation.name,
            message: "Please provide a valid name"
        }
    },
    lastname: {
        type: String,
        required: true,
        validate: {
            validator: validation.name,
            message: "Please provide a valid last name"
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validation.email,
            message: "Please provide a valid email"
        }
    },
    bloodtype: {
        type: String,
        required: true,
        validate: {
            validator: validation.bloodtype,
            message: "Please provide a valid bloodtype"
        }
    },
    geo_x: {
        type: Number,
        required: true,
        validate: {
            validator: validation.double,
            message: "Please provide a valid latitude"
        }
    },
    geo_y: {
        type: Number,
        required: true,
        validate: {
            validator: validation.double,
            message: "Please provide a valid longitude"
        }
    },
    unique_param: {
        type: String
    }
})

var Donor = mongoose.model("Donor", donorSchema)

module.exports = Donor;