"use strict";

var internalCommentData = {
 "data": [
		{
			"tag": ["general", "common"],
			"comment": "Open the quiz if you'd like to read more feedback"
		},
		{
			"tag": ["general", "common"],
			"comment": "Don't forget to come back and respond to your classmates"
		},
		{
			"tag": ["general", "common"],
			"comment": "Unfortunately I can't open files of that type in BlackBoard.  Please resubmit using either Microsoft format (.docx, .pptx, etc.) or PDF format (.pdf)"
		},
		{
			"tag": ["general", "common"],
			"comment": "Let me know if you'd like to try this assignment again."
		},
		
		{
			"tag": ["cp", "career planning", "assignments"],
			"comment": "Be careful of spelling, punctuation and grammar.  You might consider installing a tool like Grammarly"
		},
		{
			"tag": ["cp", "career planning", "assignments"],
			"comment": "Please resubmit, making sure to include the worksheet from the assignment"
		},
		{
			"tag": ["cp", "career planning", "db", "discussion"],
			"comment": "Please respond to at least two of your classmates."
		},
		{
			"tag": ["cp", "career planning", "db", "discussion"],
			"comment": "After you add to your post I'll update your score"
		},

		{
			"tag": ["vb", "visual basic", "assignments"],
			"comment": "Please submit the .vb file for this assignment."
		},
		{
			"tag": ["vb","visual basic", "assignments"],
			"comment": "I was unable to run your program.  Please fix the syntax errors and resubmit."
		},
		{
			"tag": ["vb","visual basic", "assignments"],
			"comment": "Let me know if I can answer any questions."
		},
		{
			"tag": ["vb", "visual basic", "db", "discussion"],
			"comment": "Please respond to at least two of your classmates."
		},
		{
			"tag": ["vb", "visual basic", "db", "discussion"],
			"comment": "After you add to your post I'll update your score"
		},
		
		{
			"tag": ["markup"],
			"comment": "multi-line comment|continued on this line"
		},
		{
			"tag": ["markup"],
			"comment": "A **bold** comment"
		},
		{
			"tag": ["markup"],
			"comment": "An *italic* comment"
		},
		{
			"tag": ["markup"],
			"comment": "A ***bold italic*** comment"
		},
		{
			"tag": ["markup"],
			"comment": "This is a really, really, extremely, superlatively, annoyingly, really, really, super-duper, extraordinarily long comment. "
		},
		{
			"tag": ["markup"],
			"comment": "This should be a `bcode block`e and this shouldnt. "
		}
	],
	"tagset": new Set(),
	"tagarray": []
};

function parseCommentData()
{
	for (var i = 0; i < internalCommentData.data.length; i++) {
		var tlist = internalCommentData.data[i].tag;
		var tset = new Set();
		for (var j = 0; j < tlist.length; j++) {
			var tag = tlist[j].toLowerCase();
			tag = tag.replace(" ", "_");
			internalCommentData.tagset.add(tag);
			tset.add(tag);
		}
		internalCommentData.data[i].tagset = tset;
	}

	var uniqueTags = [];
	var  iterator1 = internalCommentData.tagset.values();
	for (let entry of iterator1) {
		uniqueTags.push(entry);
	}

	uniqueTags.sort();
	
	internalCommentData.tagarray = uniqueTags;
	
	return internalCommentData;
}
