"use strict";

function retrieveSettings(searchElem, tagElem, callback)
{
	chrome.storage.sync.get(['cbSearch', 'cbTags'], function(result) {
		var searchString = '';
		var tagString = '';

		if (typeof result.cbSearch != 'undefined') {
			searchString = result.cbSearch;
		}
		if (typeof result.cbTags != 'undefined') {
			tagString = result.cbTags;
		}
		
		searchElem.value = searchString;
		tagElem.value = tagString;
		callback();
    });
}

function storeSettings(searchElem, tagElem)
{
	var keys = {"cbSearch": searchElem.value, "cbTags": tagElem.value};
	chrome.storage.sync.set(keys, function() {});
}

function retrieveTagList(objResultData, followingFunc)
{
	getCommentSpreadsheetData(parseTagData, null, objResultData, followingFunc);
}

function retrieveComments(objResultData, searchString, tagSearchList, followingFunc)
{
	var args = {"searchstring": searchString, "tagsearchlist": tagSearchList};
	getCommentSpreadsheetData(getMatchingComments, args, objResultData, followingFunc);
}

function getCommentSpreadsheetData(onSuccessFunc, onSuccessArgs, objResultData, followingFunc)
{
	var spreadsheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSP2U-7ExmhrnQ1ynOYIgsfFm-jfQLfJ_NQ7iYKtS4nmwwl6-kJgsvBtaoonaO9stEIx_E6UnQBAiBv/pub?output=tsv'
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			onSuccessFunc(xhttp.response, onSuccessArgs, objResultData);
			followingFunc();
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
