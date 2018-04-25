"use strict";

//https://unicode.org/emoji/charts/full-emoji-list.html#1f410
var emojifierData = {
	"calendar": "&#x1F4C6;",
	"pencil": "&#x270F;",
	"megaphone": "&#x1F4E3;",
	"trophy": "&#x1F3C6;",
	"rainbow": "&#x1F308;",
	"stop sign": "&#x1F6D1;",
	"glasses": "&#x1F453;",
	"thumbs up": "&#x1F44D;",
	"thumbs down": "&#x1F44E;",
	"poop": "&#x1F4A9;",
	"alien": "&#x1F47D;",
	"frowning face": "&#x2639;",
	"smiling face with sunglasses": "&#x1F60E;",
	"grinning face": "&#x1F600;",
	"winking face": "&#x1F609;",
	"smiling face": "&#x263A;",
	"zebra": "&#x1F993;",
	"pig": "&#x1F437;",
	"goat": "&#x1F410;",
	"camel": "&#x1F42A;",
};

function emojifyString(originalString)
{
	var s = originalString;
	console.log("orig=" + originalString);
	
    var pattern = /\:.*\:/g;
		
	var result;
	while ( (result = pattern.exec(s)) !== null) {
		console.log("result=" + result);
		console.log('index=' + result.index);
		console.log('lastindex=' + pattern.lastIndex);

		//s = s.substring(0, result.index) + emojify(result.toString(), true) + s.substring(pattern.lastIndex);
	}

	return s;
}

function emojify(source, stripColons)
{
	console.log("emojify: |" + source + "|");
	if (stripColons) {
		source = source.slice(1, -1);
	}
	console.log("source=|" + source + "|");
	
	var result = emojifierData[source];
	console.log(result);
	if (typeof result == undefined) {
		result = source;
	}
	return result;	
}