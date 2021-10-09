function preview(request, response)
{
	//
	var head = "<style>";
	if(global.project.clips.length > 2)
	{
		head += "body { width:"+global.project.clips.length*365+"px; }";
	}
	head += "</style>";
    //
    var body = "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>These are the details for the project.</div>";
    body += "</div>";
    body += "</div>";
    
    body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    body += "<span style='color:red;'>Name:</span> "+global.project.name;
    body += "</div>";
    
    body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    body += "<span style='color:red;'>URL:</span> "+global.project.url;
    body += "</div>";
    
    if(global.project.file !== "")
    {
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "<span style='color:red;'>File:</span> "+global.project.file;
    	body += "</div>";
    }
    
    if(global.project.width !== "")
    {
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "<span style='color:red;'>Width:</span> "+global.project.width;
    	body += "</div>";
    }
    
    if(global.project.height != "")
    {
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "<span style='color:red;'>Height:</span> "+global.project.height;
    	body += "</div>";
    }
    
    body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<a href='{{root}}/console' style='display:table-cell; vertical-align:middle; width:100%; height:100%'>Review the program's console output.</a>";
    body += "</div>";
    body += "</div>";
    
    body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<a href='{{root}}/console/"+global.project.name+"' style='display:table-cell; vertical-align:middle; width:100%; height:100%'>Review this project's console output.</a>";
    body += "</div>";
    body += "</div>";
    
    body += "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "These are the extracted preview images for the project "+project.name+".";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    
    if(global.project.preview.length === 0)
    {
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "There are currently no preview frames for the project "+global.project.name+".";
    	body += "</div>";
    }
    
    if(global.project.preview.length !== 0)
    {
    	body += "<script> function preview(frame) { var url = '{{root}}/preview/'+frame; window.location = url; } </script>";
    	
    	body += "<div onClick='preview(\"000.jpg\")' style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "Preview thirty seconds of the video starting at the first frame.";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    }
    
    global.project.preview.forEach(function(image)
    {
    	body += "<img src='{{root}}/"+global.project.name+"/"+image+"' alt='{{root}}/"+global.project.name+"/"+image+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    	
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "<span style='color:red;'>Name:</span> "+image;
    	body += "</div>";
    	
    	body += "<div onClick='";
    	if(global.project.frame.hasOwnProperty(image))
    	{
    		body += "javascript:void(0);";
    	}
    	else
    	{
    		body += "preview(\""+image+"\")";
    	}
    	body += "' style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; ";
    	if(global.project.frame.hasOwnProperty(image))
    	{
    		body += "background-color:blue; ";
    	}
    	else
    	{
    		body += "background-color:red; ";
    	}
    	body += "color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	if(global.project.frame.hasOwnProperty(image))
    	{
    		body += "One minute of the video starting at this frame has already been previewed.";
    	}
    	else
    	{
    		body += "Preview one minute of the video starting at this frame.";
    	}
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    });
    
    if(global.project.clips.length !== 0)
    {
    	body += "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "These are the extracted clips for the project "+project.name+".";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    
    	body += "<script>";
    	body += "function persist(clip) { var url = '{{root}}/persist/'+encodeURIComponent(clip); window.location = url; }";
    	body += "</script>";
    }
    
    body += "<div style='display:block;";
    if(global.project.clips.length > 2)
    {
    	body += " width:"+global.project.clips.length*365+"px;";
    }
    body += " margin-right:15px; margin-bottom:15px;'>";
    global.project.clips.forEach(function(clip)
    {
    	body += "<div style='float:left; margin-right:15px;'>";
    	
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "Begin:";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    	body += "<img src='{{root}}/"+clip.frame.begin+"' alt='{{root}}/"+clip.frame.begin+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    	
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "End:";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    	body += "<img src='{{root}}/"+clip.frame.end+"' alt='{{root}}/"+clip.frame.end+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<a href='{{root}}/"+clip.name+"' download style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "Download "+clip.name+".";
    	body += "</a>";
    	body += "</div>";
    	body += "</div>";
    
    	body += "<div onClick='";
    	if(clip.persist === true)
    	{
    		body += "javascript:void(0);";
    	}
    	else
    	{
    		body += "persist(\""+clip.name+"\")";
    	}
    	body += "' style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; ";
    	if(clip.persist === true)
    	{
    		body += "background-color:blue; ";
    	}
    	else
    	{
    		body += "background-color:red; ";
    	}
    	body += "color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	if(clip.persist === true)
    	{
    		body += "The clip "+clip.name+" with begin "+clip.begin+" and end "+clip.end+" has been persisted to mongodb.";
    	}
    	else
    	{
    		body += "Persist the clip "+clip.name+" to mongodb.";
    	}
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    
    	body += "</div>";
    });
    body += "</div>";
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

const { preview: prepare } = require(process.cwd()+"/miscellaneous");

function result(request, response)
{
	//
	var frame = request.params.frame;
	//
    var head = "";
    //
    var body = "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>The preview of the project "+global.project.name+".</div>";
    body += "</div>";
    body += "</div>";
    //
    if(global.project.frame.hasOwnProperty(frame))
    {
    	if(global.project.frame[frame].array.length === 0)
    	{
    		body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    		body += "<div style='display:table; width:100%; height:100%;'>";
    		body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>The preview of the project "+global.project.name+" from the frame "+frame+" is not yet complete.</div>";
    		body += "</div>";
    		body += "</div>";
    	}
    	else
    	{
    		global.project.frame[frame].array.forEach(function(image)
    		{
    			body += "<img src='{{root}}/"+global.project.name+"/"+image+"' alt='{{root}}/"+global.project.name+"/"+image+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    			body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    			body += "<span style='color:red;'>Name:</span> "+image;
    			body += "</div>";
    		});
    	}
    }
    else
    {
    	global.project.frame[frame] = {
    		begin: "",
    		end: "",
    		array: []
    	};
    	global.project.frame = Object.sort(global.project.frame);
    	prepare(frame);
    	//
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>The preview of the project "+global.project.name+" from the frame "+frame+" has begun.</div>";
    	body += "</div>";
    	body += "</div>";
    }
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
};

module.exports = {
	preview,
	result
};