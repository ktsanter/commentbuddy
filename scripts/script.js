"use strict";

$(document).ready(function() {
  $("#btnUpdate").prop("disabled", true);
  $("#files").on("change", function() {
    handleFileSelect(this.files);
  })
  
  $("#btnUpload").click(function() {
    handleUploadClick();
  });
});

function handleFileSelect(files) {
  console.log('handleFileSelect');
  //if a file is selected
  $("#btnUpdate").prop("disabled", false);
  $("#uploadResult").html();
  
}

function handleUploadClick() {
  var form = $("#myForm");
  var formdata = false;
  if (window.FormData){
    formdata = new FormData(form[0]);
  }

  $.ajax({
    url         : '/commentbuddy/user/data',
    data        : formdata ? formdata : form.serialize(),
    cache       : false,
    contentType : false,
    processData : false,
    type        : 'POST',
    success     : function(data, textStatus, jqXHR){
      $("#uploadResult").html('upload succeeded');;
      $("#btnUpdate").prop("disabled", true);
    },
    error: function (error) {
      $("#uploadResult").html('upload failed');
    }
  });
}