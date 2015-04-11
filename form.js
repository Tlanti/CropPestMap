var mongoose = require('mongoose');

var Form = mongoose.model('Form', {
	latitude: Number,
	longitude: Number,
	pestName: String,
	pestStartDate: String,
	currentDate: String,
	areaAffected: Number,
	pesticide: String,
	fileName: String
});

module.exports = Form;