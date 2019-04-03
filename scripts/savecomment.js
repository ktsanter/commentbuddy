//
//

const app = function () {
  const PAGE_TITLE = 'Store new entry in CommentBuddy repository';
  const page = {};
  
  const settings = {};
  
  //---------------------------------------
  // get things going
  //----------------------------------------
  function init () {
    page.body = document.getElementsByTagName('body')[0];
    page.contents = document.getElementById('contents');    
    
    _retrieveSettings(_renderPage);
  }
  
  function _retrieveSettings(callback)
  {
    chrome.storage.sync.get(['cbSpreadsheetFileId', 'cbCommentText'], function(result) {
      var fileIdString = '';
      var newCommentText = '';

      if (typeof result.cbSpreadsheetFileId != 'undefined') {
        fileIdString = result.cbSpreadsheetFileId;
      }
      if (typeof result.cbCommentText != 'undefined') {
        newCommentText = result.cbCommentText;
      }
      
      settings.fileid = fileIdString;
      settings.newcommenttext = newCommentText;

      callback();
    });
  }
  
  //-----------------------------------------------------------------------------
  // page rendering
  //-----------------------------------------------------------------------------  
  function _renderPage() {
    page.contents.appendChild(_renderTitle());
    page.contents.appendChild(_renderContent());
  }
  
  function _renderTitle() {
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('title');
    elemContainer.innerHTML = PAGE_TITLE;
    
    return elemContainer;
  }
    
  function _renderContent() {
    var elemContainer = document.createElement('div');
    
    var elemTable = document.createElement('table');
    elemTable.appendChild(_renderFileId());
    elemTable.appendChild(_renderTags());
    elemTable.appendChild(_renderNewComment());
    elemTable.appendChild(_renderCommentPreview());
    elemTable.appendChild(_renderControls());
    
    elemContainer.appendChild(elemTable);
    return elemContainer;
  }
  
  function _renderFileId() {
    var elemContainer = document.createElement('tr');   
    var elemCell1 = document.createElement('td');
    var elemCell2 = document.createElement('td');
    
    elemCell1.classList.add('label');
    
    var elemLabel = document.createElement('span');
    elemLabel.innerHTML = 'spreadsheet ID ';
    elemCell1.appendChild(elemLabel);
    
    var elemVal = document.createElement('span');
    elemVal.classList.add('noneditable');
    elemVal.innerHTML = settings.fileid;
    elemCell2.appendChild(elemVal);
    
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    return elemContainer;
  }
  
  function _renderTags() {
    var elemContainer = document.createElement('tr');   
    var elemCell1 = document.createElement('td');
    var elemCell2 = document.createElement('td');
    
    elemCell1.classList.add('label');

    var elemLabel = document.createElement('span');
    elemLabel.innerHTML = 'tags ';
    elemCell1.appendChild(elemLabel);

    var elemVal = document.createElement('input');
    elemVal.type = 'text';
    elemVal.maxlength = 200;
    elemVal.innerHTML = settings.newcommenttext;
    elemCell2.appendChild(elemVal);
    
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    page.tags = elemVal;
    
    return elemContainer;
  }
  
  function _renderNewComment() {
    var elemContainer = document.createElement('tr');   
    var elemCell1 = document.createElement('td');
    var elemCell2 = document.createElement('td');

    elemCell1.classList.add('label');

    var elemLabel = document.createElement('span');
    var elemLabel = document.createElement('span');
    elemLabel.innerHTML = 'new comment ';
    elemCell1.appendChild(elemLabel);
    
    var elemVal = document.createElement('textarea');
    elemVal.rows = 14;
    elemVal.cols = 80;
    elemVal.innerHTML = settings.newcommenttext;
    elemCell2.appendChild(elemVal);
    
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    page.newcomment = elemVal;
    
    return elemContainer;
  }

  function _renderCommentPreview() {
    var elemContainer = document.createElement('tr');   
    var elemCell1 = document.createElement('td');
    var elemCell2 = document.createElement('td');

    elemCell1.classList.add('label');

    var elemLabel = document.createElement('span');
    var elemLabel = document.createElement('span');
    elemLabel.innerHTML = 'preview ';
    elemCell1.appendChild(elemLabel);
    
    var elemVal = document.createElement('textarea');
    elemVal.classList.add('noneditable');
    elemVal.rows = 14;
    elemVal.cols = 80;
    elemVal.maxlength = 2048;
    elemVal.innerHTML = 'preview this: ' + settings.newcommenttext;
    elemCell2.appendChild(elemVal);
    
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    page.previewcomment = elemVal;
    
    return elemContainer;
  }
  
  function _renderControls() {
    var elemContainer = document.createElement('tr');
    
    var elemCell1 = document.createElement('td');
    var elemCell2 = document.createElement('td');
        
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    return elemContainer;
  }

  //------------------------------------------------------------------
  // handlers
  //------------------------------------------------------------------

  //---------------------------------------
  // utility functions
  //----------------------------------------

  //---------------------------------------
  // return from init
  //----------------------------------------
  return {
    init: init
   };
}();

document.addEventListener('DOMContentLoaded', app.init());
