//
// TODO: add MarkDown quick reference link or popup
//

const app = function () {
  const PAGE_TITLE = 'Store new entry in CommentBuddy repository';
  
  const UP_ARROW = '&#9650;'; //'&#11181;';
  const DOWN_ARROW = '&#9660;'; //'&#11183;';
  
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
    elemLabel.title = 'file ID for Google Sheet use to store comment data';
    elemCell1.appendChild(elemLabel);
    
    var elemLink = document.createElement('a');
    elemLink.href = 'https://drive.google.com/open?id=' + settings.fileid;
    elemLink.target = '_blank';
    elemLink.title = 'open comment repository spreadsheet';
    elemLink.innerHTML = settings.fileid;
    elemCell2.appendChild(elemLink);
    
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
    elemLabel.title = 'one or more tags for looking up comment - use no spaces in tag names and commas to separate them';
    elemCell1.appendChild(elemLabel);

    var elemVal = document.createElement('input');
    elemVal.type = 'text'
    elemVal.classList.add('user-input');
    elemVal.style.width = '100%';
    elemVal.maxlength = 200;
    elemVal.placeholder = 'tag1, tag2, ...';
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
    elemLabel.title = 'hover text displayed when selecting in CommentBuddy';
    elemCell1.appendChild(elemLabel);

    var elemVal = document.createElement('input');
    elemVal.type = 'text';
    elemVal.classList.add('user-input');
    elemVal.style.width = '100%';
    elemVal.maxlength = 200;
    elemVal.placeholder = 'optional hover text...';
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
    elemLabel.title = 'text for new comment (before formatting)';
    elemCell1.appendChild(elemLabel);

    var elemButton = document.createElement('button');
    elemButton.classList.add('control-button');
    elemButton.classList.add('control-button-small');
    elemButton.innerHTML =  DOWN_ARROW;
    elemButton.title = 'show formatting reference info';
    elemCell1.appendChild(elemButton);
    
    var elemVal = document.createElement('textarea');
    elemVal.rows = 14;
    elemVal.cols = 80;
    elemVal.innerHTML = settings.newcommenttext;
    elemCell2.appendChild(elemVal);
    
    var elemMarkdownReference = _renderMarkdownReference();
    elemCell2.appendChild(elemMarkdownReference);

    elemContainer.appendChild(elemCell1);
    elemContainer.appendChild(elemCell2);
        
    page.mdrefbutton = elemButton;
    page.markdownreference = elemMarkdownReference;
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
    elemLabel.title = 'comment after formatting';
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
  
  function _renderMarkdownReference() {
    var markdownItems = [
      '*italics*',
      '**bold**',
      '%%highlight%%',
      '~~strikethrough~~',
      'superscript: x^^2^^',
      'subscript: x^^^i^^^',
      '-first item<br>-second item'
    ];
    var elemContainer = document.createElement('div');
    
    elemContainer.classList.add('reference');
    elemContainer.classList.add('hide-me');
    
    var elemTable = document.createElement('table');
    elemTable.classList.add('table-borders');
    
    var elemHeaderRow = document.createElement('tr');
    var elemHeaderCell1 = document.createElement('th');
    var elemHeaderCell2 = document.createElement('th');
    elemHeaderCell1.classList.add('table-borders');
    elemHeaderCell2.classList.add('table-borders');
    elemHeaderCell1.innerHTML = 'unformatted';
    elemHeaderCell2.innerHTML = 'formatted';
    elemHeaderRow.appendChild(elemHeaderCell1);
    elemHeaderRow.appendChild(elemHeaderCell2);
    elemTable.appendChild(elemHeaderRow);
    
    for (var i = 0; i < markdownItems.length; i++) {
      elemTable.appendChild(_renderMarkdownReferenceItem(markdownItems[i]));
    }
    elemContainer.appendChild(elemTable);
    
    return elemContainer;
  }
  
  function _renderMarkdownReferenceItem(unformatted) {
    var elemRow = document.createElement('tr');
    var elemUnformatted = document.createElement('td');
    var elemFormatted = document.createElement('td');
    
    elemUnformatted.classList.add('table-borders');
    elemFormatted.classList.add('table-borders');
    
    elemUnformatted.innerHTML = unformatted;
    elemFormatted.innerHTML = _markdownToHTML(unformatted);
    
    elemRow.appendChild(elemUnformatted);
    elemRow.appendChild(elemFormatted);
    
    return elemRow;
  }
  
  function _addHandlers() {
    page.tags.addEventListener('input', _handleTagsChange, false);
    page.newcomment.addEventListener('input', _handleCommentChange, false);
    page.mdrefbutton.addEventListener('click', _handleMarkdownRefClick, false);
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
  
  function _toggleMarkdownRefVisibility() {
    var elem = page.markdownreference;
    
    if (elem.classList.contains('hide-me')) {
      elem.classList.remove('hide-me');
      elem.classList.add('show-me');
      page.mdrefbutton.innerHTML = UP_ARROW;
      page.mdrefbutton.title = 'hide formatting reference info';
      
    } else if (elem.classList.contains('show-me')) {
      elem.classList.remove('show-me');
      elem.classList.add('hide-me');
      page.mdrefbutton.innerHTML = DOWN_ARROW;
      page.mdrefbutton.title = 'show formatting reference info';
    }
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
  
  function _handleMarkdownRefClick(e) {
    _toggleMarkdownRefVisibility();
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
