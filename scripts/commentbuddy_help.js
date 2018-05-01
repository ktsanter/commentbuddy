"use strict";

var cbhData = {
	"inputSelector": "#testInput",
	"outputSelector": "#testOutput"
};

$(document).ready(function() {	
	$(cbhData.inputSelector).bind('input change', function() {
		handleTestInputChange();
	});
});

function handleTestInputChange()
{
	var orig = $(cbhData.inputSelector).val();
	var formatted = formatTextFromMarkup(orig, false);
	$(cbhData.outputSelector).html(formatted);
}
