var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
	name : String,
	title : String,
	time : {
		date: Date,
		year: String,
		month: String,
		day: String,
		minute: String
	},
	post : String
});


exports.posts = mongoose.model('posts',postSchema);
