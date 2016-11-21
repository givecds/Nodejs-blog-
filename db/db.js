var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	name : String,
	password : String
});


exports.user = mongoose.model('users',userSchema);
