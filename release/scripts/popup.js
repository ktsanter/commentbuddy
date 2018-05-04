"use strict";

var cbData = {
	"helpURL": "https://ktsanter.github.io/commentbuddy/",
	"spreadsheetURL": "",
	"commentData": {},
	"commentIndex": -1,

	"errorWrapper": "#spanError",
	
	"dataStagingId": "#dataStage",
	"versionId": "#spanVersion",
	
	"retrieveButtonId": "#btnRetrieve",
	"configureButtonId": "#btnConfigure",
	"helpButtonId": "#btnHelp",
	"configureSaveButtonId": "#btnSaveURL",
	"bbSelectorId": "#bbSelector",
	
	"urlContentId": "#urlContent",
	"urlInputId": "#inputCommentURL",
	
	"commentSearchInputId": "#inputCommentSearch",
	
	"tagSearchInputId": "#inputTagSearch",
	"tagSearchLabelId": "#labelTagSearch",
	"tagSelectButtonId": "#btnTagOpenClose",
	"tagSelectContentId": "#tagSelectContent",
	"tagSelectId": "cbTagSelect",
	"tagSelectClass": "cb-tag-select",
	
	"commentListId" : "#selComment",
	"commentListOptionBaseId" : "optComment", // note no jQuery selector symbol
	
	"clipboardCopyBtn": "#btnCopy",
	"clipboardCopyTarget": "#copyTarget",
	
	"caretCharacter": {
		"up":  "&#9650;",
		"down": "&#9660;"
	},
};

$(document).ready(function() {	
	hideError();
		
	$(cbData.dataStagingId).hide();
	$(cbData.urlContentId).hide();
	$(cbData.tagSearchLabelId).hide();
	$(cbData.tagSelectContentId).hide();
	$(cbData.clipboardCopyTarget).hide();
	$(cbData.clipboardCopyBtn).hide();
	
	new Clipboard(cbData.clipboardCopyBtn);

	$(cbData.commentSearchInputId).keyup(function(e) {
		handleInputKeyUp(this, e);
	});
	
	var elemTagBlockOpenClose = $(cbData.tagSelectButtonId);
	elemTagBlockOpenClose.html(cbData.caretCharacter.down);
	elemTagBlockOpenClose.click(function() {
		handleTagBlockOpenClose(this)
	});
	
	$(cbData.tagSearchInputId).click(function() {
		handleTagSearchInputClick(this);
	});	
	$(cbData.tagSearchInputId).keyup(function(e) {
		handleInputKeyUp(this, e);
	});

	$(cbData.retrieveButtonId).click(handleRetrieveButton);
	$(cbData.configureButtonId).click(handleConfigureButton);
	$(cbData.helpButtonId).click(handleHelpButton);
	$(cbData.configureSaveButtonId).click(handleConfigureSaveButton);
	$(cbData.bbSelectorId).change(handleBBSelector);
	
	$(cbData.commentListId).change(handleCommentChange);

	$(cbData.versionId).html("v" + chrome.runtime.getManifest().version);

	loadTagData();
});

function loadTagData() {
	clearAllData();
	retrieveSettings(
		function() {
			if (cbData.spreadsheetURL == null || cbData.spreadsheetURL == '') {
				handleConfigureButton();
				showError("Please enter the spreadsheet URL and press 'Save'");
				$(cbData.configureButtonId).prop("disabled",true);
				
			} else {
				hideError();
				$(cbData.configureButtonId).removeAttr("disabled");
				retrieveTagAndCommentData(buildTagSelectHTML);
			}
		}
	)	
}

function clearAllData()
{
	cbData.commentData = {};
	cbData.commentIndex = -1;
	$(cbData.commentSearchInputId).val('');	
	$(cbData.tagSearchInputId).val('');
	$(cbData.tagSearchLabelId).html('');

	$(cbData.tagSelectContentId).html('');
	$(cbData.commentListId).html('');
}

function buildTagSelectHTML()
{
	var maxTagsInColumn = 16;
	var container = $(cbData.tagSelectContentId);
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
	
	container.append(elemTable);
	handleRetrieveButton();
}

function saveCurrentSettings(callback)
{
	storeSettings(callback);
}

