define(function (require) {
  require('savecomment');
  require('create_element');
  require('markdowntohtml');
  require('standard_notice');
  require('google_webapp_interface');
  require('chromesyncstorage');
  
  document.addEventListener('DOMContentLoaded', app.init());
});