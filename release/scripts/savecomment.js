//
// TODO: add markdown for previewcomment
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
        newCommentText = _sanitizeComment(result.cbCommentText);
      }
      
      settings.fileid = fileIdString;
      settings.newcommenttext = newCommentText;

      callback();
    });
  }
  
  function _sanitizeComment(orig) {
    var sanitized = orig.replace(/[\u00A0]/g,' ');  // nbsp character
    
    return sanitized;
  }
  
  //-----------------------------------------------------------------------------
  // page rendering
  //-----------------------------------------------------------------------------  
  function _renderPage() {
    page.contents.appendChild(_renderTitle());
    if (settings.fileid == '' || settings.fileid == null) {
      _renderError('The spreadsheet file ID has not been sent for CommentBuddy yet.<br>Please use the configure option in CB to set it first.')
      
    } else {
      page.contents.appendChild(_renderContent());
      _addHandlers();
    }
  }
  
  function _renderError(msg) {
    page.contents.innerHTML = msg;    
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
    elemTable.appendChild(_renderHoverText());
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
    elemLabel.innerHTML = 'tags';
    elemCell1.appendChild(elemLabel);

    var elemVal = document.createElement('input');
    elemVal.type = 'text';
    elemVal.style.width = '100%';
    elemVal.maxlength = 200;
    elemVal.innerHTML = settings.newcommenttext;
    elemCell2.appendChild(elemVal);
    
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    page.tags = elemVal;
    
    return elemContainer;
  }
  
  function _renderHoverText() {
    var elemContainer = document.createElement('tr');   
    var elemCell1 = document.createElement('td');
    var elemCell2 = document.createElement('td');
    
    elemCell1.classList.add('label');

    var elemLabel = document.createElement('span');
    elemLabel.innerHTML = 'hover text';
    elemCell1.appendChild(elemLabel);

    var elemVal = document.createElement('input');
    elemVal.type = 'text';
    elemVal.style.width = '100%';
    elemVal.maxlength = 200;
    elemVal.innerHTML = settings.hovertext;
    elemCell2.appendChild(elemVal);
    
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    page.hovertext = elemVal;
    
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
    
    var elemVal = document.createElement('div');
    elemVal.classList.add('noneditable');
    _previewComment(elemVal, settings.newcommenttext);
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
    
    var elemButton = document.createElement('button');
    elemButton.classList.add('control-button');
    elemButton.innerHTML = 'save';
    elemButton.title = 'save comment in repository';
    elemCell1.appendChild(elemButton);
    
    var elemStatus = document.createElement('span');
    elemStatus.classList.add('status');
    elemStatus.innerHTML = '';
    elemCell2.appendChild(elemStatus);
        
    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
    
    page.savebutton = elemButton;
    page.statusmsg = elemStatus;
    
    return elemContainer;
  }
  
  function _addHandlers() {
    page.tags.addEventListener('input', _handleTagsChange, false);
    page.newcomment.addEventListener('input', _handleCommentChange, false);
    page.hovertext.addEventListener('input', _handleHoverTextChange, false);
    page.savebutton.addEventListener('click', _handleSaveClick, false);
  }

  //------------------------------------------------------------------
  // UI routines
  //------------------------------------------------------------------
  function _previewComment(elem, commentText) {
    elem.innerHTML = _markdownToHTML(commentText);
  }
  
  function _saveComment() {
    page.savebutton.disabled = true;
    _setStatusMessage('saving comment...');
    _putNewComment(settings.fileid, page.tags.value, page.newcomment.value, page.hovertext.value, _saveComplete);
  }
  
  function _saveComplete(result) {
    if (result.success) {
      console.log('save success');
      page.statusmsg.innerHTML = 'comment saved successfully';
    } else {
      console.log('save fail');
      page.statusmsg.innerHTML = 'comment save failed: ' + result.err;
    }
    page.savebutton.disabled = false;
  }
  
  function _setStatusMessage(msg) {
    page.statusmsg.innerHTML = msg;
  }
  
  function _clearStatusMessage() {
    page.statusmsg.innerHTML = '';
  }
  
  //------------------------------------------------------------------
  // handlers
  //------------------------------------------------------------------
  function _handleCommentChange(e) {
    _clearStatusMessage();
    _previewComment(page.previewcomment, e.target.value);
  }
  
  function _handleSaveClick(e) {
    _saveComment();
  }
  
  function _handleTagsChange(e) {
    _clearStatusMessage();
  }
  
  function _handleHoverTextChange(e) {
    _clearStatusMessage();
  }
  
  //------------------------------------------------------------------
  // MarkDown to HTML (alternative version with slightly less functionality)
  //------------------------------------------------------------------
  function _markdownToHTML(text) {
    var highlightspan = "<span style=\"background-color: #FFFF00\">";
    var highlightendspan = '</span>';
    
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();

    var parsed = reader.parse(text);  // tree now available for walking

    var result = writer.render(parsed);

    result = _extraMarkdownReplaceAll(result, /\^\^\^[^^]*\^\^\^/g, 3, '<sub>', '</sub>'); 
    result = _extraMarkdownReplaceAll(result, /\^\^[^^]*\^\^/g, 2, '<sup>', '</sup>'); 
    result = _extraMarkdownReplaceAll(result, /\~\~[^~]*\~\~/g, 2, '<s>', '</s>'); 
    result = _extraMarkdownReplaceAll(result, /\%\%[^%]*\%\%/g, 2, highlightspan, highlightendspan);
    
    result = result.replaceAll('&amp;amp;', '&');

    return result;
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.split(search).join(replacement);
  };

  function _extraMarkdownReplaceAll(originalString, pattern, patternlength, opentoken, closetoken)
  {
    var s = originalString;

    var result = s.match(pattern);
    if (result !== null) {
      for (var i = 0; i < result.length; i++) {
        s = s.replace(result[i], opentoken + result[i].slice(patternlength, -patternlength) + closetoken);
      }
    }

    return s;
  }
  
  //--------------------------------------------------------------
  // use Google Sheet web API to save new comment
  //--------------------------------------------------------------
  const API_BASE = 'https://script.google.com/a/mivu.org/macros/s/AKfycbzslpRyJsncJoufxogGhjSHB5bnQov_2flD3hPDryYNCHnH-VkX/exec';
  const API_KEY = 'MVcommentbuddyAPI';
  
  function _putNewComment (fileid, tags, comment, hovertext, callback) {
    //console.log('posting new comment...');

    var postData = {
      "destfileid": fileid,
      "tags": tags,
      "comment": comment,
      "hovertext": hovertext
    };
    
    fetch(_buildApiUrl('comment'), {
        method: 'post',
        contentType: 'application/x-www-form-urlencoded',
        body: JSON.stringify(postData)
      })
      .then((response) => response.json())
      .then((json) => callback({"success": true}))
      .catch((error) => {
        callback({"success": false, "err": error});
        console.log(error);
      })
  }

  function _buildApiUrl (datasetname, params) {
    let url = API_BASE;
    url += '?key=' + API_KEY;
    url += datasetname && datasetname !== null ? '&dataset=' + datasetname : '';

    for (var param in params) {
      url += '&' + param + '=' + params[param].replace(/ /g, '%20');
    }

    //console.log('buildApiUrl: url=' + url);
    
    return url;
  }
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
