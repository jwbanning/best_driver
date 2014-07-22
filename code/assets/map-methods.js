$(document).ready(function() {

  var data ='';
  // $.getJSON('/assets/best-driver.json', function(data){
  //   data=data;
  // });

  $(function(){
    $.getJSON('/assets/best-driver.json', function(data){
      data=data;

// TABS
      $( "#tabs .tab" ).click(function(e) {
        var id = $(e.currentTarget).attr('id');
        $( "#tabs .tab" ).removeClass('selected');
        $(e.currentTarget).addClass('selected');
      });
// TABS


    });
  });
});