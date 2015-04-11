var express 	= require('express');
var parser 		= require('body-parser');
var multer  	= require("multer");
var mongoose  	= require("mongoose");
var Form 		= require("./form.js");
var path    	= require("path");
var multer  	= require("multer");

var app = express();

app.use(express.static('./static'));
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(multer({ 
			dest: './uploads/',
			rename: function(fieldname, filename, req, res) {
				return "pest_" + Date.now();
			}
		})
);

mongoose.connect("mongodb://localhost/buddy");

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/listMap", function(req, res) {
	
});

app.post('/save', function(req, res) {
	var body = req.body;
	
	var form = new Form();
	form.latitude = body.latitude;
	form.longitude = body.longitude;
	form.pestName = body.pestName;
	form.pestStartDate = body.pestStartDate;
	form.currentDate = body.currentDate;
	form.areaAffected = body.areaAffected;
	form.pesticide = body.pesticide;
	
	form.save(function(err, form) {
		if(err) throw err;
		res.redirect("/");
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});