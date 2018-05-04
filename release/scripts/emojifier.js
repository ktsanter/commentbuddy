"use strict";

//https://unicode.org/emoji/charts/full-emoji-list.html#1f410
var emojifierData = {
	"smiling face": "#x1F642;",
	"frowning face": "#x2639;",
	"smiling face with sunglasses": "#x1F60E;",
	"grinning face": "#x1F600;",
	"winking face": "#x1F609;",
	"thinking face": "#x1F914;",
	"relieved face": "#x1F60C;",
	"sad but relieved face": "#x1F625;",
	"grimacing face": "#x1F62C;",
	"smiling face with halo": "#x1F607;",

	"info": "#x1f6C8;",
	"warning": "#x26A0;",
	"stop sign": "#x1F6D1;",
	"prohibited": "#x1F6AB;",
	"heavy check mark": "#x2714;",
	"white heavy check mark": "#x2705;",
	"cross mark": "#x274C;",
	"cross mark button": "#x274E;",
	"question mark": "#x2753;",
	"exclamation mark": "#x2757;",
	
	"thought balloon": "#x1F4AD",
	"speech balloon": "#x1F4AC",
	
	"calendar": "#x1F4C6;",
	"pencil": "#x270F;",
	"megaphone": "#x1F4E3;",
	"stopwatch": "#x23F1;",
	"trophy": "#x1F3C6;",
	"rainbow": "#x1F308;",
	"glasses": "#x1F453;",
	"rocket": "#x1F680;",
	"eye": "#x1F441;",

	"thumbs up": "#x1F44D;",
	"thumbs down": "#x1F44E;",
	"backhand index pointing left": "#x1F448;",
	"backhand index pointing right": "#x1F449;",
	"backhand index pointing up": "#x1F446;",
	"backhand index pointing down": "#x1F447;",
	"crossed fingers": "#x1F91E;",
	"OK hand": "#x1F44C;",
	"flexed biceps": "#x1F4AA;",
		
	"poop": "#x1F4A9;",
	"alien": "#x1F47D;",
	"ghost": "#x1F47B;",
	"robot face": "#x1F916;",
	"zombie": "#x1F9DF;",
	"person running": "#x1F3C3;",
	"person fencing": "#x1F93A;",
	"person biking": "#x1F6B4;",

	"zebra": "#x1F993;",
	"pig": "#x1F437;",
	"goat": "#x1F410;",
	"camel": "#x1F42A;",
	"elephant": "#x1F418;",
	"dragon": "#x1F409;"
};

var emojifierForceEmojiData = {
	"info": "#xFE0F;",
	"warning": "#xFE0F;",
	"frowning face": "#xFE0F;"
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
	var resultForce = emojifierForceEmojiData[ename];
		
	if (result == undefined) {
		result = source;
		
	} else {
		if (forBlackBoard) {
			result = "&amp;" + result;
			if (resultForce != undefined) {
				result += "&amp;" + resultForce;
			}
			
		} else {
			result = "&" + result;
			if (resultForce != undefined) {
				result += "&" + resultForce;
			}
		}
	}

	return result;	
}

function getEmojifierReferenceList() 
{
	var emojiArray = [];
	
	for (var key in emojifierData) {
		var code = "&" + emojifierData[key];
		var force = emojifierForceEmojiData[key];
		if (force != undefined) {
			code += "&" + force;
		}
		
		emojiArray.push({"key": key, "code": code});
	}
	
	return emojiArray;
}