function create(request, response)
{
	//
	var head = "";
	//
	var body = "<div style='overflow-y:scroll; width:350px; height:200px; display:block; border-style:solid; border-color:black; border-radius:2.5px;' id='url-input' class='text-input' contenteditable='true'></div>";
	body += "<script> function create() { var input = document.getElementById('url-input'); var string = input.innerText; if(string === '') { return; } var url = '{{root}}/create/'+encodeURIComponent(string); window.location = url; } </script>";
	body += "<div style='width:350px; height:75px; margin-top:15px; display:block; background-color:black; color:white; border-radius:2.5px; text-align:center;' onClick='create()'>";
	body += "<div style='display:table; width:100%; height:100%;'>";
	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>";
	body += "Create a new project from the URL above.";
	body += "</div>";
	body += "</div>";
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

const { v4: uuid } = require("uuid");
const { create: prepare } = require(process.cwd()+"/miscellaneous");

function result(request, response)
{
	//
	var url = request.params.url;
	var name = uuid();
	//
	if(global.project !== null)
	{
		global.project = null;
	}
	global.project = {
		name,
		url,
		output: name+".txt",
		file: "",
		width: "",
		height: "",
		preview: [],
		frame: {},
		clips: []
	};
	prepare();
	//
	var head = "";
	//
	var body = "<div style='width:350px; height:75px; margin-top:15px; display:block; background-color:black; color:white; border-radius:2.5px; text-align:center;'>";
	body += "<div style='display:table; width:100%; height:100%;'>";
	body += "<div style='display:table-cell; vertical-align:middle; width:100%; height:100%'>The creation of the project has been successful.</div>";
	body += "</div>";
	body += "</div>";
	body += "<div style='margin-top:15px; display:block; text-align:left;'>";
	body += "The project <span style='color:red;'>"+global.project.name+"</span> has been created from the url <span style='color:red;'>"+global.project.url+"</span>.";
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

module.exports = {
	create,
	result
};