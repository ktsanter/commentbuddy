"use strict";
var commentData;
var contextMenuId = '';

$(document).ready(function() {
  loadData(chrome.runtime.getURL("./myComments.txt"));  
});

function loadData(myURL) {
  // get file name form sync store
  console.log('load');
/*
  $.ajax({
    url: myURL,
    dataType: "text",
    success: function(data) {
      commentData = parseCommentData(data);
      showData();
    },
    error: function() {
      $("#spanError").html('<b>Error: unable to load from comment data file</b>');
    }
  });
  */
}

function showData() {
  var pclass = ' class="divPrimary" ';
  var sclass = ' class="divSecondary" ';
  var cclass = ' class="divComment" ';
  var id;
  var s = '';

  var nprimary = getNumPrimaryCategories(commentData);
  for (var i = 0; i < nprimary; i++) {
    id = ' id="' + 'primary' + i + '" ';
    s += '<div ' + pclass + id + '>';
    s += '<details>';
    s += '<summary>' + getPrimaryText(commentData, i) + '</summary>';
    
    var nsecondary = getNumSecondaryCategories(commentData, i);
    for (var j = 0; j < nsecondary; j++) {
      id = ' id="' + 'secondary' + i + '_' + j + '" ';
      s += '<div ' + sclass + id + '>';
      s += '<details>';
      s += '<summary>' + getSecondaryText(commentData, i, j) + '</summary>';
      
      var ncomments = getNumComments(commentData, i, j);
      for (var k = 0; k < ncomments; k++) {
        id = ' id="' + 'comment' + i + '_' + j + '_' + k + '" ';
        s += '<div ' + cclass + id + '>' + getCommentText(commentData, i, j, k) + '</div>';
      }
      
      s += '</details>';
      s += '</div>';
    }
    
    s += '</details>';
    s += '</div>';
  }
    
  $(".data").html(s);
  
  $(document).mousedown(function (event) {
    if (event.which == 3)
      handleMouseDown(event, 'none');
  });

  $(".divPrimary, .divSecondary, .divComment").mousedown(function (event) {
    if (event.which == 3)
      handleMouseDown(event, this.id);
  });
}

function handleMouseDown(event, id) {
  contextMenuId = id;
  if (id != 'none') {
    event.stopPropagation();
  
    chrome.contextMenus.removeAll(function() {
      chrome.contextMenus.create({
        id: "999",
        title: "Modify entry",
        contexts:["all"],
        onclick: handleContextMenuClick
      });
    });
  } else {
    chrome.contextMenus.removeAll();
  }
}

function handleContextMenuClick(info, tab) {
  console.log("modify " + contextMenuId);
  $("#" + contextMenuId).addClass('boldMe');
  $("#editText").val( $("#" + contextMenuId).html() );
  $(".divModify").removeClass('hideMe');
}
          
function handleTitleButtonClick(id) {
  console.log('control button: ' + id);
  var dispatch = {
    "btnSave": dummy,
    "btnReset": dummy
  };
  if (dispatch.hasOwnProperty(id)) {
     dispatch[id](id);
  } else {
    notHandled(id);
  }
}

function handleControlButtonClick(id) {
  console.log('title button: ' + id);
  var dispatch = {
    "btnOk": saveEntryModification,
    "btnCancel": cancelEntryModification,
    "btnUp": dummy,
    "btnDown": dummy
  };
  if (dispatch.hasOwnProperty(id)) {
     dispatch[id](id);
  } else {
    notHandled(id);
  }

}

function dummy() {
  console.log('dummy');
}
  
function saveEntryModification() {
  console.log('saveEntryModification' + contextMenuId);
  $("#" + contextMenuId).removeClass('boldMe');
  $(".divModify").addClass('hideMe');
}

function cancelEntryModification() {
  console.log('cancelEntryModification' + contextMenuId);
  $("#" + contextMenuId).removeClass('boldMe');
  $(".divModify").addClass('hideMe');
}

function notHandled(id) {
  console.log('not handled: ' + id);
}        