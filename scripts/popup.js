"use strict";

var cbData = {
	"spreadsheetURL": "",
	"commentData": {},
	"commentIndex": -1,

	"errorWrapper": "spanError",
	
	"retrieveButtonId": "btnRetrieve",
	"configureButtonId": "btnConfigure",
	"configureSaveButtonId": "btnSaveURL",
	
	"urlContentId": "urlContent",
	"urlInputId": "inputCommentURL",
	
	"commentSearchInputId": "inputCommentSearch",
	
	"tagSearchInputId": "inputTagSearch",
	"tagSearchLabelId": "labelTagSearch",
	"tagSelectButtonId": "btnTagOpenClose",
	"tagSelectContentId": "tagSelectContent",
	"tagSelectId": "cbTagSelect",
	"tagSelectClass": "cb-tag-select",
	
	"commentListId" : "selComment",
	"commentListOptionBaseId" : "optComment",
	
	"clipboardCopyBtn": "btnCopy",
	"clipboardCopyTarget": "copyTarget",
	
	"visibilityClass": "hide-me",
	
	"caretCharacter": {
		"up":  "&#9650;",
		"down": "&#9660;"
	},
};

$(document).ready(function() {	
	document.getElementById(cbData.urlContentId).classList.add(cbData.visibilityClass);
	document.getElementById(cbData.tagSearchLabelId).classList.add(cbData.visibilityClass);
	document.getElementById(cbData.commentSearchInputId).addEventListener('keyup', function(e) {
		handleInputKeyUp(this, e);
	});
	
	var elemTagBlockOpenClose = document.getElementById(cbData.tagSelectButtonId);
	elemTagBlockOpenClose.innerHTML = cbData.caretCharacter.down;
	elemTagBlockOpenClose.addEventListener('click', function() {
		handleTagBlockOpenClose(this)
	});
	
	document.getElementById(cbData.tagSearchInputId).addEventListener('click', function() {
		handleTagSearchInputClick(this);
	});	
	document.getElementById(cbData.tagSearchInputId).addEventListener('keyup', function(e) {
		handleInputKeyUp(this, e);
	});

	document.getElementById(cbData.retrieveButtonId).addEventListener('click', function() {
		handleRetrieveButton();
	});
	document.getElementById(cbData.configureButtonId).addEventListener('click', function() {
		handleConfigureButton();
	});
	document.getElementById(cbData.configureSaveButtonId).addEventListener('click', function() {
		handleConfigureSaveButton();
	});
	
	loadTagData();

	$("#" + cbData.commentListId).change(handleCommentChange);
		
	$("#" + cbData.clipboardCopyTarget).hide();
	new Clipboard('#' + cbData.clipboardCopyBtn);
});

function loadTagData() {
	clearAllData();
	retrieveSettings(
		document.getElementById(cbData.urlInputId), 
		document.getElementById(cbData.commentSearchInputId), 
		document.getElementById(cbData.tagSearchInputId), 
		function() {
			if (cbData.spreadsheetURL == null || cbData.spreadsheetURL == '') {
				handleConfigureButton();
				showError("Please enter the spreadsheet URL and press 'Save'");
				document.getElementById(cbData.configureButtonId).disabled = true;
			} else {
				hideError();
				retrieveTagList(cbData.commentData, buildTagSelectHTML);
				document.getElementById(cbData.configureButtonId).disabled = false;
			}
		}
	)	
}

function clearAllData()
{
	cbData.commentData = {};
	cbData.commentIndex = -1;
	document.getElementById(cbData.commentSearchInputId).value = '';
	document.getElementById(cbData.tagSearchInputId).value = '';
	document.getElementById(cbData.tagSearchLabelId).innerHTML = '';

	document.getElementById(cbData.tagSelectContentId).innerHTML = '';
	document.getElementById(cbData.commentListId).innerHTML = '';
}

function buildTagSelectHTML()
{
	var maxTagsInColumn = 16;
	var container = document.getElementById(cbData.tagSelectContentId);
	var selectName = cbData.tagSelectId;

	var elemTable = document.createElement('table');
	var elemRow = [];

	for (var i = 0; i < maxTagsInColumn; i++) {
		elemRow[i] = document.createElement('tr');
		elemTable.appendChild(elemRow[i]);
	}
	
	for (var i = 0; i < cbData.commentData.tagarray.length; i++) {
		var elemCell = document.createElement('td');
		elemCell.style = "min-width: 120px";
		
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
		
		elemCell.appendChild(cb);
		elemCell.appendChild(label);
		elemRow[i % maxTagsInColumn].appendChild(elemCell);	
		
	}
	
	container.appendChild(elemTable);
	handleRetrieveButton();
}

function saveCurrentSettings(callback)
{
	var elemConfigURL = document.getElementById(cbData.urlInputId);
	var elemSearch = document.getElementById(cbData.commentSearchInputId);
	var elemTag = document.getElementById(cbData.tagSearchInputId);
	storeSettings(elemConfigURL, elemSearch, elemTag, callback);
}

