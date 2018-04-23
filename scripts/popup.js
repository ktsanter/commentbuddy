"use strict";

var cbData = {
	"commentData": {},
	
	"commentSearchInputId": "inputCommentSearch",
	
	"tagSearchInputId": "inputTagSearch",
	"tagSearchLabelId": "labelTagSearch",
	"tagSelectButtonId": "btnTagOpenClose",
	"tagSelectContentId": "tagSelectContent",
	"tagSelectId": "cbTagSelect",
	"tagSelectClass": "cb-tag-select",
	
	"retrieveButtonId": "btnRetrieve",
	
	"commentListId" : "selComment",
	
	"visibilityClass": "hide-me",
	
	"caretCharacter": {
		"up":  "&#9650;",
		"down": "&#9660;"
	}
};

$(document).ready(function() {
	loadDataFromInternal();

	document.getElementById(cbData.tagSearchLabelId).classList.add(cbData.visibilityClass);
	
	var elemTagBlockOpenClose = document.getElementById(cbData.tagSelectButtonId);
	elemTagBlockOpenClose.innerHTML = cbData.caretCharacter.down;
	elemTagBlockOpenClose.addEventListener('click', function() {
		handleTagBlockOpenClose(this)
	});
	
	document.getElementById(cbData.tagSearchInputId).addEventListener('click', function() {
		handleTagSearchInputClick(this);
	});
	
	document.getElementById(cbData.retrieveButtonId).addEventListener('click', function() {
		handleRetrieveButton();
	});
	
	$("#selComment").change(function() {
		handleCommentChange();
	});
	
	$("#copyTarget").hide();
	new Clipboard('#btnCopy');
});

function loadDataFromInternal() {
	cbData.commentData = parseCommentData();
	buildTagSelectHTML();
}

function buildTagSelectHTML()
{
	var container = document.getElementById(cbData.tagSelectContentId);
	var selectName = cbData.tagSelectId;

	for (var i = 0; i < cbData.commentData.tagarray.length; i++) {
		var selectId = selectName + ("0000" + i).slice(-4);
		var tagval = cbData.commentData.tagarray[i];
		
		var cb = document.createElement('input');
		cb.type = 'checkbox';
		cb.name = selectName;
		cb.value = tagval;
		cb.id = selectId;
		cb.classList.add(cbData.tagSelectClass);
		cb.addEventListener('click', function() {
			handleTagClick(this);
		});

		var label = document.createElement('label');
		label.htmlFor = selectId;
		label.appendChild(document.createTextNode(tagval));
		
		container.appendChild(cb);
		container.appendChild(label);
		container.appendChild(document.createElement('br'));	
	}
}

function handleTagBlockOpenClose(btn)
{
	var elemWrapper = document.getElementById(cbData.tagSelectContentId);
	var elemSearch = document.getElementById(cbData.tagSearchInputId);
	var elemLabel = document.getElementById(cbData.tagSearchLabelId);

	toggleClassForElement(elemWrapper, cbData.visibilityClass);
	if (isVisible(elemWrapper)) {
		btn.innerHTML = cbData.caretCharacter.up;
		setTagSelectionsToMatchSearch();
		elemSearch.classList.add(cbData.visibilityClass);
		elemLabel.classList.remove(cbData.visibilityClass);
	} else {
		btn.innerHTML = cbData.caretCharacter.down;
		elemSearch.classList.remove(cbData.visibilityClass);
		elemLabel.classList.add(cbData.visibilityClass);
	}		
}

function handleTagSearchInputClick(elem)
{
	if (isVisible(document.getElementById(cbData.tagSelectContentId))) {
		handleTagBlockOpenClose(document.getElementById(cbData.tagSelectButtonId));
	}
}

function handleTagClick(elem) 
{
	setTagInfoToMatchSelections();
}

function setTagInfoToMatchSelections()
{
	var s = makeStringFromTagSelections();
	document.getElementById(cbData.tagSearchLabelId).innerHTML = s;
	document.getElementById(cbData.tagSearchInputId).value = s;
}

function makeStringFromTagSelections()
{
	var tagString = "";
	var elemTag = document.getElementsByName(cbData.tagSelectId);

	for (var i = 0, first = true; i < elemTag.length; i++) {
		var elem = elemTag[i];
		if (elem.checked) {
			if (!first) {
				tagString += " ";
			}
			tagString += elem.value;
			first = false;
		}
	}
	
	return tagString;
}

