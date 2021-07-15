const { spawn } = require("child_process");
const { createWriteStream } = require("fs");
const { basename } = require("path");

function directory(path)
{
	return new Promise(function(resolve, reject)
	{
		var command = spawn("mkdir", [ "-p", global.project.name+"/"+path ]);
		command.on("close", function(CODE)
		{
			resolve("The directory "+global.project.name+"/"+path+" has been created.");
		});
	});
}

function extract(path, begin, end)
{
	return new Promise(async function(resolve, reject)
	{
		var stream = await createWriteStream(global.project.output, {
			flags: "a"
		});
		stream.write("\n");
		
		var command = spawn("ffmpeg", [ "-ss", begin, "-to", end, "-i", global.project.name+"/"+global.project.file, "-vf", "fps=1", global.project.name+"/"+path+"/%03d.jpg" ]);
		command.stdout.pipe(stream);
		command.stderr.pipe(stream);
		command.on("close", function(CODE) {
			stream.end();
			resolve("Preview of the project "+global.project.name+" from "+begin+" to "+end+" is complete.");
		});
	});
}

function list(frame, begin, end, directory)
{
	return new Promise(async function(resolve, reject)
	{
		var stream = await createWriteStream(global.project.output, {
			flags: "a"
		});
		stream.write("\n");
		
		var command = spawn("find", [ global.project.name+"/"+directory, "-type", "f", "-name", "*.jpg" ]);
		command.stdout.on("data", function(output)
		{
			var string = output.toString();
			var array = string.split("\n");
			array = array.sort();
			//The first element of the array is an empty string.
			array.shift();
			var fileArray = [];
			array.forEach(function(path)
			{
				var file = directory+"/"+basename(path);
				stream.write(file+"\n");
				fileArray.push(file);
			});
			global.project.frame[frame].begin = begin;
			global.project.frame[frame].end = end;
			global.project.frame[frame].array = fileArray;
		});
		command.on("close", function(CODE)
		{
			stream.end();
			resolve(CODE);
		});
	});
}

async function preview(frame)
{
	var cache = frame;
	var path = cache.split(".").shift();
	
	//
	var begin;
	var end;
	//
	if(path === "000")
	{
		begin = "0:00";
		end = "0:30";
	}
	else
	{
		frame = path;
		frame = parseInt(frame);
		frame -= 1;
		
		begin = frame+":29.500";
		end = frame+1+":29.500";
	}
	
	console.log(await directory(path));
	console.log("Preview of the project "+global.project.name+" from "+begin+" to "+end+" has begun.");
	console.log(await extract(path, begin, end));
	await list(cache, begin, end, path);
}

module.exports = {
	preview
};