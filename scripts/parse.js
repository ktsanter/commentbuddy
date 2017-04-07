"use strict";
function parseCommentData(data) {
  var parsedData = [];
  var line = data.split('\n');
  var pcount = 0;
  var scount = 0;
  
  for (var i = 1; i < line.length; i++) {
    var splitline = line[i].split('\t');
      
    if (splitline[0] !== '') {
      pcount++;
      scount = 0;
      parsedData.push([splitline[0]]);
  
    } else if (splitline[1] !== '') {
      scount++;
      parsedData[pcount-1].push([splitline[1], []]);
          
    } else if (splitline[2] !== '') {
      var p = parsedData[pcount-1];
      var s = p[scount];
      var text = splitline[2];
      s[1].push(text);
    }
  }
  
  return parsedData;
}

function getNumPrimaryCategories(data) {
  return data.length;
}

function getNumSecondaryCategories(data, primaryIndex) {
  return commentData[primaryIndex].length - 1;
}

function getNumComments(data, primaryIndex, secondaryIndex) { 
  var primary = data[primaryIndex];
  var secondary = primary[secondaryIndex + 1];
  return secondary[1].length;
}

function getPrimaryText(data, primaryIndex) {
  return commentData[primaryIndex][0];
}

function getSecondaryText(data, primaryIndex, secondaryIndex) {
  var primary = data[primaryIndex];
  return primary[secondaryIndex+1][0];
}

function getCommentText(data, primaryIndex, secondaryIndex, commentIndex) {
  var primary = data[primaryIndex];
  var secondary = primary[secondaryIndex + 1];
  return secondary[1][commentIndex];
}
