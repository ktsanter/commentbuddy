"use strict";

var internalCommentData = {
 "data": [
		{
			"keyword": ["general", "common"],
			"comment": "Open the quiz if you'd like to read more feedback"
		},
		{
			"keyword": ["general", "common"],
			"comment": "Don't forget to come back and respond to your classmates"
		},
		{
			"keyword": ["general", "common"],
			"comment": "Unfortunately I can't open files of that type in BlackBoard.  Please resubmit using either Microsoft format (.docx, .pptx, etc.) or PDF format (.pdf)"
		},
		{
			"keyword": ["general", "common"],
			"comment": "Let me know if you'd like to try this assignment again."
		},
		
		{
			"keyword": ["cp", "career planning", "assignments"],
			"comment": "Be careful of spelling, punctuation and grammar.  You might consider installing a tool like Grammarly"
		},
		{
			"keyword": ["cp", "career planning", "assignments"],
			"comment": "Please resubmit, making sure to include the worksheet from the assignment"
		},
		{
			"keyword": ["cp", "career planning", "db", "discussion"],
			"comment": "Please respond to at least two of your classmates."
		},
		{
			"keyword": ["cp", "career planning", "db", "discussion"],
			"comment": "After you add to your post I'll update your score"
		},

		{
			"keyword": ["vb", "visual basic", "assignments"],
			"comment": "Please submit the .vb file for this assignment."
		},
		{
			"keyword": ["vb","visual basic", "assignments"],
			"comment": "I was unable to run your program.  Please fix the syntax errors and resubmit."
		},
		{
			"keyword": ["vb","visual basic", "assignments"],
			"comment": "Let me know if I can answer any questions."
		},
		{
			"keyword": ["vb", "visual basic", "db", "discussion"],
			"comment": "Please respond to at least two of your classmates."
		},
		{
			"keyword": ["vb", "visual basic", "db", "discussion"],
			"comment": "After you add to your post I'll update your score"
		},
		
		{
			"keyword": ["markup"],
			"comment": "multi-line comment|continued on this line"
		},
		{
			"keyword": ["markup"],
			"comment": "A **bold** comment"
		},
		{
			"keyword": ["markup"],
			"comment": "An *italic* comment"
		},
		{
			"keyword": ["markup"],
			"comment": "A ***bold italic*** comment"
		},
		{
			"keyword": ["markup"],
			"comment": "This should be a `bcode block`e and this shouldnt. "
		}
	],
	"keywords": []};

function parseCommentData()
{
	var keyset = new Set();
	
	for (var i = 0; i < internalCommentData.data.length; i++) {
		var klist = internalCommentData.data[i].keyword;
		for (var j = 0; j < klist.length; j++) {
			keyset.add(klist[j]);
		}
	}

	var uniqueKeywords = [];
	var  iterator1 = keyset.values();
	for (let entry of iterator1) {
		uniqueKeywords.push(entry);
	}

	console.log(uniqueKeywords.toString());
	uniqueKeywords.sort();
	internalCommentData.keywords = uniqueKeywords;
	
	return internalCommentData;
}
