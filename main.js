const { Console } = require("console");
const { createWriteStream } = require("fs");

var stream = createWriteStream(process.cwd()+"/console.txt");
var log = console.log;
var temporary = new Console({
	stdout: stream,
	stderr: stream
});
console.log = function(string)
{
	log(string);
	temporary.log(string);
};
process.on("unhandledRejection", function(exception) {
	console.log(exception);
});
process.on("warning", function(warning) {
	console.log("Warning:");
	console.log("Name: "+warning.name);
	console.log("Message: "+warning.message);
	console.log("Stack: "+warning.stack);
});
process.on('uncaughtExceptionMonitor', function(err, origin) {
	console.log("Error: "+err);
	console.log("Origin: "+origin);
});

//JSON.stringify({ key: value });
Object.sort = function(object)
{
	var cache = object;
	var array = Object.keys(cache);
	array = array.sort();
	object = {};
	array.forEach(function(key)
	{
		object[key] = cache[key];
	});
	return object;
};

//
console.log("Current working directory: "+process.cwd());

//name: string
//url: string
//output: string
//file: string
//width: string
//height: string
//preview: array
//frame: object
//clips: array
global.project = null;
global.mongodb = [];

/*
const { MongoClient, GridFSBucket } = require("mongodb");

var URI = process.env.MONGO_DB_URI;

var client = new MongoClient(URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true 
});

client.connect(function(error)
{
	if(error)
	{
		console.log(error);
		return;
	}
	
	client.db("database").collection("collection").find({}, {}).toArray(function(exception, array)
	{
		if(array.length === 0)
		{
			console.log("There are currently no videos backed up on mongodb.");
		}
		else
		{
			var bucket = new GridFSBucket(client.db("database"), {
				bucketName: "bucket",
				chunkSizeBytes: 1024*1024
			});
		
			var temporary = [];
			array.forEach(function(document)
			{
				document.persist = false;
				
				temporary.push(
					new Promise(function(resolve, reject)
					{
						var write = createWriteStream(process.cwd()+"/"+document.frame.begin);
						var read = bucket.openDownloadStreamByName(document.frame.begin);
						read.pipe(write);
						write.on("finish", function()
						{
							resolve();
						});
					})
				);
				
				temporary.push(
					new Promise(function(resolve, reject)
					{
						var write = createWriteStream(process.cwd()+"/"+document.frame.end);
						var read = bucket.openDownloadStreamByName(document.frame.end);
						read.pipe(write);
						write.on("finish", function()
						{
							resolve();
						});
					})
				);
			});
			Promise.all(temporary).then(function()
			{
				global.mongodb = array;
				client.close();
			});
		}
	});
});
*/

//
const express = require("express");
//
const application = express();
//
application.use(express.static(__dirname));
//
global.base = "<!DOCTYPE html><html><head>{{head}}<style> body { margin-bottom:15px; } a:link { color: white; } a:visited { color: white; } a:hover { color: white; } a:active { color: white; } a { text-decoration: none; } .text-input::-webkit-scrollbar { display: none; } </style></head><body>{{body}}</body></html>";
global.host = process.env.HOST;
if(global.host === undefined)
{
	global.host = "http://localhost:8080";
}
//
application.get("/create", require(process.cwd()+"/express/create.js").create);
application.get("/create/:url", require(process.cwd()+"/express/create.js").result);
application.get("/preview", require(process.cwd()+"/express/preview.js").preview);
application.get("/preview/:frame", require(process.cwd()+"/express/preview.js").result);
application.get("/extract", require(process.cwd()+"/express/extract.js").extract);
application.get("/extract/:begin/:end/:name", require(process.cwd()+"/express/extract.js").result);
application.get("/persist/:clip", require(process.cwd()+"/express/persist.js").persist);
application.get("/mongodb", require(process.cwd()+"/express/persist.js").mongodb);
application.get("/mongodb/:clip", require(process.cwd()+"/express/persist.js").result);
application.get("/console", function(request, response)
{
    response.sendFile(__dirname+"/console.txt");
});
application.get("/console/:project", function(request, response)
{
    response.sendFile(__dirname+"/"+request.params.project+".txt");
});

//
var PORT = process.env.PORT;
//
if(PORT === undefined)
{
	PORT = 8080;
}
//
const { createServer } = require("http");
//
const server = createServer(application);
//
server.listen(PORT, function() {
	console.log("The server is running on port "+PORT);
});