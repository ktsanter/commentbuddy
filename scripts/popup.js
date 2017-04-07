"use strict";
var commentData;
var selectIndex = {
  "primary": 0,
  "secondary": 0,
  "comment": 0
};

$(document).ready(function() {
  // get file name from sync store
  loadData(chrome.runtime.getURL("commentbuddy.tsv"));
    
  $("#selPrimary").change(function() {
     handlePrimaryChange();
  });

  $("#selSecondary").change(function() {
     handleSecondaryChange();
  });

  $("#selComment").change(function() {
     handleCommentChange();
  });
});


function loadData(myURL) {
  $.ajax({
    url: myURL,
    dataType: "text",
    success: function(data) {
      commentData = parseCommentData(data);
      chrome.storage.sync.get(['primaryIndex', 'secondaryIndex', 'commentIndex'], function(items) {
        selectIndex.primary = 0;
        selectIndex.secondary = 0;
        selectIndex.comment = 0;

        if (typeof items.primaryIndex != 'undefined') {
          selectIndex.primary = items.primaryIndex;
          selectIndex.secondary = items.secondaryIndex;
          selectIndex.comment = items.commentIndex;
        }
        console.log('A');
        console.log(selectIndex.primary + ' ' + selectIndex.secondary + ' ' + selectIndex.comment);
        if (selectIndex.primary >= getNumPrimaryCategories(commentData)) {
            selectIndex.primary = 0;
            selectIndex.secondary = 0;
            selectIndex.comment = 0
        }
        console.log('B');
        console.log(selectIndex.primary + ' ' + selectIndex.secondary + ' ' + selectIndex.comment);
        if (selectIndex.secondary >= getNumSecondaryCategories(commentData, selectIndex.primary)) {
          selectIndex.secondary = 0;
          selectIndex.comment = 0
        }
        console.log('C');
        console.log(selectIndex.primary + ' ' + selectIndex.secondary + ' ' + selectIndex.comment);
        if (selectIndex.comment >= getNumComments(commentData, selectIndex.primary, selectIndex.secondary)) {
          selectIndex.comment = 0
        }
        console.log('D');
        console.log(selectIndex.primary + ' ' + selectIndex.secondary + ' ' + selectIndex.comment);
        
        saveSelectIndices();

        loadPrimary();
        loadSecondary();
        loadComment();
        handleCommentChange();
      });
    },
    error: function() {
      $("#spanError").html('<b>Error: unable to load from comment data file: ' + myURL + '</b>');
    }
  });
}

function saveSelectIndices() {
  chrome.storage.sync.set(
    {
      "primaryIndex": selectIndex.primary, 
      "secondaryIndex": selectIndex.secondary,
      "commentIndex": selectIndex.comment
    }, 
    function() {}
  );
}

function loadPrimary() {
  var s = '';
  var n = getNumPrimaryCategories(commentData);

  for (var i = 0; i < n; i++) {
    var text = getPrimaryText(commentData, i);
    var fmt = "00" + i;
    var num = fmt.substr(fmt.length-3);
    var value = 'value="' + num + '" ';
    var id = 'id="' + 'optPrimary' + num + '" ';
    var selected = ' ';
    if (i == selectIndex.primary)
      selected = ' selected ';

    s += '<option ' + value + id + selected + '>' + text + '</option>';
  }

  $("#selPrimary").html(s);
}

function loadSecondary() {
  var s = '';
  var n = getNumSecondaryCategories(commentData, selectIndex.primary);

  for (var i = 0; i < n; i++) {
    var text = getSecondaryText(commentData, selectIndex.primary, i);
    var fmt = "00" + i;
    var num = fmt.substr(fmt.length-3);
    var value = 'value="' + num + '" ';
    var id = 'id="' + 'optSecondary' + num + '" ';
    var selected = ' ';
    if (i == selectIndex.secondary)
      selected = ' selected ';

    s += '<option ' + value + id + selected + '>' + text + '</option>';
  }

  $("#selSecondary").html(s);
}

function loadComment() {
  var s = '';
  var n = getNumComments(commentData, selectIndex.primary, selectIndex.secondary);

  for (var i = 0; i < n; i++) {
    var text = getCommentText(commentData, selectIndex.primary, selectIndex.secondary, i);

    var fmt = "00" + i;
    var num = fmt.substr(fmt.length-3);
    var value = 'value="' + num + '" ';
    var selected = ' ';
    if (i == selectIndex.comment)
      selected = ' selected ';    
    var id = 'id="' + 'optComment' + num + '" ';

    s += '<option ' + value + id + selected + '>' + text + '</option>';
  }

  $("#selComment").attr("size", 20);
  $("#selComment").html(s);
}

function handlePrimaryChange() {
  selectIndex.primary = parseInt(currentOption('selPrimary'));
  selectIndex.secondary = 0;
  selectIndex.comment = 0;
  saveSelectIndices();
  loadSecondary();
  loadComment();
}

function handleSecondaryChange() {
  var primaryIndex = parseInt(currentOption('selPrimary'));
  selectIndex.secondary = parseInt(currentOption('selSecondary'));
  selectIndex.comment = 0;
  saveSelectIndices();
  loadComment();
}

function handleCommentChange() {
  var option = currentOption('selComment');
  selectIndex.comment = parseInt(option);
  saveSelectIndices();

  copyTextToClipboard($("#optComment" + option).html());
}

function currentOption(id) {
  return $('#'+id).find('option:selected').val();
}

function copyTextToClipboard(text) {
  var copyFrom = document.createElement("textarea");
  var cleantext = text.replace(/\|/gi, '\n');
  copyFrom.textContent = cleantext;
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}
