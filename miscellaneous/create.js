const { spawn, exec } = require("child_process");
const { createWriteStream, rename: renameFile } = require("fs");
const { basename } = require("path");
const { getExtension } = require("mime");
const { extension: fileExtension } = require("mime-types");

function download()
{
    return new Promise( async function(resolve, reject) {
        var stream = await createWriteStream(global.project.output, {
            flags: "a"
        });
        
        //-P,  --directory-prefix=PREFIX   save files to PREFIX/..
        var download = spawn("wget", [ "--directory-prefix="+global.project.name, global.project.url ]);
        download.stdout.pipe(stream);
        download.stderr.pipe(stream);
        download.on("close", function(CODE) {
            stream.end();
            resolve("Download of the file from the url "+global.project.url+" is complete.");
        });
    }).catch( function(exception) {
        console.log(exception);
    });
}

function file()
{
    return new Promise( async function(resolve, reject) {
        var file = spawn("ls", [ global.project.name ]);
        file.stdout.on("data", function(output) {
        	var string = output.toString();
        	string = string.replace(/\r?\n|\r/g, "");
        	global.project.file = string;
        });
        file.on("close", function(CODE) {
            resolve(CODE);
        });
    }).catch( function(exception) {
        console.log(exception);
    });
}

function size()
{
    return new Promise( async function(resolve, reject) {
        var file = spawn("ffprobe", [ "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=s=x:p=0", global.project.name+"/"+ global.project.file ]);
        file.stdout.on("data", function(output)
        {
        	var string = output.toString();
        	string = string.replace(/\r?\n|\r/g, "");
        	var array = string.split("x");
        	global.project.width = array.shift();
        	global.project.height = array.shift();
        });
        file.on("close", function(CODE)
        {
            resolve(CODE);
        });
    }).catch( function(exception) {
        console.log(exception);
    });
}

function preview()
{
    return new Promise( async function(resolve, reject) {
        var stream = await createWriteStream(global.project.output, {
            flags: "a"
        });
        
        var preview = spawn("ffmpeg", [ "-i", global.project.name+"/"+global.project.file, "-vf", "fps=1/60", global.project.name+"/%03d.jpg" ]);
        preview.stdout.pipe(stream);
        preview.stderr.pipe(stream);
        preview.on("close", function(CODE) {
            var list = spawn("find", [ global.project.name, "-type", "f", "-name", "*.jpg" ]);
            list.stdout.on("data", function(output) {
            	var string = output.toString();
            	var array = string.split("\n");
            	array = array.sort();
            	//The first element of the array is an empty string.
            	array.shift();
            	var fileArray = [];
           		array.forEach(function(path) {
            		var file = basename(path);
            		fileArray.push(file);
            	});
            	global.project.preview = fileArray;
            });
            list.on("close", function(CODE) {
            	resolve("Preview of the project "+global.project.name+" with the video file "+global.project.file+" is complete.");
            });
        });
    }).catch( function(exception) {
        console.log(exception);
    });
}

async function create()
{
	//
	console.log("Download of the file from the url "+global.project.url+" has begun.");
    console.log(await download());
    //
    await file();
    await size();
    //
    console.log("Preview of the project "+global.project.name+" with the video file "+global.project.file+" has begun.");
    console.log(await preview());
}

module.exports = {
    create
};