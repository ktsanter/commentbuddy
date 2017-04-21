"use strict";

$(document).ready(function() {
	$("#noAuth").hide();
	$("#authorized").hide();
	
  $(".btn-upload").prop('disabled', true);
  $(".file-input").prop('accept', '.tsv');

  $("#inpFile").on("change", function() {
    handleFileSelect(this.files);
  })
  
  $("#btnLogin").click(function() {
	  handleLoginButtonClick();
  });
  
  $("#btnUpload").click(function() {
    handleUploadClick();
  });
  
  checkIfAuthorized();
});

function checkIfAuthorized() {
	$.ajax({
		url: "/auth/query",
		dataType: 'text',
		success: function(data) {
			if (data == 'YES') {
				$("#authorized").show();
			} else {
				$("#noAuth").show();
			}
		},
		error: function (error) {
			console.log('auth check failed ' + eval(error));
		}
	});
}

function handleLoginButtonClick() {
  window.location.replace("https://ktsanter.duckdns.org/auth/in");
}

function handleFileSelect(files) {
  var input = $("#inpFile")[0].files;

  $(".btn-upload").prop('disabled', !input.hasOwnProperty('0'));
  $("#uploadResult").html('');
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
      $(".btn-upload").prop('disabled', true);
    },
    error: function (error) {
      $("#uploadResult").html('upload failed');
    }
  });
}