"use strict";

//https://unicode.org/emoji/charts/full-emoji-list.html#1f410
var emojifierData = {
	"info": "#x1f6C8;",
	"warning": "#x26A0;",
	"check": "#x2705;",
	"thought balloon": "#x1F4AD",
	"calendar": "#x1F4C6;",
	"pencil": "#x270F;",
	"megaphone": "#x1F4E3;",
	"trophy": "#x1F3C6;",
	"rainbow": "#x1F308;",
	"stop sign": "#x1F6D1;",
	"glasses": "#x1F453;",
	"thumbs up": "#x1F44D;",
	"thumbs down": "#x1F44E;",
	"poop": "#x1F4A9;",
	"alien": "#x1F47D;",
	"frowning face": "#x2639;",
	"smiling face with sunglasses": "#x1F60E;",
	"grinning face": "#x1F600;",
	"winking face": "#x1F609;",
	"smiling face": "#x1F642;",
	"zebra": "#x1F993;",
	"pig": "#x1F437;",
	"goat": "#x1F410;",
	"camel": "#x1F42A;",
	"rocket": "#x1F680;"
};

function emojifyString(originalString, forBlackBoard)
{
	var s = originalString;
	
    var pattern = /:[^:]*:/g;
	
	var result = s.match(pattern);
	if (result !== null) {
		for (var i = 0; i < result.length; i++) {
			s = s.replace(result[i], emojify(result[i], true, forBlackBoard));
		}
	}

	return s;
}

function emojify(source, stripColons, forBlackBoard)
{
	var ename = source;
	
	if (stripColons) {
		ename = ename.slice(1, -1);
	}
	
	var result = emojifierData[ename];
	if (result == undefined) {
		result = source;

		} else {
		if (forBlackBoard) {
			result = "&amp;" + result;
		} else {
			result = "&" + result;
		}
	}

	return result;	
}