function handleTagBlockOpenClose(btn)
{
	var elemWrapper = $(cbData.tagSelectContentId);
	var elemSearch = $(cbData.tagSearchInputId);
	var elemLabel = $(cbData.tagSearchLabelId);
	var elemComment = $(cbData.commentListId);

	elemWrapper.toggle();
	if (isVisible(elemWrapper)) {
		btn.innerHTML = cbData.caretCharacter.up;
		setTagSelectionsToMatchSearch();
		elemSearch.hide();
		elemLabel.show();
		elemComment.hide();
	} else {
		btn.innerHTML = cbData.caretCharacter.down;
		elemSearch.show();
		elemLabel.hide();
		elemComment.show();
		cbData.commentIndex = -1;
		handleRetrieveButton();
	}		
}

function handleTagSearchInputClick(elem)
{
	if (isVisible($(cbData.tagSelectContentId))) {
		handleTagBlockOpenClose($(cbData.tagSelectButtonId));
	}
}

function handleTagClick(elem) 
{
	setTagInfoToMatchSelections();
}

function setTagInfoToMatchSelections()
{
	var s = makeStringFromTagSelections();

	$(cbData.tagSearchLabelId).html(s);
	$(cbData.tagSearchInputId).val(s);
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
	var elemTagSearch = $(cbData.tagSearchInputId);
	var elemTagLabel = $(cbData.tagSearchLabelId);
	
	var tagSearchList = elemTagSearch.val().split(" ");
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
		elemTagLabel.html("&nbsp;");
	} else {
		elemTagLabel.html(sValid + " " + sInvalid);
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
	var sel = $(cbData.urlContentId);
	sel.toggle();
	if (sel.is(":visible")) {
		sel.value = cbData.spreadsheetURL;
	}
}

function showConfigureInput()
{
	$(cbData.urlContentId).show();
}

function hideConfigureInput()
{
	$(cbData.urlContentId).hide();
}

function handleConfigureSaveButton()
{
	cbData.spreadsheetURL = $(cbData.urlInputId).value;
	cbData.commentIndex = -1;
	$(cbData.commentSearchInputId).val('');
	$(cbData.tagSearchInputId).val('');
	$(cbData.tagSearchLabelId).html('');
	storeSettings(function () {
		loadTagData();
	});
	$(cbData.urlContentId).hide();
}

function handleBBSelector()
{
	handleCommentChange();
}

function isBBModeSelected()
{
	return document.getElementById(cbData.bbSelectorId.substring(1)).checked;
}

function handleRetrieveButton()
{
	var searchString = $(cbData.commentSearchInputId).val();
	var tagList = [];

	var elemTagWrapper = $(cbData.tagSelectContentId);
	if (isVisible(elemTagWrapper)) {
		handleTagBlockOpenClose($(cbData.tagSelectButtonId));
	}
	setTagSelectionsToMatchSearch();
	
	var elemTag = document.getElementsByName(cbData.tagSelectId);
	for (var i = 0; i < elemTag.length; i++) {
		if (elemTag[i].checked) {
			tagList.push(elemTag[i].value);
		}
	}

	retrieveComments(searchString, tagList);
	loadCommentList();
	storeSettings(scrollToComment);
}

function loadCommentList() {
	var commentList = cbData.commentData.commentList;
	var elemWrapper = $(cbData.commentListId)[0];
	
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
	
	$(cbData.commentListId).attr("size", 20);
}

function scrollToComment()
{
	if (cbData.commentIndex >= 0) {
		var option = currentOption(cbData.commentListId);
		var id = cbData.commentListOptionBaseId + option;
		var elem = document.getElementById(id);
		elem.scrollIntoView();
	}
}

function handleCommentChange() {
	var option = currentOption(cbData.commentListId);
	var id = cbData.commentListOptionBaseId + option;
	var elem = document.getElementById(id);

	cbData.commentIndex = parseInt(option);
	storeSettings(null);
	copyTextToClipboard(elem.innerHTML);
}

function currentOption(id) {
	return $(id).find('option:selected').val();
}

function copyTextToClipboard(text) {
	var formattedText = formatTextFromMarkup(text, isBBModeSelected());
	var target = cbData.clipboardCopyTarget;
	var btn = cbData.clipboardCopyBtn;

	$(target).show();

	$(target).html(formattedText);
	$(btn).click();
	$(target).hide();
}

function handleHelpButton() 
{
	window.open(cbData.helpURL, '_blank');
}

function showError(strError) 
{
	$(cbData.errorWrapper).html(strError);
	$(cbData.errorWrapper).show();
}

function hideError() {
	$(cbData.errorWrapper).hide();
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
	return elem.is(':visible');
}
