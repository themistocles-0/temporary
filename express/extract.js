function extract(request, response)
{
	var array = Object.entries(global.project.frame);
	//
    var head = "<style>";
    if(array.length > 2)
    {
    	head += "body { width:"+array.length*365+"px; }";
    }
    head += "</style>";
    //
    var body = "<script> var frame = { begin: '', end: '' }; </script>";
    body += "<script> var current = ''; </script>";
    body += "<script>";
    body += "function disable()";
    body += "{";
    body += "var array = document.getElementsByClassName('button');";
    body += "for(var index = 0; index<array.length; index++)";
    body += "{";
    body += "array[index].style.backgroundColor = 'grey';";
	body += "array[index].setAttribute('onClick', 'javascript:;');";
    body += "}";
    body += "}";
    body += "</script>";
    body += "<script>";
    body += "function enable()";
    body += "{";
    body += "var array = document.getElementsByClassName('button');";
    body += "for(var index = 0; index<array.length; index++)";
    body += "{";
    body += "var _frame = array[index].id;";
    body += "array[index].style.backgroundColor = 'red';";
    body += "array[index].setAttribute('onClick', 'select(\"'+_frame+'\")');";
    body += "}";
    body += "}";
    body += "</script>";
    body += "<script> function begin() { current = 'begin'; enable(); } </script>";
    body += "<script> function end() { current = 'end'; enable(); } </script>";
    body += "<script>";
    body += "function update()";
    body += "{";
    body += "if(frame.begin !== '')";
    body += "{";
    body += "var begin = document.getElementById('begin');";
    body += "begin.setAttribute('src', '{{root}}/"+global.project.name+"/'+frame.begin);";
    body += "begin.setAttribute('alt', '{{root}}/"+global.project.name+"/'+frame.begin+' not loaded.');";
    body += "}";
    body += "if(frame.end !== '')";
    body += "{";
    body += "var end = document.getElementById('end');";
    body += "end.setAttribute('src', '{{root}}/"+global.project.name+"/'+frame.end);";
    body += "end.setAttribute('alt', '{{root}}/"+global.project.name+"/'+frame.end+' not loaded.');";
    body += "}";
    body += "}";
    body += "</script>";
    body += "<script>";
    body += "function select(_frame)";
    body += "{";
    body += "disable();";
    body += "if(current === 'begin')";
    body += "{";
    body += "frame.begin = _frame;";
    body += "}";
    body += "else if(current === 'end')";
    body += "{";
    body += "frame.end = _frame;";
    body += "}";
    body += "update();";
    body += "}";
    body += "</script>";
    body += "<script>";
    body += "function extract()";
    body += "{";
    body += "if(frame.begin === '' || frame.end === '' || document.getElementById('name-input').innerText === '') { return; }";
    body += "var url = '{{root}}/extract/'+encodeURIComponent(frame.begin)+'/'+encodeURIComponent(frame.end)+'/'+encodeURIComponent(document.getElementById('name-input').innerText);";
    body += "window.location = url;";
    body += "}";
    body += "</script>";
    body += "<script>";
    body += "function name()";
    body += "{";
    body += "output = document.getElementById('').innerText;";
    body += "}";
    body += "</script>";
    
    body += "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "Extract a clip from the project "+global.project.name+".";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    
    //
    body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "Here are the frames you have selected for the clip extraction.";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    //
    body += "<div style='margin-top:15; overflow-y:scroll; width:715px; height:125px; display:block; border-style:solid; border-color:black; border-radius:2.5px;' id='name-input' contenteditable='true'></div>";
    body += "<table style=''>";
    body += "<tr>";
    body += "<td>";
    body += "<img src='{{root}}/' alt='{{root}}/ not loaded' id='begin' style='margin-top:15px;  margin-right:15px; width:350px; height:auto;'>";
    body += "</td>";
    body += "<td>";
    body += "<img src='{{root}}/' alt='{{root}}/ not loaded' id='end' style='margin-top:15px; width:350px; height:auto;'>";
    body += "</td>";
    body += "</tr>";
    body += "<tr>";
    body += "<td>";
    body += "<div onClick='begin()' style='margin-top:15px; margin-right:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "Select the frame from which the clip extraction begins.";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    body += "</td>";
    body += "<td>";
    body += "<div onClick='end()' style='margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "Select the frame from which the clip extraction ends.";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    body += "</td>";
    body += "</tr>";
    body += "<tr>";
    body += "<td>";
    body += "<div onClick='extract()' style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "Extract";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    body += "</td>";
    body += "</tr>";
    body += "</table>";
    
    body += "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "Here are the frames viable for selection for the beginning and ending of the extracted clip.";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    
	if(array.length === 0)
    {
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "global.project.frame is empty.";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    }
    else
    {
    	body += "<div style='display:block;";
    	if(array.length > 2)
    	{
    		body += " width: "+array.length*365+"px;";
    	}
    	body += " margin-right:15px; margin-bottom: 15px;'>";
    	array.forEach(function([ key, value ])
    	{
    		body += "<div style='float:left; margin-right:15px;'>";
    		//
    		body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
    		body += "<div style='display:table; width:100%; height:100%;'>";
    		body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    		body += "The preview image "+key+" for the project "+global.project.name+".";
    		body += "</div>";
    		body += "</div>";
    		body += "</div>";
    		//
    		if(key !== "000.jpg")
    		{
    			body += "<img src='{{root}}/"+global.project.name+"/"+key+"' alt='{{root}}/"+global.project.name+"/"+key+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    		}
    		else
    		{
    			body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    			body += "<div style='display:table; width:100%; height:100%;'>";
    			body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    			body += "The first frame is not extracted from the video.";
    			body += "</div>";
    			body += "</div>";
    			body += "</div>";
    		}
    		//
    		if(value.begin != "")
    		{
    			body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    			body += "<span style='color:red;'>Begin:</span> "+value.begin;
    			body += "</div>";
    		}
    		//
    		if(value.end != "")
    		{
    			body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    			body += "<span style='color:red;'>End:</span> "+value.end;
    			body += "</div>";
    		}
    		//
    		body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:blue; color:white; width:350px; height:75px;'>";
    		body += "<div style='display:table; width:100%; height:100%;'>";
    		body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    		body += "Select a frame from the list below.";
    		body += "</div>";
    		body += "</div>";
    		body += "</div>";
    		//
    		if(value.array.length === 0)
    		{
    			body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    			body += "<div style='display:table; width:100%; height:100%;'>";
    			body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    			body += `global.project.frame[${key}].array is empty.`;
    			body += "</div>";
    			body += "</div>";
    			body += "</div>";
    		}
    		else
    		{
    			//
    			value.array.forEach(function(frame)
    			{
    				body += "<img src='{{root}}/"+global.project.name+"/"+frame+"' alt='{{root}}/"+global.project.name+"/"+frame+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    				body += "<div id='"+frame+"' class='button' style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:grey; color:white; width:350px; height:75px;'>";
    				body += "<div style='display:table; width:100%; height:100%;'>";
    				body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    				body += "Select this frame.";
    				body += "</div>";
    				body += "</div>";
    				body += "</div>";
    			});
    		}
    		body += "</div>";
    	});
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
}

const { extract: prepare } = require(process.cwd()+"/miscellaneous");

function result(request, response)
{
	var begin = request.params.begin.split(".").shift();
	var end = request.params.end.split(".").shift();
	var clip = {
		name: request.params.name,
		begin: {
			request: request.params.begin,
			minute: parseInt(begin.split("/").shift()),
			second: parseInt(begin.split("/").pop())
		},
		end: {
			request: request.params.end,
			minute: parseInt(end.split("/").shift()),
			second: parseInt(end.split("/").pop())
		},
		start: "",
		finish: ""
	};
	//
    var head = "";
    //
    var body = "<div style='display:block; text-align:center; border-style:solid; border-color:black; border-radius:2.5px; width:350px; height:75px; margin-top:15px;'>";
    body += "<div style='display:table; width:100%; height:100%;'>";
    body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    body += "The extraction of a clip from the video "+global.project.file+" in the project "+global.project.name+".";
    body += "</div>";
    body += "</div>";
    body += "</div>";
    //
    if(clip.begin.minute > clip.end.minute)
    {
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:grey; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "The begin minute is greater than the end minute.";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    }
    else if(clip.begin.minute === clip.end.minute && clip.begin.second > clip.end.second)
    {
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:grey; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "While the begin and end minutes are similar, the begin second is greater than the end second.";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    }
    else
    {
    	prepare(clip);
    	
    	body += "<div style='display:block; margin-top:15px; text-align:center; border-radius:2.5px; background-color:red; color:white; width:350px; height:75px;'>";
    	body += "<div style='display:table; width:100%; height:100%;'>";
    	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
    	body += "A clip extraction from the video "+global.project.file+" has begun.";
    	body += "</div>";
    	body += "</div>";
    	body += "</div>";
    	
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "<span style='color:red;'>Name:</span> "+clip.name+".mp4";
    	body += "</div>";
    	
    	body += "<img src='{{root}}/"+global.project.name+"/"+request.params.begin+"' alt='{{root}}/"+global.project.name+"/"+request.params.begin+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "<span style='color:red;'>Begin:</span> "+clip.start;
    	body += "</div>";
    	
    	body += "<img src='{{root}}/"+global.project.name+"/"+request.params.end+"' alt='{{root}}/"+global.project.name+"/"+request.params.end+" not loaded.' style='display:block; margin-top:15px; width:350px; height:auto;'>";
    	body += "<div style='display:block; text-align:left; margin-top:15px;'>";
    	body += "<span style='color:red;'>End:</span> "+clip.finish;
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
}

module.exports = {
	extract,
	result
};