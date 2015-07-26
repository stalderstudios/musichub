$(function() {
  "use strict";

  var $pagebanner = $('.page-banner');
  if ($pagebanner.length) {
    if ($( window ).height() > $('.page-banner').height()) {
      var height = ($( window ).height() < 1000 ? $(window).height() : 1000);
      $('.page-banner').height(height);
      $('.page-banner-container').addClass('vertical-center');
    }
  }

  var $artists = $('.artists .artist');
  if ($artists.length) {
    $artists.click(function(event) {
      var href = $(this).find('a').prop('href');
      window.location = href;
    });
  }

});