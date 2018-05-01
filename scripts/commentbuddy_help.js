"use strict";

var cbhData = {
	"inputSelector": "#testInput",
	"outputSelector": "#testOutput",
	
	"anchorSelector": ".cbh-nav-anchor"
};

$(document).ready(function() {	
	$(cbhData.inputSelector).bind('input change', function() {
		handleTestInputChange();
	});
	
	$(cbhData.anchorSelector).click(function() { handleAnchorSelection(this) });
});

function handleTestInputChange()
{
	var orig = $(cbhData.inputSelector).val();
	var formatted = formatTextFromMarkup(orig, false);
	$(cbhData.outputSelector).html(formatted);
}

function handleAnchorSelection(elem)
{
	$(cbhData.anchorSelector).removeClass('active');
	$(elem).addClass('active');
}