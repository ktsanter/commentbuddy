"use strict";

//https://unicode.org/emoji/charts/full-emoji-list.html#1f410
var emojifierData = {
	"calendar": "&amp;#x1F4C6;",
	"pencil": "&amp;#x270F;",
	"megaphone": "&amp;#x1F4E3;",
	"trophy": "&amp;#x1F3C6;",
	"rainbow": "&amp;#x1F308;",
	"stop sign": "&amp;#x1F6D1;",
	"glasses": "&amp;#x1F453;",
	"thumbs up": "&amp;#x1F44D;",
	"thumbs down": "&amp;#x1F44E;",
	"poop": "&amp;#x1F4A9;",
	"alien": "&amp;#x1F47D;",
	"frowning face": "&amp;#x2639;",
	"smiling face with sunglasses": "&amp;#x1F60E;",
	"grinning face": "&amp;#x1F600;",
	"winking face": "&amp;#x1F609;",
	"smiling face": "&amp;#x263A;",
	"zebra": "&amp;#x1F993;",
	"pig": "&amp;#x1F437;",
	"goat": "&amp;#x1F410;",
	"camel": "&amp;#x1F42A;",
	"rocket": "&amp;#x1F680;"
};

function emojifyString(originalString)
{
	var s = originalString;
	
    var pattern = /\:[^:]*\:/g;
		
	var result;
	while ( (result = pattern.exec(s)) !== null) {
		s = s.substring(0, result.index) + emojify(result.toString(), true) + s.substring(pattern.lastIndex);
	}

	return s;
}

function emojify(source, stripColons)
{
	var ename = source;
	
	if (stripColons) {
		ename = ename.slice(1, -1);
	}
	
	var result = emojifierData[ename];
	if (result == undefined) {
		result = source;
	}

	return result;	
}