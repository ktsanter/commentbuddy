"use strict";

var commentData;

$(document).ready(function() {

  loadDataFromInternal();
  
  $("#copyTarget").hide();

  new Clipboard('.btn');
});

function loadDataFromInternal() {
  commentData = parseCommentData();
	console.log(commentData.keywords.toString());
  console.log("loadDataFromInternal complete");
}

function currentOption(id) {
  return $('#'+id).find('option:selected').val();
}

function copyTextToClipboard(text) {
	var formattedText = formatTextFromMarkup(text);
	$("#copyTarget").show();

	$("#copyTarget").html(formattedText);
	$("#btnCopy").click();
	$("#copyTarget").hide();
}

function formatTextFromMarkup(text) {
	var codeblockspan = "<span style=\"font-family: 'courier new', courier;\">";
	var codeblockendspan = '</span>';

	var formattedText = text.replace(/\|/gi, ' \r\n');
	var formattedText = formattedText.replace(/`b/gi, codeblockspan);
	var formattedText = formattedText.replace(/`e/gi, codeblockendspan);
	var formattedText = marked( formattedText );

	return formattedText;
}

function showError(strError) {
  $("#spanError").html('<b> Error - ' + strError + '</b>');
}
