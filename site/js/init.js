(function($){
  $(function(){
  	$( "h1[id], h2[id], h3[id]" ).addClass("scrollspy");
  	$("img").addClass("responsive-img");
  	$("pre, code").addClass("language-javascript");
    $('.button-collapse').sideNav();
    $('.scrollspy').scrollSpy();

  }); // end of document ready
})(jQuery); // end of jQuery name space