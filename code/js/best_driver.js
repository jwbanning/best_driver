// Page Load
$(function() {
	
  	//font resize
  	fontResize();

  	// carousel
	$('.slides-outer').cycle({
		fx:'scrollHorz',
		timeout:12000,
		pager:'.slides-nav',
		slideExpr:'.slides-inner',
    next:'.slides_next', 
    prev:'.slides_prev',
		pause:1,
  	cleartypeNoBg:true // ie 7/8 bug
	});
	if (isTablet) $('.slides_next, .slides_prev').remove();
	$('.slides-outer').touchSwipe(swipeSlides);
	$('.slides-nav a, .slides_next, .slides_prev').click(function(){$('.slides-outer').cycle('pause');});

	//katulra
	kWidget.embed({
	    "targetId": "kaltura_player_1405460565",
	    "wid": "_1437641",
	    "uiconf_id": 14091641,
	    "flashvars": {
	      "streamerType": "auto"
	    },
	    "cache_st": 1405460565,
	    "entry_id": "1_t5joki98"
	});
});

function fontResize() {
	
	$('a.pt14').click(function() {
		$('.textSize a').removeClass('selFontSize');
		$('body').css('font-size', '54.7%');
		$(this).addClass('selFontSize');
		return false;
	});
	
	$('a.pt16').click(function() {
		$('.textSize a').removeClass('selFontSize');
		$('body').css('font-size', '62.5%');
		$(this).addClass('selFontSize');
		return false;
	});
	
	$('a.pt18').click(function() {
		$('.textSize a').removeClass('selFontSize');
		$('body').css('font-size', '70.3%');
		$(this).addClass('selFontSize');
		return false;
	});
}

function swipeSlides(dir){switch(dir){case'left':$(".slides-outer").cycle("prev");break;case'right':$(".slides-outer").cycle("next");break;}}
function setProdTabs(obj) {
	$('.prod-nav li').removeClass('on');$('.prod-container .content').hide();
	$(obj).parent().addClass('on');$('.prod-container .content:eq('+$(obj).parent().index()+')').show();
	$('.product-quote').selectBox('value', $(obj).attr('rel'));
}
function setSubTabs(obj) {
	$('.sub-nav a').removeClass('on');$('.home-agent .content').hide();
	$(obj).addClass('on');$('.home-agent .content:eq('+$(obj).parent().index()+')').show();
}