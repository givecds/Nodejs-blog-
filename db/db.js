var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blogdb');
var db = mongoose.connection;


var Schema = mongoose.Schema;
var userSchema = new Schema({
	name : String,
	password : String
});


exports.user = mongoose.model('users',userSchema);
