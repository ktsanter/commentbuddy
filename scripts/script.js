"use strict";

$(document).ready(function() {
  $("#files").on("change", function() {
    handleFileSelect(this.files);
  })
  
  $("#btnUpload").click(function() {
    handleUploadClick();
  });
});

function handleFileSelect(files) {
  console.log('handleFileSelect');
  /*
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
  upload(files[0]);
  */
}

function upload(f) {
 $.ajax({
    url: f,
    dataType: "text",
    success: function(data) {
      console.log('read data...');
      upload2(data);
    },
    error: function() {
      console.log('unable to load from comment data file "' + f.name + '"');
    }
  });
}

function upload2(data) {
  $.ajax({
    url: "/commentbuddy/user/data",
    type: "POST",
    contentType: text,
    data: data,
    cache:false,
    success: function(data) {
      console.log('upload succeeded');
    },
     error: function (jqXHR,  textStatus,  errorThrown ) {
       console.log('failed to upload comment file');
       console.log(textStatus + '\n' + errorThrown);
     }
  });
}

function handleUploadClick() {
  
}