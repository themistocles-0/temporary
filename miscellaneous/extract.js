const { spawn } = require("child_process");
const { createWriteStream } = require("fs");
const { v4: uuid } = require("uuid");

function execute(start, finish, name)
{
	return new Promise(async function(resolve, reject)
	{
		var stream = await createWriteStream(global.project.output, {
			flags: "a"
		});
		stream.write("\n");
		
		var command = spawn("ffmpeg", [ "-ss", start, "-to", finish, "-i", global.project.name+"/"+global.project.file, name+".mp4" ]);
		command.stdout.pipe(stream);
		command.stderr.pipe(stream);
		command.on("close", function(CODE)
		{
			stream.end();
			resolve("Extraction of the clip "+name+".mp4 from the video "+global.project.file+" is complete.");
		});
	});
}

function copy(source, destination)
{
	return new Promise(async function(resolve, reject)
	{
		var command = spawn("cp", [ source, destination ]);
		command.on("close", function(CODE)
		{
			resolve("");
		});
	});
}

async function extract(clip)
{
	if(clip.begin.minute !== 0)
	{
		clip.begin.minute -= 1;
		clip.begin.second += 28;
		if(clip.begin.second > 60)
		{
			clip.begin.minute += 1;
			clip.begin.second -= 60;
		}
		clip.start = clip.begin.minute+":"+clip.begin.second+".500";
	}
	else
	{
		clip.begin.second -= 1;
		clip.start = clip.begin.minute+":"+clip.begin.second;
	}
	
	if(clip.end.minute !== 0)
	{
		clip.end.minute -= 1;
		clip.end.second += 28;
		if(clip.end.second > 60)
		{
			clip.end.minute += 1;
			clip.end.second -= 60;
		}
		clip.finish = clip.end.minute+":"+clip.end.second+".500";
	}
	else
	{
		clip.end.second -= 1;
		clip.finish = clip.end.minute+":"+clip.end.second;
	}
	
	clip.name = uuid();
	
	console.log(await execute(clip.start, clip.finish, clip.name));
	
	Promise.all([
	    copy(global.project.name+"/"+clip.begin.request, clip.name+"-begin.jpg"),
	    copy(global.project.name+"/"+clip.end.request, clip.name+"-end.jpg")
	]).then( function()
	{
	    global.project.clips.push({
	    	name: clip.name+".mp4",
	    	begin: clip.start,
	    	end: clip.finish,
	    	frame: {
	    		begin: clip.name+"-begin.jpg",
	    		end: clip.name+"-end.jpg"
	    	},
	    	persist: false
	    });
	});
}

module.exports = {
	extract
};