function handleTagBlockOpenClose(btn)
{
	var elemWrapper = document.getElementById(cbData.tagSelectContentId);
	var elemSearch = document.getElementById(cbData.tagSearchInputId);
	var elemLabel = document.getElementById(cbData.tagSearchLabelId);
	var elemComment = document.getElementById(cbData.commentListId);

	toggleClassForElement(elemWrapper, cbData.visibilityClass);
	if (isVisible(elemWrapper)) {
		btn.innerHTML = cbData.caretCharacter.up;
		setTagSelectionsToMatchSearch();
		elemSearch.classList.add(cbData.visibilityClass);
		elemLabel.classList.remove(cbData.visibilityClass);
		elemComment.classList.add(cbData.visibilityClass);
	} else {
		btn.innerHTML = cbData.caretCharacter.down;
		elemSearch.classList.remove(cbData.visibilityClass);
		elemLabel.classList.add(cbData.visibilityClass);
		elemComment.classList.remove(cbData.visibilityClass);
		cbData.commentIndex = -1;
		handleRetrieveButton();
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

function handleInputKeyUp(elem, e) 
{
	if (e.keyCode == 13) {
		cbData.commentIndex = -1;
		handleRetrieveButton();
	}
}

function handleConfigureButton()
{
	var clist = document.getElementById(cbData.urlContentId).classList;
	if (clist.contains(cbData.visibilityClass)) {
		clist.remove(cbData.visibilityClass);
	} else {
		clist.add(cbData.visibilityClass);
		document.getElementById(cbData.urlInputId).value = cbData.spreadsheetURL;
	}
}

function showConfigureButton()
{
	var clist = document.getElementById(cbData.urlContentId).classList;
	if (clist.contains(cbData.visibilityClass)) {
		clist.remove(cbData.visibilityClass);
	}
}

function hideConfigureButton()
{
	var clist = document.getElementById(cbData.urlContentId).classList;
	clist.add(cbData.visibilityClass);
}

function handleConfigureSaveButton()
{
	cbData.spreadsheetURL = document.getElementById(cbData.urlInputId).value;
	cbData.commentIndex = -1;
	document.getElementById(cbData.commentSearchInputId).value = '';
	document.getElementById(cbData.tagSearchInputId).value = '';
	saveCurrentSettings(function () {
		loadTagData();
	});
	document.getElementById(cbData.urlContentId).classList.add(cbData.visibilityClass);
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

	retrieveComments(cbData.commentData, searchString, tagList, 
		function() {
			loadCommentList();
			saveCurrentSettings(scrollToComment);
		});
}

function loadCommentList() {
	var commentList = cbData.commentData.commentList;
	var elemWrapper = document.getElementById(cbData.commentListId);
	
	while (elemWrapper.childNodes.length > 0) {
		elemWrapper.removeChild(elemWrapper.childNodes[0]);
	}
	
	for (var i = 0; i < commentList.length; i++) {
		var elem = document.createElement('option');
		var sIndex = ("00000" + i).slice(-5);
		elem.id = cbData.commentListOptionBaseId + sIndex;
		elem.text = commentList[i];
		elem.value = sIndex;
		elem.selected = false;
		elemWrapper.appendChild(elem);
	}

	if (cbData.commentIndex >= 0) {
		var val = ("00000" + cbData.commentIndex).slice(-5);
		var elemIdCurrent = cbData.commentListOptionBaseId + val;
		var elemCurrent = document.getElementById(elemIdCurrent);
		elemCurrent.selected = true;	
		handleCommentChange();
	}
	
	$("#" + cbData.commentListId).attr("size", 20);
}

function scrollToComment()
{
	var option = currentOption(cbData.commentListId);
	var id = cbData.commentListOptionBaseId + option;
	var elem = document.getElementById(id);
	elem.scrollIntoView();
}

function handleCommentChange() {
	var option = currentOption(cbData.commentListId);
	var id = cbData.commentListOptionBaseId + option;
	var elem = document.getElementById(id);

	cbData.commentIndex = parseInt(option);
	saveCurrentSettings(null);
	copyTextToClipboard(elem.innerHTML);
}

function currentOption(id) {
	return $('#'+id).find('option:selected').val();
}

function copyTextToClipboard(text) {
	var formattedText = formatTextFromMarkup(text);
	var target = "#" + cbData.clipboardCopyTarget;
	var btn = "#" + cbData.clipboardCopyBtn;

	$(target).show();

	$(target).html(formattedText);
	$(btn).click();
	$(target).hide();
}

function formatTextFromMarkup(text) {
	var codeblockspan = "<span style=\"font-family: 'courier new', courier;\">";
	var codeblockendspan = '</span>';
	var lineBreak = "|";
	var pseudoTab = "&nbsp;&nbsp;&nbsp;";
	
	var reader = new commonmark.Parser();
	var writer = new commonmark.HtmlRenderer();
	console.log('format: original text: |' + text + '|');
	text = text.replaceAll(lineBreak, "\n");
	//console.log('line breaks: |' + text + '|');
	
	var parsed = reader.parse(text);

	var walker = parsed.walker();
	var event, node;
/*
	while ((event = walker.next())) {
	  node = event.node;
	  console.log('type=' + node.type + ' literal=' + node.literal + ' info=' + node.info);
	}	
*/
	var result = writer.render(parsed);
	//console.log('after render: |' + result + '|');
	result = emojifyString(result);
	result = result.replaceAll('<code>', codeblockspan);
	result = result.replaceAll('<code class="language-function">', codeblockspan);
	result = result.replaceAll('</code>', codeblockendspan);
	result = result.replaceAll('\\t', pseudoTab);
	result = emojifyString(result);
	result = formatStrikeThroughString(result);

	return result;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function formatStrikeThroughString(originalString)
{
	var s = originalString;
	
    var pattern = /\~\~[^~]*\~\~/g;
		
	var result;
	while ( (result = pattern.exec(s)) !== null) {
		s = s.substring(0, result.index) + '<s>' + result.toString().slice(2, -2) + '</s>' + s.substring(pattern.lastIndex);
	}

	return s;
}

function showError(strError) {
	var elemWrapper = document.getElementById(cbData.errorWrapper);
	var clist = elemWrapper.classList;

	elemWrapper.innerHTML = strError;
	if (clist.contains(cbData.visibilityClass)) {
		clist.remove(cbData.visibilityClass);
	}
}

function hideError() {
	var clist = document.getElementById(cbData.errorWrapper).classList;
	clist.add(cbData.visibilityClass);
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
