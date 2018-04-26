"use strict";

function retrieveSettings(urlElem, searchElem, tagElem, callback)
{
	
	chrome.storage.sync.get(['cbURL', 'cbSearch', 'cbTags', 'cbCommentIndex'], function(result) {
		var urlString = '';
		var searchString = '';
		var tagString = '';
		var commentIndex = 0;

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
		urlElem.value = urlString;
		searchElem.value = searchString;
		tagElem.value = tagString;
		callback();
    });
}

function storeSettings(urlElem, searchElem, tagElem, callback)
{
	var keys = {
		"cbURL": urlElem.value,
		"cbSearch": searchElem.value, 
		"cbTags": tagElem.value,
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
				hideConfigureButton();
				document.getElementById(cbData.configureButtonId).disabled = false;
				onSuccessFunc(xhttp.response, onSuccessArgs, objResultData);
				followingFunc();
			} else {
				//alert('Unable to load file from: ' + spreadsheetURL);
				showError('Unable to load file from: ' + spreadsheetURL);
				showConfigureButton();
				document.getElementById(cbData.configureButtonId).disabled = true;
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
