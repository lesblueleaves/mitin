$(document ).ready(function() {
	// var s = $("#seltag" );
 //    s.text( 'The DOM is now loaded and can be manipulated.');
  var datarole = $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]");
    var seltag = $('#seltag');
    datarole.tagsinput();
  });