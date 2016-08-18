var mongoose    = require("mongoose")
require("mongoose-double")(mongoose);

var t = mongoose.Schema.Types;
var Donor = mongoose.Schema({
    firstname   : String,
    lastname    : String,
    email       : String,
    bloodtype   : String,
    geo_x       : t.Double,
    geo_y       : t.Double
})
module.exports = mongoose.model('Donor', Donor);