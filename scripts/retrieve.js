"use strict";

function retrieveSettings(callback)
{
	chrome.storage.sync.get(['cbURL', 'cbBBSelector', 'cbSearch', 'cbTags', 'cbCommentIndex'], function(result) {
		var urlString = '';
		var bbSelector = true;
		var searchString = '';
		var tagString = '';
		var commentIndex = -1;

		if (typeof result.cbURL != 'undefined') {
			urlString = result.cbURL;
		}
		if (typeof result.cbBBSelector != 'undefined') {
			bbSelector = result.cbBBSelector;
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
		document.getElementById(cbData.bbSelectorId.substring(1)).checked = bbSelector;
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
		"cbBBSelector": document.getElementById(cbData.bbSelectorId.substring(1)).checked,
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

function retrieveTagAndCommentData(callback)
{
	cbData.tagarray = [];
	cbData.tagset = new Set();
	cbData.fullCommentList = [];
	cbData.commentList = [];
	
	var url = cbData.spreadsheetURL; 	
	var elemSelector = cbData.dataStagingId;

    $(elemSelector).load(url, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success") {
			parseTagAndCommentData($(elemSelector).html());
			callback();
			
		} else if(statusTxt == "error") {
			showError('Unable to load file from: ' + url);
			$(cbData.configureButtonId).prop("disabled", true);
			showConfigureInput();
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
			
		} else {
			console.log(xhr.status + ": " + xhr.statusText);
		}
    });
}

function parseTagAndCommentData(data)
{
	var sheet = 0;
	var fullTagSet = new Set();
	var commentList = [];
	
	var nRows = $("[id^=" + sheet + "R]").length;
	
	for (var row = 0; row < nRows; row++) {
		var rowdata = document.getElementById(sheet + "R" + row);
		var child = rowdata.parentNode.childNodes;
		
		var tagEntry = child[1].innerHTML.split(",");
		var tagsForThisComment = new Set();
		for (var j = 0; j < tagEntry.length; j++) {
			var tagText = tagEntry[j].toLowerCase().trim();
			tagText = tagText.replace(" ", "_");
			fullTagSet.add(tagText);
			tagsForThisComment.add(tagText);
		}
		
		var comment = child[2].innerHTML;
		comment = comment.replaceAll('<br>', String.fromCharCode(10) + String.fromCharCode(10));
		var hovertext = child[3].textContent;
		commentList.push({"tags": tagsForThisComment, "comment": comment, "hovertext": hovertext});
	}
	
	var uniqueTags = [];
	var iterator = fullTagSet.values();
	for (let entry of iterator) {
		uniqueTags.push(entry);
	}
	uniqueTags.sort();
	
	cbData.commentData.tagarray = uniqueTags;
	cbData.commentData.tagset = fullTagSet;
	cbData.commentData.fullCommentList = commentList;
}

function retrieveComments(searchString, tagSearchList)
{
	var fullComments = cbData.commentData.fullCommentList;
	var matchingComments = [];
	
	for (var i = 0; i < fullComments.length; i++) {
		var tagSet = fullComments[i].tags;
		var comment = fullComments[i].comment;
		var hovertext = fullComments[i].hovertext;
		var potentialMatch = true;
			
		if (tagSearchList.length > 0) {
			for (var j = 0; j < tagSearchList.length && potentialMatch; j++) {
				potentialMatch = tagSet.has(tagSearchList[j]);
			}
		}
		
		if (potentialMatch && searchStringMatches(searchString, comment)) {
			matchingComments.push({"comment": comment, "hovertext": hovertext});
		}
	}

	cbData.commentData.commentList = matchingComments;
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
