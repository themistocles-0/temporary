const { MongoClient, GridFSBucket } = require("mongodb");
const { createReadStream, createWriteStream } = require("fs");

var URI = process.env.MONGO_DB_URI;

function upload(clip)
{
	var client = new MongoClient(URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	
	client.connect(async function(error)
	{
		client.db("database").collection("collection").insertOne({
			name: clip.name,
			frame: {
				begin: clip.frame.begin,
				end: clip.frame.end
			}
		});
		
		var bucket = new GridFSBucket(client.db("database"), {
			bucketName: "bucket",
			chunkSizeBytes: 1024*1024
		});
		
		Promise.all([
			new Promise(function(resolve, reject)
			{
				var read = createReadStream(process.cwd()+"/"+clip.frame.begin);
				var write = bucket.openUploadStream(clip.frame.begin);
				read.pipe(write);
				write.on("finish", function()
				{
					resolve();
				});
			}),
			new Promise(function(resolve, reject)
			{
				var read = createReadStream(process.cwd()+"/"+clip.frame.end);
				var write = bucket.openUploadStream(clip.frame.end);
				read.pipe(write);
				write.on("finish", function()
				{
					resolve();
				});
			}),
			new Promise(function(resolve, reject)
			{
				var read = createReadStream(process.cwd()+"/"+clip.name);
				var write = bucket.openUploadStream(clip.name);
				read.pipe(write);
				write.on("finish", function()
				{
					resolve();
				});
			})
		]).then(function()
		{
			clip.persist = true;
			client.close();
			console.log("");
		});
	});
}

function download(clip)
{
	var client = new MongoClient(URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true 
	});
	
	client.connect(async function(error)
	{
		var bucket = new GridFSBucket(client.db("database"), {
			bucketName: "bucket",
			chunkSizeBytes: 1024*1024
		});
		
		Promise.all([
			new Promise(function(resolve, reject)
			{
				var write = createWriteStream(process.cwd()+"/"+clip.name);
				var read = bucket.openDownloadStreamByName(clip.name);
				read.pipe(write);
				write.on("finish", function() {
					resolve();
				});
			})
		]).then(function()
		{
			clip.persist = true;
			client.close();
		});
	});
}

function persist(request, response)
{
	var clip = global.project.clips.find(element => element.name === request.params.clip);
	upload(clip);
	
	//
	var head = "";
	//
	var body = "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
	body += "<div style='display:table; width:100%; height:100%;'>";
	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
	body += "The clip shown below has been persisted to mongodb.";
	body += "</div>";
	body += "</div>";
	body += "</div>";
	
	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
	body += "<div style='display:table; width:100%; height:100%;'>";
	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
	body += clip.name;
	body += "</div>";
	body += "</div>";
	body += "</div>";
	
	body += "<img src='{{root}}/"+clip.frame.begin+"' alt='{{root}}/"+clip.frame.begin+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
	
	body += "<img src='{{root}}/"+clip.frame.end+"' alt='{{root}}/"+clip.frame.end+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
	
	//
	var html = global.base;
	//
	html = html.replace("{{head}}", head);
	html = html.replace("{{body}}", body);
	//
	var expression = new RegExp("{{root}}", "g");
	html = html.replace(expression, global.host);
	//
	response.send(html);
}

function mongodb(request, response)
{
	//
	var head = "";
	//
	var body = "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
	body += "<div style='display:table; width:100%; height:100%;'>";
	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
	body += "Below is a list of clips persisted on mongodb.";
	body += "</div>";
	body += "</div>";
	body += "</div>";
	
	if(global.mongodb.length === 0)
	{
		body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
		body += "<div style='display:table; width:100%; height:100%;'>";
		body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
		body += "There are currently no clips persisted on mongodb.";
		body += "</div>";
		body += "</div>";
		body += "</div>";
	}
	else
	{
		body += "<script>";
		body += "function mongodb(clip) { var url = '{{root}}/mongodb/'+encodeURIComponent(clip); window.location = url; }";
		body += "</script>";
	}
	
	global.mongodb.forEach(function(clip)
	{
		body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
		body += "<div style='display:table; width:100%; height:100%;'>";
		body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
		body += clip.name;
		body += "</div>";
		body += "</div>";
		body += "</div>";
		
		body += "<img src='{{root}}/"+clip.frame.begin+"' alt='{{root}}/"+clip.frame.begin+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
		
		body += "<img src='{{root}}/"+clip.frame.end+"' alt='{{root}}/"+clip.frame.end+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
		
		body += "<div onClick='";
		if(clip.persist === true)
		{
			body += "javascript:void(0);";
		}
		else
		{
			body += "mongodb(\""+clip.name+"\")";
		}
		body += "' style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; ";
		if(clip.persist === true)
		{
			body += "background-color:green; ";
		}
		else
		{
			body += "background-color:red; ";
		}
		body += "color:white; width:350px; height:75px;'>";
		body += "<div style='display:table; width:100%; height:100%;'>";
		body += "<a href='";
		if(clip.persist === true)
		{
			body += "{{root}}/"+clip.name;
		}
		else
		{
			body += "javascript:void(0);";
		}
		body += "' ";
		if(clip.persist === true)
		{
			body += "download ";
		}
		body += "style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
		if(clip.persist === true)
		{
			body += "The clip "+clip.name+" is currently available for download.";
		}
		else
		{
			body += "Retrieve the clip "+clip.name+" from mongodb.";
		}
		body += "</a>";
		body += "</div>";
		body += "</div>";
	});
	
	//
	var html = global.base;
	//
	html = html.replace("{{head}}", head);
	html = html.replace("{{body}}", body);
	//
	var expression = new RegExp("{{root}}", "g");
	html = html.replace(expression, global.host);
	//
	response.send(html);
}

function result(request, response)
{
	var clip = global.mongodb.find(element => element.name === request.params.clip);
	download(clip);
	
	//
	var head = "";
	//
	var body = "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
	body += "<div style='display:table; width:100%; height:100%;'>";
	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
	body += "The clip below is being retrieved from mongodb.";
	body += "</div>";
	body += "</div>";
	body += "</div>";
	
	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
	body += "<div style='display:table; width:100%; height:100%;'>";
	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
	body += clip.name;
	body += "</div>";
	body += "</div>";
	body += "</div>";
	
	body += "<img src='{{root}}/"+clip.frame.begin+"' alt='{{root}}/"+clip.frame.begin+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
	
	body += "<img src='{{root}}/"+clip.frame.end+"' alt='{{root}}/"+clip.frame.end+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
	
	//
	var html = global.base;
	//
	html = html.replace("{{head}}", head);
	html = html.replace("{{body}}", body);
	//
	var expression = new RegExp("{{root}}", "g");
	html = html.replace(expression, global.host);
	//
	response.send(html);
}

module.exports = {
	persist,
	mongodb,
	result
};