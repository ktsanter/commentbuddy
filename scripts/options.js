"use strict";

$(document).ready(function() {
	displayUsername();
	
	$("#btnUploadRedirect").click(function () {
		handleUploadRedirect();
	});
	
	$("#btnSaveUserName").click(function () {
		handleSaveUserNameClick();
	});
});

function handleUploadRedirect() {
	console.log('redirect...');
	window.close();
	window.open("https://ktsanter.duckdns.org/commentbuddy/index.html", "_blank");
}

function handleSaveUserNameClick() {
	console.log('handle save...');
	var username = $("#inpUsername").val();
	console.log('saving username=' + username);
	chrome.storage.sync.set({"username": username}, function() {console.log('set okay');} )
}


function displayUsername() {
	console.log("displayUsername...");
	var username = '';
	
	chrome.storage.sync.get({"username":'unknown'}, function(items) {
		console.log(JSON.stringify(items));
		console.log("user name = " + items.username);
		$("#inpUsername").val(items.username);
	});
}
