"use strict";

function retrieveSettings(callback)
{
	chrome.storage.sync.get(['cbSpreadsheetFileId', 'cbBBSelector', 'cbSearch', 'cbTags', 'cbCommentIndex'], function(result) {
		var fileIdString = '';
		var bbSelector = true;
		var searchString = '';
		var tagString = '';
		var commentIndex = -1;

		if (typeof result.cbSpreadsheetFileId != 'undefined') {
			fileIdString = result.cbSpreadsheetFileId;
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
		
		cbData.spreadsheetFileId = fileIdString;
		document.getElementById(cbData.bbSelectorId.substring(1)).checked = bbSelector;
		cbData.commentIndex = commentIndex;
		$(cbData.urlInputId).val(fileIdString);
		$(cbData.commentSearchInputId).val(searchString);
		$(cbData.tagSearchInputId).val(tagString);

		callback();
  });
}

function storeSettings(callback)
{	
	var keys = {
		"cbSpreadsheetFileId": $(cbData.urlInputId).val(),
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

  _getTagAndCommentData(cbData.spreadsheetFileId, parseTagAndCommentData, callback);
}

function parseTagAndCommentData(data, callback)
{
	var fullTagSet = new Set();
	var commentList = [];
	
	for (var row = 0; row < data.cbdata.length; row++) {
		var rowdata = data.cbdata[row];
		
		var tagEntry = rowdata.tags.split(",");
		var tagsForThisComment = new Set();
		for (var j = 0; j < tagEntry.length; j++) {
			var tagText = tagEntry[j].toLowerCase().trim();
			tagText = tagText.replace(" ", "_");
			fullTagSet.add(tagText);
			tagsForThisComment.add(tagText);
		}
		
		var comment = rowdata.comment;
		comment = comment.replaceAll('<br>', String.fromCharCode(10) + String.fromCharCode(10));
		var hovertext = rowdata.hovertext;
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
  
  callback();
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

//---------------------------------------------------------------
// Google Web API for retrieving tag and comment data
//---------------------------------------------------------------

const API_BASE = 'https://script.google.com/a/mivu.org/macros/s/AKfycbzslpRyJsncJoufxogGhjSHB5bnQov_2flD3hPDryYNCHnH-VkX/exec';
const API_KEY = 'MVcommentbuddyAPI';

//--------------------------------------------------------------
// build URL for use with Google sheet web API
//--------------------------------------------------------------
	function _buildApiUrl (datasetname, params) {
    let url = API_BASE;
    url += '?key=' + API_KEY;
    url += datasetname && datasetname !== null ? '&dataset=' + datasetname : '';

    for (var param in params) {
      url += '&' + param + '=' + params[param].replace(/ /g, '%20');
    }

    //console.log('buildApiUrl: url=' + url);
    
    return url;
  }
  
//--------------------------------------------------------------
// use Google Sheet web API to get tag and comment data
//--------------------------------------------------------------
function _getTagAndCommentData (sourceFileId, callback1, callback2) {
//	console.log('loading tag and comment data...');
  var urlParams = {
    sourcefileid: sourceFileId
  };

	fetch(_buildApiUrl('cbdata', urlParams))
		.then((response) => response.json())
		.then((json) => {
			//console.log('json.status=' + json.status);
			//console.log('json.data: ' + JSON.stringify(json.data));
			if (json.status !== 'success') {
				//console.log('json.message=' + json.message);
			} else {
				callback1(json.data, callback2);
			}
		})
		.catch((error) => {
			console.log('Unexpected error loading tag and comment data');
			console.log(error);
		});
}
