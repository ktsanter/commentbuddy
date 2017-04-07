function parseCommentData(data) {
  var parsedData = [];
  var phead = 'A)';
  var shead = 'B)';
  var chead = 'C)';
  var clean = data.replace(/\t/gi, '');
  var lines = clean.split('\n');
  var pcount = 0;
  var scount = 0;
      
  for (var i = 0; i < lines.length; i++) {
    var head = lines[i].substr(0,2);
    var text = (lines[i].substr(2)).trim();
        
    if (head == phead) {
      pcount++;
      scount = 0;
      parsedData.push([text]);
  
    } else if (head == shead) {
      scount++;
      parsedData[pcount-1].push([text, []]);
          
    } else if (head == chead) {
      var p = parsedData[pcount-1];
      var s = p[scount];
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