var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = mongoose.Schema({
    name_card:{type:String,require:true},
    description:{type:String,require:true},
    whatTCG:{type:String,require:true},
    comm:{type:String},
    creator:{type: Schema.Types.ObjectId},
    extension:{type:String,require:true}
});
var card = mongoose.model("card",cardSchema);
module.exports = card;