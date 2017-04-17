"use strict";

$(document).ready(function() {
  $("#files").on("change", function() {
    handleFileSelect(this.files);
  })
});

function handleFileSelect(files) {
  console.log('handleFileSelect');
  var s = "<div>";
  console.log('file handler: files.length=' + files.length);
  for (var i = 0, f; f = files[i]; i++) {
    s += 'name=' + f.name + '<br/>';
    s += ' type=' + (f.type || 'n/a') + '<br/>';
    s += ' size=' + f.size + '<br/>';
    s += ' date=' + (f.lastModifiedData ? f.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br/>';
    s += ' path=' + f.webkitRelativePath;
                
  }
  s += "</div>";
  $("#list").html(s);
}
