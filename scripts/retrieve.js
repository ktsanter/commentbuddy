"use strict";

function retrieveSettings(callback)
{
	chrome.storage.sync.get(['cbURL', 'cbSearch', 'cbTags', 'cbCommentIndex'], function(result) {
		var urlString = '';
		var searchString = '';
		var tagString = '';
		var commentIndex = -1;

		if (typeof result.cbURL != 'undefined') {
			urlString = result.cbURL;
		}
		if (typeof result.cbSearch != 'undefined') {
			searchString = result.cbSearch;
		}
		if (typeof result.cbTags != 'undefined') {
			tagString = result.cbTags;
		}
		if (typeof result.cbCommentIndex != 'undefined') {
			commentIndex = result.cbCommentIndex;
		}
		
		cbData.spreadsheetURL = urlString;
		cbData.commentIndex = commentIndex;
		$(cbData.urlInputId).val(urlString);
		$(cbData.commentSearchInputId).val(searchString);
		$(cbData.tagSearchInputId).val(tagString);
		callback();
    });
}

function storeSettings(callback)
{
	var keys = {
		"cbURL": $(cbData.urlInputId).val(),
		"cbSearch": $(cbData.commentSearchInputId).val(), 
		"cbTags": $(cbData.tagSearchInputId).val(),
		"cbCommentIndex": cbData.commentIndex
	};
	
	chrome.storage.sync.set(keys, function() {
		if (callback != null) {
			callback();
		}
	});
}

function retrieveTagList(objResultData, followingFunc)
{
	cbData.tagarray = [];
	cbData.tagset = new Set();
	cbData.commentList = [];
	getCommentSpreadsheetData(parseTagData, null, objResultData, followingFunc);
}

function retrieveComments(objResultData, searchString, tagSearchList, followingFunc)
{
	var args = {"searchstring": searchString, "tagsearchlist": tagSearchList};
	cbData.commentList = [];
	getCommentSpreadsheetData(getMatchingComments, args, objResultData, followingFunc);
}

function getCommentSpreadsheetData(onSuccessFunc, onSuccessArgs, objResultData, followingFunc)
{
	var spreadsheetURL = cbData.spreadsheetURL;
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				hideError();
				hideConfigureInput();
				$(cbData.configureButtonId).removeAttr("disabled");
				onSuccessFunc(xhttp.response, onSuccessArgs, objResultData);
				followingFunc();
			} else {
				showError('Unable to load file from: ' + spreadsheetURL);
				$(cbData.configureButtonId).prop("disabled", true);
				showConfigureInput();
			}
		}
	};
	
	xhttp.open("GET", spreadsheetURL, true);
	xhttp.send();
}

function parseTagData(ssData, dummy, objResultData)
{
	var line = ssData.split("\n");
	var tagSet = new Set();
	
	for (var i = 0; i < line.length; i++) {
		var column = line[i].split("\t");
		var tag = column[0].split(",");
		for (var j = 0; j < tag.length; j++) {
			var tagText = tag[j].toLowerCase().trim();
			tagText = tagText.replace(" ", "_");
			tagSet.add(tagText);
		}
	}
	
	var uniqueTags = [];
	var iterator = tagSet.values();
	for (let entry of iterator) {
		uniqueTags.push(entry);
	}
	uniqueTags.sort();
	
	objResultData.tagarray = uniqueTags;
	objResultData.tagset = tagSet;
}

function getMatchingComments(ssData, args, results) {
	var matchingComments = [];
	var searchString = args.searchstring;
	var tagSearchList = args.tagsearchlist;
	
	var line = ssData.split("\n");

	for (var i = 0; i < line.length; i++) {
		var col = line[i].split("\t");
		var tagSet = makeTagSetFromCSV(col[0]);
		var comment = col[1];
		var potentialMatch = true;
			
		if (tagSearchList.length > 0) {
			for (var j = 0; j < tagSearchList.length && potentialMatch; j++) {
				potentialMatch = tagSet.has(tagSearchList[j]);
			}
		}
		
		if (potentialMatch && searchStringMatches(searchString, comment)) {
			matchingComments.push(comment);
		}
	}

	results.commentList = matchingComments;
}

function makeTagSetFromCSV(csv)
{
	var tset = new Set();
	var tarr = csv.split(",");
	for (var i = 0; i < tarr.length; i++) {
		var tagText = tarr[i].toLowerCase().trim();
		tagText = tagText.replace(" ", "_");
		tset.add(tagText);
	}
	return tset;
}

function searchStringMatches(searchString, comment) 
{
	var match = true;
	var search = searchString.trim();
	if (search.length > 0) {
		var lcomment = comment.toLowerCase();
		var lsearch = search.toLowerCase();
		match = (lcomment.search(lsearch) >= 0);
	}
	
	return match;
}

function test()
{
	var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSP2U-7ExmhrnQ1ynOYIgsfFm-jfQLfJ_NQ7iYKtS4nmwwl6-kJgsvBtaoonaO9stEIx_E6UnQBAiBv/pub?output=html';
	testData1(url);
}

function testData1(url)
{
	var elem = "#testDiv";
	
	$(elem).hide();
	
	var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSP2U-7ExmhrnQ1ynOYIgsfFm-jfQLfJ_NQ7iYKtS4nmwwl6-kJgsvBtaoonaO9stEIx_E6UnQBAiBv/pub?output=html';
		console.log('here we go...');
    $(elem).load(url, function(responseTxt, statusTxt, xhr){
		console.log('in callback...');
        if(statusTxt == "success") {
            console.log("External content loaded successfully!");
			parseCommentHTML($(elem).html());
		} else if(statusTxt == "error") {
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
		} else {
			console.log(xhr.status + ": " + xhr.statusText);
		}
    });
}

function parseCommentHTML(data)
{
	//console.log(data);
	var sheet = 0;
	
	var nRows = $("[id^=" + sheet + "R]").length;
	console.log("nRows = " + nRows);
	
	for (var row = 0; row < nRows; row++) {
		var rowdata = document.getElementById(sheet + "R" + row);
		var child = rowdata.parentNode.childNodes;
		var tags = child[1].innerHTML;
		var comment = child[2].innerHTML;
		console.log("row #" + row + " tags='" + tags + "' comment='" + comment + "'");
	}
	
	console.log("that's it");
}