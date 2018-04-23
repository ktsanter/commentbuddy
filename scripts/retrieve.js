"use strict";

function retrieveComments(commentData, searchString, tagSearchList) {
	var matchingComments = [];
	
	var cdata = commentData.data;

	for (var i = 0; i < cdata.length; i++) {
		var potentialMatch = true;
		var tagSet = cdata[i].tagset;
		var comment = cdata[i].comment;
			
		if (tagSearchList.length > 0) {
			for (var j = 0; j < tagSearchList.length && potentialMatch; j++) {
				potentialMatch = tagSet.has(tagSearchList[j]);
			}
		}
		
		if (potentialMatch && searchStringMatches(searchString, comment)) {
			matchingComments.push(comment);
		}
	}

	return matchingComments;
}

function searchStringMatches(searchString, comment) 
{
	var match = true;
	var search = searchString.trim();
	if (search.length > 0) {
		match = (comment.search(searchString) >= 0);
	}
	
	return match;
}