function setTagSelectionsToMatchSearch()
{
	var elemTagSearch = document.getElementById(cbData.tagSearchInputId);
	var elemTagLabel = document.getElementById(cbData.tagSearchLabelId);
	
	var tagSearchList = elemTagSearch.value.split(" ");
	var tagSet = new Set();
	for (var i = 0; i < tagSearchList.length; i++) {
		tagSet.add(tagSearchList[i]);
	}
	
	var elemTag = document.getElementsByName(cbData.tagSelectId);
	var validTagSet = new Set();
	for (var i = 0; i < elemTag.length; i++) {
		elemTag[i].checked = tagSet.has(elemTag[i].value);
		if (elemTag[i].checked) {
			validTagSet.add(elemTag[i].value);
		}
	}
	
	var invalidTagSet = mySetDifference(tagSet, validTagSet);
	var sValid = mySetToString(validTagSet, " ");
	var sInvalid = mySetToString(invalidTagSet, " ");
	
	if (sInvalid.length > 0) {
		sInvalid = '<span style="text-decoration: line-through;">' + sInvalid + '</span>';
	}

	if (sInvalid.length < 1 && sValid.length < 1) {
		elemTagLabel.innerHTML = "&nbsp;";
	} else {
		elemTagLabel.innerHTML = sValid + " " + sInvalid;
	}
	elemTagSearch.value = sValid;
}

function handleRetrieveButton()
{
	var searchString = document.getElementById(cbData.commentSearchInputId).value;
	var tagList = [];

	var elemTagWrapper = document.getElementById(cbData.tagSelectContentId);
	if (isVisible(elemTagWrapper)) {
		handleTagBlockOpenClose(document.getElementById(cbData.tagSelectButtonId));
	}
	setTagSelectionsToMatchSearch();
	
	var elemTag = document.getElementsByName(cbData.tagSelectId);
	for (var i = 0; i < elemTag.length; i++) {
		if (elemTag[i].checked) {
			tagList.push(elemTag[i].value);
		}
	}

	var retrievedComment = retrieveComments(cbData.commentData, searchString, tagList);

	loadCommentList(retrievedComment);
}

function loadCommentList(commentList) {
	var elemWrapper = document.getElementById(cbData.commentListId);
	
	while (elemWrapper.childNodes.length > 0) {
		elemWrapper.removeChild(elemWrapper.childNodes[0]);
	}
	
	for (var i = 0; i < commentList.length; i++) {
		var elem = document.createElement('option');
		var sIndex = ("00000" + i).slice(-5);
		elem.id = 'optComment' + sIndex;
		elem.text = commentList[i];
		elem.value = sIndex;
		elem.selected = false;
		elemWrapper.appendChild(elem);
	}

	$("#selComment").attr("size", Math.max(20, commentList.length));

}

function handleCommentChange() {
	var option = currentOption('selComment');
	var id = 'optComment' + option;
	console.log('option=' + option + ' id=|' + id + "|");
	var elem = document.getElementById(id);
	console.log(elem.innerHTML);
	copyTextToClipboard(elem.innerHTML);
}

function currentOption(id) {
	return $('#'+id).find('option:selected').val();
}

function copyTextToClipboard(text) {
	console.log('text=|' + text + '|');
	var formattedText = formatTextFromMarkup(text);
	console.log('formmattedText=|' + formattedText + '|');
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

function validTag(tagval)
{
	return cbData.commentData.tagset.has(tagval);
}

function mySetDifference(set1, set2)
{
	var diffSet = new Set();
	
	var iterator1 = set1.values();
	for (let entry of iterator1) {
		if (!set2.has(entry)) {
			diffSet.add(entry);
		}
	}
	return diffSet;
}

function mySetToString(myset, delim)
{
	var s = "";
	var  iterator1 = myset.values();
	for (let entry of iterator1) {
		s += delim + entry;
	}
	return s.substring(delim.length);
}

function toggleClassForElement(elem, className)
{
	var clist = elem.classList;
	if (clist.contains(className)) {
		clist.remove(className);
	} else {
		clist.add(className);
	}
}

function isVisible(elem)
{
	return !elem.classList.contains(cbData.visibilityClass);
}
