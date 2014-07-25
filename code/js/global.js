var pgName = location.pathname.substring(location.pathname.lastIndexOf('/')+1);
var errMessage = '<div class="errMsg">Oops! You have entered an invalid ZIP. Please, try again.</div>';
var zipCode = '95661'; /* For client review only to show a default location zip code */

// Functions
var zipRegex = /^\d{5}$/;
/*! A fix for the iOS orientationchange zoom bug. Script by @scottjehl, rebound by @wilto.MIT / GPLv2 License.*/
(function(a){function m(){d.setAttribute("content",g),h=!0}function n(){d.setAttribute("content",f),h=!1}function o(b){l=b.accelerationIncludingGravity,i=Math.abs(l.x),j=Math.abs(l.y),k=Math.abs(l.z),(!a.orientation||a.orientation===180)&&(i>7||(k>6&&j<8||k<8&&j>6)&&i>5)?h&&n():h||m()}var b=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-5]_[0-9_]* like Mac OS X/i.test(b)&&b.indexOf("AppleWebKit")>-1))return;var c=a.document;if(!c.querySelector)return;var d=c.querySelector("meta[name=viewport]"),e=d&&d.getAttribute("content"),f=e+",maximum-scale=1",g=e+",maximum-scale=10",h=!0,i,j,k,l;if(!d)return;a.addEventListener("orientationchange",m,!1),a.addEventListener("devicemotion",o,!1)})(this);
/* Fix older IE console.log to prevent errors */
if (!window.console){
    (function(){
      var names = ["log", "info", "warn", "error",
          "assert", "dir", "dirxml", "group", "groupEnd", "time",
          "timeEnd", "count", "trace", "profile", "profileEnd"],
          i, l = names.length;

      window.console = {};

      for ( i = 0; i < l; i++ ){
        window.console[names[i]] = function(){};
      }
    }());
};
function numbersOnly(myfield, e) {
  var key; var keychar;
  if (window.event) { key = window.event.keyCode; } else if (e) { key = e.which; } else { return true; }
  keychar = String.fromCharCode(key);
  // control keys// control keys
  if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27)) { return true; }
  // numbers
  else if ((("0123456789").indexOf(keychar) > -1)) {  return true; }
  else { return false; }
}

// Search Form
function submitSearch() {
	var keywords=$.trim($('.keywords').val());
	
	if(keywords!='')window.location='//search.allstate.com/?q='+encodeURIComponent(keywords);
}
$("input.keywords").keypress(function(e) {
  if(e.which==13){
		e.preventDefault();
		submitSearch();
  }
});
$('.search input').focus(function() {
    $(this).parent().addClass('active');
});
$('.search input').blur(function() {
   $(this).next().attr('style','');
   $(this).parent().removeClass('active');
});
$('.topnavInner .search a').click(function(e) {
	e.preventDefault();
	submitSearch();
});

// Global Variables	
var insUpTotal = 0; var insLowTotal = 0; var claimsTotal = 0; var supportTotal = 0; var resourcesTotal = 0; var acctTotal = 0; var tNavLimit = 0;
var navOpenCount;

var claimsWidth = $('.nClaims').width();
var supportWidth = $('.nSupport').width();
var resourcesWidth = $('.nResources').width();
var headerHeight = $('.header').height()+5;
var winWidth = $(window).width();
var winHeight = $(window).height();
var narrowWindow = false;
var wideWindow = false;
var shortWindow = false;
var icons = (decodeURIComponent(getURLParam('icons')) === "false") ? false : true;

// remove icons, readjust header height
if (!icons) {
	$('.header').removeClass('icons');
	headerHeight = $('.header').height();
}

if(winWidth >= 1280) {
   wideWindow = true;
}else if( winWidth < 960) {
   narrowWindow = true;
}

if(winHeight <= 500) {
   shortWindow = true;  
}

// Page Load
$(function() {
	$('.ie7 .header').after('<div class="clear"></div>');
	
	browserDetect();
	detectOrientation();
	$('a[href][rel=external]').attr('target','_blank');
	
	// initialize tertiary nav after content has loaded
	if ($('.tNavShell').length > 0) {
		
		headerHeight = $('.header').height();
		mainOffset = $('.tNavMain').offset().top; // Get Offset for the 'main' div
		headerOffset = $('.header').height(); // Get the height of the 'header' div
		footerOffset = $('.bottomWrapper').offset().top; // Get the offset of the 'bottomWrapper' div
		
		set_tNavHeight();
		updateContentHeight();
		set_tNavFtrTrigger();
		tertiaryNav();
	}
	
	swapContent();
	calcSubNav();
	centerNav();
	
	navClick();
	agentCarousel('prospectDrawer');
	
	quoteBox();
	zipCookie();/* Currently only used for development purposes. To be replaced by functional zip location detection. */
	checkZip();
	
	$(window).bind('resize', centerNav);
		
	$(window).scroll(); // force firefox to fire onload
	if (!isTablet) $(".drawerOuter").css("bottom","-" + drawerOptions.height + "px");

	$('.modalZipCode').jqm({
	   modal: true, /* FORCE FOCUS */
	   onShow: function(h) {
			/* callback executed when a trigger click. Show modal */
			h.w.css('display','block');/* show() animates the size, fadeIn() causes background display issues in older IE due to transparent PNGs */
			h.w.addClass('modalOpen');
		},
		onHide: function(h) {
        	/* callback executed on window hide. Hide modal, overlay. */
        	h.w.css('display','none').hide(function() { if(h.o) h.o.remove(); });
        	h.w.removeClass('modalOpen');
		} 
	}); 
	
	var protocol = window.location.protocol;
	var iframeClone;
	var t = $('.modalContentVid');	
	
	$('#ytVideo').attr("src", ""); // Init the Video src on load. Clicking Forward in browser would launch the previous video state.
	// Resize video for lower resolutions
	if ($(window).height() < 500) {
		$('.jqmWindow').addClass('jqmLowRes');
		$('#ytVideo').height(394);
		$('#ytVideo').width(700);
	}
	$('.modalVidPlayer').jqm({
	   trigger: '.vidTrigger',		
	   target: t,
	   overlayClass: 'jqmVidOverlay',
	   modal: true, /* FORCE FOCUS */
	   onShow: function(h) {
	   		/* have to remove iframe on close so let's clone it */
	   		if (iframeClone == undefined)
	   			iframeClone = $('#ytVideo').clone();
	   		else 
	   			$(t).children('.vidContainer').append(iframeClone)
	   		/* grab the YT video id through property name and appending src to iframe code */
			$('#ytVideo').attr('src', protocol + '//www.youtube.com/embed/' + h.t.name.split("|")[0] + '?autoplay=1&controls=2&autohide=0&rel=0&enablejsapi=1');
			$(t).children('.vidTitle').html(h.t.name.split("|")[1]);
			/* callback executed when a trigger click. Show modal */
			h.w.css('display','block');/* show() animates the size, fadeIn() causes background display issues in older IE due to transparent PNGs */
			h.w.addClass('modalOpen');
		},
		onHide: function(h) {        	
			/* Empty out the YT src and remove before hhiding the modal - IE bug*/
        	$('#ytVideo').attr("src", "");
        	$('#ytVideo').remove();
        	$(t).children('.vidTitle').html('');
        	/* callback executed on window hide. Hide modal, overlay. */
        	h.w.css('display','none').hide(function() { if(h.o) h.o.remove(); });
        	h.w.removeClass('modalOpen');
		} 
	}); // needs to be last	
});

function iframeSwap(){
	var original = $('#ytVideo');
    var newFrame = document.createElement("iframe");
    newFrame.src = urls.pop();
    var parent = original.parentNode;
    parent.replaceChild(newFrame, original);
}

var isIE10 = false;var isIE11 = false;var isIE9 = false;var isIE78 = false;var isIE7 = false;var isChrome = false;var isSafari = false;var isFF = false;var isTablet = false;var isKindle = false;var isPlayBook = false;

function browserDetect() {
   /* used for minor display diffrences such as font rendering widths */   
   if(navigator.userAgent.match(/MSIE\s([\d.]+)/) != null) {
   	isIE10 = true;
   	$('body').addClass('ie10');
   };
    
   if(navigator.userAgent.match(/Android/) || navigator.userAgent.match(/iPad/) || navigator.userAgent.match(/Silk/) || navigator.userAgent.match(/PlayBook/)){      
      isTablet = true;
      $('body').addClass('tablet');
      
      if(navigator.userAgent.match(/Silk/)){
         /* Silk is Kindle Fire Browser */
         $('body').addClass('silk');
      };
      
      if(navigator.userAgent.match(/PlayBook/)){
         /* Silk is Kindle Fire Browser */
         $('body').addClass('bb');
      };      
   }else{
      /* Site should only show up for Tablets. */
   }
   
   if(navigator.userAgent.match(/Safari/)){
      if(navigator.userAgent.match(/Chrome/)){
        $('body').addClass('safari chrome');
      }else if(navigator.userAgent.match(/iPad/)){
         $('body').addClass('safari ios ipad');
      }else{
         $('body').addClass('safari');
      }
   }else if(navigator.userAgent.match(/Firefox/)){
      $('body').addClass('firefox');
   };
   
   isIE9 = $("div").hasClass("ie9")?true:false;
   isIE78 = $("div").hasClass("ie8")?true:false;
   isIE7 = $("div").hasClass("ie7")?true:false;
   isChrome = $("body").hasClass("chrome")?true:false;
   isSafari = $("body").hasClass("safari")?true:false;
   isFF = $("body").hasClass("firefox")?true:false;
   isKindle = $("body").hasClass("silk")?true:false;
   isPlayBook = $("body").hasClass("bb")?true:false;
}

function detectOrientation() {
   if(typeof window.onorientationchange !== 'undefined'){      
      switch(orientation){
         case 0:
         case 180:
            /* Do Something In Portrait Mode */
            $('body').removeClass('land');
            $('body').addClass('port');
            break;
         case 90:
         case -90:
            /* Do Something In Landscape Mode */
            $('body').removeClass('port');			 
            $('body').addClass('land');
            break;
         default:
            /* Do Nothing */
            break;  
      }
      
      /* Silly Android Honeycomb and BlackBerry Playbook have landscape and portrait backwards... */
      var ua = navigator.userAgent.toLowerCase();
      
      if(ua.indexOf('android 3')> -1 || ua.indexOf('playbook')> -1){
         switch(orientation){
            case 0:
            case 180:
               /* Do Something In Landscape Mode */
               $('body').removeClass('port');			 
               $('body').addClass('land');
               break;
            case 90:
            case -90:
            /* Do Something In Portrait Mode */
               $('body').removeClass('land');
               $('body').addClass('port');
               
               break;
            default:
               /* Do Nothing */
               break;  
            } 
      };
   };
}

// drawer
var drawerOptions;

drawerOptions = {
   height: 310,
   tabHeight: 58
}  

$('.bottomWrapper').css('height',($('.footer').height() + drawerOptions.height) + 8);
   
$(".drawerTab a").click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	closeNav();
	
	if ($(".drawerOuter").hasClass('fixed')) {
	   /* drawer is still locked to bottom of screen rather than visible via scrolling */
		if ($(".drawerOuter").hasClass('open')) {
		   /* drawer is open, close it */
			$(".drawerOuter").removeClass('open').animate({bottom:'-='+drawerOptions.height});
		} else {
		   /* drawer is closed, open it */
			$('.quoteHead').removeClass('show');	
			$(".drawerOuter").addClass('open').animate({bottom:'+='+drawerOptions.height});
		}		
	};
	
	if(!$('.drawerOuter').hasClass('open')){
	  $('.quoteDrawer').removeClass('show');
	};
});

/* Fix tabbing issue to see links in footer if drawer it closed (forces it open) */
$('.drawerLoc a.zipEdit').bind('focus', function() {
	if ($(".drawerOuter").hasClass('fixed')) {
		if ($(".drawerOuter").hasClass('open')) {
		   /* don't do anything because it needs to stay open to see the tabbing through for accessibility */
		} else {
		   /* drawer is closed, open it */
			$('.quoteHead').removeClass('show');	
			$(".drawerOuter").addClass('open').animate({bottom:'+='+drawerOptions.height});
		}		
	};
});


$(window).bind('scroll', function() {
	setTimeout(function(){      
		if($(window).scrollTop() == 1 && !narrowWindow){
			/* After scrolling back to top of page, reset drawer so clicking the tab opens it */
			$(".drawerOuter").removeClass('relative').addClass('fixed');
			$(".drawerOuter").css("bottom","-" + drawerOptions.height + "px");
		};
	},500); 
}); 
	 
$(window).scroll(function() {
	if (($(window).scrollTop()>0) && (isTablet==false)){
	    closeAll(); // used for page reload
	};
	
	if ($(".drawerOuter").hasClass('fixed') && !narrowWindow) {
		if ($(".drawerOuter").hasClass('open')) {
		   /* drawer is open, close on scroll */
			$(".drawerOuter").removeClass('open');
			$('.drawerOuter').animate({bottom:'-=' + drawerOptions.height});
		};
	};
	
	if($(window).scrollTop() + $(window).height() > $(document).height() - ($('.bottomWrapper').height() - drawerOptions.tabHeight) && !narrowWindow) {
	   /* window scrolled to bottom of main content, drawer should become static so it shows above footer */
		if ($(".drawerOuter").hasClass('fixed')) {
		   /* if currently fixed, change to static */
			$(".drawerOuter").removeClass('fixed').addClass("static").attr("style","");
		};
	} else {
		if (isTablet) return;
	   /*window has not scrolled to bottom yet */
		if (!$(".drawerOuter").hasClass('fixed')) {
		   /* if it does not have fixed, add it */
			$(".drawerOuter").removeClass('static').addClass('fixed').css("bottom","-" + drawerOptions.height + "px");
		};
	}
	
	if(narrowWindow){
	   /* If narrower than 960px, do not use fixed positioning as the browser window cannot horizontally scroll to show content that is clipped. */
	   $(".drawerOuter").removeClass('fixed');
	   $(".header").css("position","absolute");
	};
	
	if(wideWindow){
	   $('.drawerInner').addClass('wide');
	};
	
	if(shortWindow){
	   $(".drawerOuter").removeClass('fixed');
	   $(".header").css("position","absolute");
	}
	
	// tertiary nav
	if ($('.tNavShell').length > 0 && !isTablet) {
		scrollTop = $(window).scrollTop();
				
		// Handle moving div up when at the top of the page
		if (scrollTop <= mainOffset - headerOffset  && $('.tNav').hasClass('fixed')) {
			$('.tNav').removeClass('fixed');
			$('.tNav').css('top', 0);
		// Handle moving div up when the footer is visible
		} else if (scrollTop >= tNavFtrTrigger) {
			topVal = footerOffset - mainOffset - tNavHeight - 100;
			$('.tNav').removeClass('fixed');
			$('.tNav').css('top', topVal  + "px");
		// Handle keeping the div in one spot during most of the scroll			
		} else if (scrollTop > mainOffset - headerOffset){
			$('.tNav').addClass('fixed');
			$('.tNav').css('top', headerOffset);	
		}
	}	
});

// Only needed when tNav is present
var mainOffset, headerOffset, footerOffset;

// Set 'tNav' height variable
var tNavHeight, prev_tNavHeight;
function set_tNavHeight(){
	prev_tNavHeight = tNavHeight;
 	tNavHeight = $('.tNav').height();
}

// Set 'tNav' lower footer position variable
var tNavFtrTrigger;
function set_tNavFtrTrigger(){
 	tNavFtrTrigger = footerOffset - headerHeight - tNavHeight - 100;
}

function updateContentHeight(){
	var currHeight = $("#content").height();
	var difference = tNavHeight - prev_tNavHeight;
	
	if (isNaN(difference) && isIE78) { difference = 0; }
	$('#content').animate({ height : currHeight + difference }, 300, function () {
		footerOffset = $('.bottomWrapper').offset().top;
		set_tNavFtrTrigger();
	});
}

function tertiaryNav() {
	$('.subMenuTog').click(function(e) {
		e.preventDefault();
		var theObj = $(this);
		if (theObj.parent().hasClass('expanded')) {
			theObj.next().slideUp(function() {
				theObj.parent().removeClass('expanded');
				theObj.text('expand');
				set_tNavHeight();
				set_tNavFtrTrigger();
				updateContentHeight();
			});
		} else {
			$('.accordion li[class="expanded"] ul').not(theObj).slideUp(function(){
				$(this).parent().children('a:eq(1)').text('expand');
				$(this).parent().removeClass('expanded');
			});
			theObj.parent().addClass('expanded');
			theObj.text('collapse');
			theObj.next().slideDown(function() {
				set_tNavHeight();
				set_tNavFtrTrigger();
				updateContentHeight();
			});
		}
	});
}

/* if anything is clicked, go directly to the first child of the subnav since the nav itself does not go to a page */    

var insSubnavHeight = ($(".insUpper").height() + $(".insLower").height());
var insNavAdjust = function(){$("#content").css('margin-top',(insSubnavHeight+20)+'px')};
var closeAdjust = function(){$("#content").css('margin-top',(headerHeight)+'px')};
var acctAdjust = function(){$("#content").css('margin-top',(headerHeight+72)+'px')}; 
var navMenu = "nInsurance";

var getNav = function(){
   switch(navMenu){
      case 'nInsurance':            
         if(navOpenCount == 0)insNavAdjust();
         else closeAdjust();
         /* Show Insurance & More nav */
				 if ($('.header').hasClass('icons')) {
         	$('.header').attr('class','header nInsuranceOn icons');/* remove all class names except header, nInsuranceOn & icons */
				 } else {
         	$('.header').attr('class','header nInsuranceOn');/* remove all class names except header & nInsuranceOn */
				 }
         
         $(".mainnav .topLvl,.mainnav .topLvl a").removeClass("on").removeClass("next");
         $(".nInsurance,.nInsurance a:first").addClass("on");
         $('.nInsurance').next().children("a:first").addClass("next");
         
         $('.header').append('<div class="pline" style="position:absolute;top:112px;width:100%;height:1px;background-color:#d4d8dc;"></div>');
         
         $('.insUpper li:last').addClass('last');
         $('.insLower li:first').addClass('first');
         
         if(isIE7){
            $('.pline').css('z-index','-1');
         };
         break;
      case 'nClaims':
         closeAdjust();
         /* Show Claims nav */
					if ($('.header').hasClass('icons')) {
         		$('.header').attr('class','header nOn nClaimsOn icons');
				 	} else {
         		$('.header').attr('class','header nOn nClaimsOn');
				 	}
         $(".mainnav .topLvl,.mainnav .topLvl a").removeClass("on").removeClass("next");
         $(".nClaims,.nClaims a:first").addClass("on");
         $('.nClaims').next().children("a:first").addClass("next");
         
         $('.nClaims li:first').addClass('first');
         break;
      case 'nSupport':
         closeAdjust();
         /* Show Claims nav */
				 	if ($('.header').hasClass('icons')) {
         		$('.header').attr('class','header nOn nSupportOn icons');
				 	} else {
         		$('.header').attr('class','header nOn nSupportOn');
				 	}
         $(".mainnav .topLvl,.mainnav .topLvl a").removeClass("on").removeClass("next");
         $(".nSupport a:first").addClass("on");
         $('.nSupport').next().children("a:first").addClass("next");
         
         $('.nSupport li:first').addClass('first');
         break;
      case 'nResources':
         closeAdjust();
         /* Show Claims nav */
					if ($('.header').hasClass('icons')) {
         		$('.header').attr('class','header nOn nResourcesOn icons');
				 	} else {
         		$('.header').attr('class','header nOn nResourcesOn');
				 	}
         $(".mainnav .topLvl,.mainnav .topLvl a").removeClass("on").removeClass("next");
         $(".nResources a:first").addClass("on");
         $('.nResources').next().children("a:first").addClass("next");
         
         $('.nResources li:first').addClass('first');
         break;
      case 'nAccount':
				 if(navOpenCount == 0)acctAdjust();
         else closeAdjust();
         /* Show Claims nav */
				 	if ($('.header').hasClass('icons')) {
         		$('.header').attr('class','header nOn nAccountOn icons');
				 	} else {
         		$('.header').attr('class','header nOn nAccountOn');
				 	}
         $(".mainnav .topLvl,.mainnav .topLvl a").removeClass("on").removeClass("next");
         $(".nAccount .tLvl").addClass("on");         
         
         if($('.nAccount .preAuth').length > 0){
            /* unauthenticated */
            
            /* Control tab order of login form boxes and change text input when focused and exit focus determining if the prior input has changs or not */
            $('.nAccount').next().children("a:first").addClass("next");          
            $('.nAccount input').focus(function(){
               $(this).addClass('active');
            });
            $('.nAccount input').blur(function(){
               $(this).removeClass('active');
            });
            
            $('.nAccount #username').focus(function(){               
               if($(this).val() == "User ID"){
                  $(this).val("");
               };                  
            });
            
            $('.nAccount #username').blur(function(){
               if($(this).val() == ""){
                  $(this).val("User ID");
               };                  
            });
            
            $('.nAccount #password').focus(function(){
               if($(this).val() == "Password"){
                  $(this).val("");
               };                  
            });
            
            $('.nAccount #password').blur(function(){
               if($(this).val() == ""){
                  $(this).val("Password");
               };                  
            });
                        
            /* dynamic positioning of links due to desired tab order of form. dynamic tabindex and focus/blur not fully supported in IE any version thus html reordering. */
            var unameLoc = $('#username').position();
            var pwLoc = $('#password').position();
                      
            $('.unameCta').css({'left':((unameLoc.left + $('#username').width())- $('.unameCta').width() + 15),'top':(unameLoc.top+38)});
            $('.pwCta').css({'left':((pwLoc.left + $('#password').width())- $('.pwCta').width() + 15),'top':(pwLoc.top+38)});           
         }else{
            /* authenticated */
            
            $('.postAuth .snav li:first').addClass('first');
            $('.postAuth .snav li:last').addClass('last');
               
            $('.auth2Lvl').parent('li').hover(function(e){
               e.preventDefault();
               auth2LvlNav($(this));
            },function(e){
               e.preventDefault();
               var theObj = $(this);
               theObj.removeClass('open');
               theObj.next('li').removeClass('next');
            });
				$('.auth2Lvl').parent('li').click(function(e){
               e.preventDefault();
               if (!$(this).is(":hover"))auth2LvlNav($(this));
            });						
         }
         break;
      default:
         closeAdjust();
         break;
   }  
};

function auth2LvlNav(theObj) {
  var theDrop = theObj.children('ul');
  var theLinkW = theObj.outerWidth();
  var theDropW = theDrop.outerWidth();
  var thePos = parseInt(theObj.position().left);
  $('.auth2Lvl').parent('li').removeClass('open');/*reset*/
  theObj.addClass('open');
  theDrop.css('left',(thePos - ((theDropW/2) - (theLinkW/2))));
  theObj.next('li').addClass('next');
}

function navClick() { 
   if(navOpenCount == 0){
      insNavAdjust();
      getNav();
   };
   
   $('.mainnav a').click(function(e){
      navOpenCount++;
      var theTarget = $(e.target);
      
      navMenu = theTarget.parents('.topLvl').attr('class').split(' ',1).toString();
     
			if(theTarget.hasClass('tLvl')){
			   /* Top level nav opens sub nav not directly to a page */
         e.preventDefault();
         
         if($(this).not('.snav a').hasClass('on')){
            /* close nav */
            closeNav();
         }else{
            /* open nav */
            if($(this).not('.auth2Lvl')){
                closeSubNav();
            };
            
            getNav();
         }       
      }else{
         /* sub level navigation goes to a page */
      }            
   });
   
   $('body').click(function(e) {   
      if($(e.target).parents('.header').length==0) {
         closeNav();
      };
	});
}

// close all
function closeAll() {
	$('.quoteHead,.quoteDrawer').removeClass('show');
	$('.quoteLoc input').blur();
	if($('.drawerOuter').hasClass('open')){
	   $('.drawerOuter').removeClass('open').animate({bottom:'-='+drawerOptions.height});
	};
	
	closeNav();
}

var closeNav = function() {
		if ($('.header').hasClass('icons')) {
			$('.header').attr('class','header icons');
		} else {
			$('.header').attr('class','header');
		}
   $('.pline').remove();
   $('.mainnav li,.mainnav a')
      .removeClass('on')
      .removeClass('next');
	$('#content').css('margin-top',headerHeight);
	$('.postAuth .auth2LvlOn').removeClass('auth2LvlOn');
	$('.postAuth .on').removeClass('on');
	
	$('.auth2Lvl').parent('li').removeClass('open');
	$('.auth2Lvl').parent('li').next('li').removeClass('next');
};

var closeSubNav = function() {
   $('.auth2Lvl').removeClass('auth2LvlOn');
   $('.auth2Lvl').next('ul').removeClass('on'); 
}

// If escape key is called, close the modal windows
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
      $('.jqmWindow').jqmHide();
      $('.quoteHead,.quoteDrawer').removeClass('show');
  }
});

$('.account_inner .cta').click(function(e) {
	e.preventDefault();
	$('.account_inner .wrapper div').hide();
	$(this).parent().children('div').show();
	$(this).parent().children('div').children('.get-started').focus();
});
$('.account_inner .wrapper .close').click(function(e) {
	e.preventDefault();
	$('.account_inner .wrapper div').hide();
	$(this).parent().parent().children('.cta').focus();
});

function agentCarousel(drwNm) {   
   /* drawer agent listing carousel */
   /* wide prospect version */
   $('#' + drwNm + ' .agentListing').not('.column .agentListing').easyPaginate({
       step: 2,
       container: 'agent-nav'
   });

   /* single width customer version */
   $('#' + drwNm + ' .agentListing').not('.column-wide .agentListing').easyPaginate({
       step: 1,
       container: 'agent-nav'
   });

   var agentCount = 0;
   $('#' + drwNm + ' .agents .agentListing li').each(function(){
      /* count the number of agents for the column label */
      agentCount++;  
   });
   /* dynamic content for agent listing carousel */   
   $('#' + drwNm + ' .agentNumNearZip').text(agentCount);
   $('#' + drwNm + ' .agentNearZip').text($('.zipDrawer input').val());
}

function quoteBox() {
   $('.quoteDropBtm .quoteSelect dd:last').addClass('last');

	$('.getQuoteLnk').click(function() {
	   var theQuoteBox;
	   closeNav();
	   if($(this).parent().hasClass('quoteHead')){
	      theQuoteBox = $('.quoteHead');
		  	$('.quoteDrawer').removeClass('show');
			if ($(".drawerOuter").hasClass('fixed')) {
				if ($(".drawerOuter").hasClass('open')) {
					$(".drawerOuter").removeClass('open');
					$('.drawerOuter').animate({bottom:'-='+drawerOptions.height});
				};
			};
	   }else{
	      theQuoteBox = $('.quoteDrawer');
		   $('.quoteHead').removeClass('show');
	   }
	   
		if(theQuoteBox.hasClass('show')) {
			theQuoteBox.removeClass('show');	
		} else {
			theQuoteBox.addClass('show');
		}
		
		return false; 
	});
	
	$('body').click(function(e) {
       if($(e.target).parents('.quoteDrop').length==0 && $(e.target).parents('.modalContentZip').length==0 && !$(e.target).hasClass('btnSave') && !$('.modalZipCode').hasClass('modalOpen')) {
          $('.quoteHead,.quoteDrawer').removeClass('show');
	    };
	});
}

function checkZip() {
   /* Zip Code is located in the topnavInner, quoteLoc, drawerInner (multiple places) and modalZipCode. If no cookie is detected, these modules pull from detected location or if no detection occurs, they show the Undetected Zip Code use case. */
	$('.zip input').focus(function() {
	   var theMod = $(this);
	   var cancelBtn = theMod.parent().next('a.cancel');
	   var saveBtn = theMod.next('.btnSave');	   
	   var curZip = theMod.val();
	   
	   theMod.parent().addClass('active');
	   saveBtn.addClass('disable').show();
      theMod.siblings('.errIco').remove();
      cancelBtn.addClass('show');
      $('.errMsg').remove();
      $('.modalZipCode').removeClass('err');
      theMod.css('font-style','italic');
      
      theMod.keyup(function(){
         readyZip(theMod,curZip);
      });
      
      theMod.click(function(){
         readyZip(theMod,curZip);
      });
      
    	if($.trim(this.value)=='ZIP Code'){
         this.value='';         
      }
      
      $('body').click(function(e) {
         var theTarget = $(e.target);
         if(theTarget.parents('.zipDrawer').length==0 && theTarget.parents('.zipCode').length==0 && theTarget.parents('.quoteLoc').length==0) {
            cancelBtn.removeClass('show');
            saveBtn.hide();
         };
   	});      
	});
		
	$('.btnSave').click(function(e) {	   
	   e.preventDefault();
	   var $this = $(this);
	   
	   if($this.hasClass('disable')){
	      /* do not allow click until zip has 5 numbers and is edited if changing */
	   } else {	      
	      var theValue = $this.prev().val();
         $('.agentNearZip,.zipTopnav .zipCode').text(theValue);
         $('.zipInput').val(theValue);
         $('p .zipCode,.drawerLoc .zipCode').text(theValue);
         
         $this.parents('.zipDrawer').children('.cancel').removeClass('show');/*drawer*/
         $this.parents('.quoteLoc').children('.cancel').removeClass('show');/*quote box*/
         $this.parents('.zipCode').children('.cancel').removeClass('show');/*modal overlay*/
         
         $this.hide();
	   }
   });
   
   $("input.zipInput").keypress(function(e) {
     /* Hit enter while in zip code field, trigger save */
     if(e.which==13){
   		e.preventDefault();
   		$("input.zipInput").next('.btnSave').trigger('click');
     };
   });   
   
   $('a.cancel').click(function(e){
        e.preventDefault();
        var theParent = $(this).prev();
        
        if(theParent.prev().prev().hasClass('modalContentZip')){
           theParent.find('input').val('');
        } else {
           theParent.find('input').val('ZIP Code');
        }
        
        theParent.find('.btnSave').css('display','none');        
        theParent.removeClass('active');
        $('.modalZipCode,.zip').removeClass('err');
        $(this).removeClass('show');
   });
}

function readyZip(theMod,curZip) {
   if(theMod.val().length == theMod.attr('maxlength')) {
      /* Zip has 5 digits. Determine if changed. */
		if(curZip !== theMod.val()){
		   /* Remove disable if zip has changed. Leave disabled if zip has not changed. */
		   theMod.next('a').addClass('ready').removeClass('disable');
	   };
	} else {
	   /* Change to disable if not 5 digits */
		theMod.next('a').addClass('disable').removeClass('ready');
	}
}

function zipCookie() {
   /* Grab zip content from javascript variable placeholder for development purposes */
   
   if(zipCode !== '' && zipCode !== null){
      
      /* if zip code cookie is detected, change the zip code in all of these locations:
       * topnavInner (prospect and known but not logged in customer)
       * quoteLoc (prospect and known but not logged in customer)
       * drawerInner (prospect: get a quote column, agents near zip code column, known unlogged in customer and logged in customer: get a quote column, your agents in zip code)
       * and modalZipCode
       * */
      
      $('.zip input').val(zipCode);
      $('.zipTopnav .zipCode').text(zipCode);
      $('p .zipCode,.drawerLoc .zipCode').text(zipCode);
   };
}

function calcSubNav() {
   $('.insUpper li').each(function() {
		insUpTotal += $(this).outerWidth();
	});
	
	$('.insLower li').each(function() {
		insLowTotal += $(this).outerWidth();
	});
	
	$('.nClaims ul li').each(function() {
		claimsTotal += $(this).outerWidth();
	});	
	
	$('.nSupport ul li').each(function() {
		supportTotal += $(this).outerWidth();
	});	
	
	$('.nResources ul li').each(function() {
		resourcesTotal += $(this).outerWidth();
	});
	
	$('.loggedin .nAccount .snav li').not('.loggedin .nAccount .snav li li').each(function() {
		acctTotal += $(this).outerWidth();
	});
	
	/* If IE9 or 10, add 3 pixels, if Chrome add 32 to account for the way font renders (doesn't provide enough width) */
	var extraWidth = 0;
	
	if(isIE9 || isIE10){
	   extraWidth = 13;
	}else if(isChrome){
	   extraWidth = 32;
	}else if(isSafari){
	   extraWidth = 72;
	}else{
	   extraWidth = 12;
	}
	
	$('.insUpper').css('width', (insUpTotal + extraWidth) + 'px');
   $('.insLower').css('width', (insLowTotal + extraWidth) + 'px');
	$('.nClaims ul').css('width', (claimsTotal + extraWidth) + 'px');
	$('.nSupport ul').css('width', (supportTotal + extraWidth) + 'px');		
	$('.nResources ul').css('width', (resourcesTotal + extraWidth) + 'px');
	$('.loggedin .nAccount .snav').css('width', (acctTotal + extraWidth) + 'px');
}

function centerNav() {
   /* True center */
   var navWidth = $('.mainnavInner').width();
   $('.insUpper').css('left', ((navWidth - insUpTotal) / 2) + 'px');
   $('.insLower').css('left', ((navWidth - insLowTotal) / 2) + 'px');
   $('.loggedin .nAccount .snav').css('left', ((navWidth - acctTotal) / 2) + 'px');
	
	/* Center under active top level nav */
	var claimsPos = parseInt($('.nClaims').position().left);
	var supportPos = parseInt($('.nSupport').position().left);
	var resourcesPos = parseInt($('.nResources').position().left);
	
	$('.nClaims ul').css('left', (claimsPos - (claimsTotal/2 - claimsWidth/2)) + 'px');
	$('.nSupport ul').css('left', (supportPos - (supportTotal/2 - supportWidth/2)) + 'px');
	$('.nResources ul').css('left', (resourcesPos - (resourcesTotal/2 - resourcesWidth/2)) + 'px');
	
	
	checkBoundaries('.insUpper');
	checkBoundaries('.insLower');
	checkBoundaries('.nClaims ul');
	checkBoundaries('.nSupport ul');
	checkBoundaries('.nResources ul');
}

function checkBoundaries(snavClass) {
	/* 960 boundary */
	var boundary = $('.topnavInner').offset().left + $('.topnavInner').width();	
	var snav_boundary = $(snavClass).offset().left + $(snavClass).width();
	
	/* If it goes past 960, adjust it */
	if(snav_boundary > boundary) {
		var boundaryDiff = snav_boundary - boundary;
		$(snavClass).css('left', '-=' + boundaryDiff);
	} ;
}

// **************************
//      URL PARAMETERS
// **************************
function getURLParam(name) {
   name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
   var regexS = "[\\?&]"+name+"=([^&#]*)";
   var regex = new RegExp(regexS);
   var results = regex.exec(window.location.href);
   if(results === null)
   {
   	return "";
   }	    
   else
   {
   	return results[1];
   }	    
}

function readCookie(cookieName){
   var results = document.cookie.match(cookieName + '=(.*?)(;|$)')
   if(results){
      return(results[1]);
   }
   else{
      return null;
   }
}

function writeCookie(c_name, value, exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + "; path=/";
	document.cookie=c_name + "=" + c_value;
}

function updateCookie(acom, persist) {
	var date = new Date(); date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
	$.cookie('acom', JSON.stringify(acom), { expires: date, path: '/', domain: siteName });
}

function swapContent() {
   /* Dynamic content based off URL query string for development purposes only */
   
   $('.zipInput').attr('value',zipCode); /* Used for development purposes to show temporary hard coded zip code */
   $('p .zipCode').text(zipCode);  /* Used for development purposes to show temporary hard coded zip code */
   
   switch(getURLParam('customer')) {
      /* Customer cookie is detected or not use case. */
      case "true":
         $('#prospectDrawer').remove();
         $('#customerDrawer').show();
         agentCarousel('customerDrawer');
         writeCookie("cusName","Jennifer");
         $('.loginLegend').text('Welcome back, ' + readCookie('cusName') + '.'); 
         break;
      default:
         $('#customerDrawer').remove();
         navMenu = "";
         if (pgName == "index.html" || pgName == "") {
         if(getURLParam('pg') == ''){
            navOpenCount = 0;      
            
            if(getURLParam('loggedin') == ""){
               navMenu = "nInsurance";
            };
         };    
				 }    
         break;
   }
   
   switch(getURLParam('loggedin')) {
      /* Logged in or not use case */
      case "true":
         navOpenCount = 1;
         $('.quoteHead').remove();
         writeCookie("cusName","Jennifer");
         $('body').addClass('loggedin');
         $('.topnavInner .search').before('<li class="cust"><a href="#">Hello, <span class="custName">' + readCookie('cusName') + '</span></a></li><li><a href="#">Log Out</a></li>');
         $('.langChoice').remove();/* language choice will need to be a setting associated with the customer's account otherwise this should not be removed */
         $('.topnavInner .location').remove();/* Location removed to accomodate additional length for customer name */
         $('.nAccount .tLvl').text('My Account');
         $('.nAccount .preAuth').remove();
         break;
      default:
         navOpenCount = 0;
         if(getURLParam('customer') == "true"){
            navMenu = "nAccount";
         };
         getNav();    
         $('.nAccount .postAuth').remove();     
         break;
   }
   
   switch(getURLParam('zip')) {
      case "undetect":
         /* Location of visitor is not detected. Show this use case. */
         zipCode = "ZIP Code";
         $('#prospectDrawer').remove();
         $('.zip input').val(zipCode);
         $('.zipTopnav').html('<span>Enter US <span class="zipCode">ZIP Code</span></span>');
         $('.modalZipCode .zipCityState p').text('');
         $('.modTitle').text('Please Enter A Valid US ZIP Code Below.');
         $('.quoteLoc p,.drawerLoc span').text('Enter a valid US ZIP Code to set your location.');         
         break;
      case "error1":
         $('#undetectZipDrawer').remove();
         $('.modalZipCode').addClass('err');
         $('.modalZipCode .zip').append('<div class="errIco" />');
         $('.modalContentZip').before(errMessage);
         break;
      case "error2":
         $('#undetectZipDrawer').remove();
         $('.drawerInner .zip').addClass('err').append('<div class="errIco" />');         
         $('.drawerInner .notice').prepend(errMessage);
         break;
      case "error3":
         $('#undetectZipDrawer').remove();
         $('.quoteHead .zip').addClass('err').append('<div class="errIco" />');         
         $('.quoteHead .quoteDrop').prepend(errMessage);
         break;
      default:
         $('#undetectZipDrawer').remove();
         break;
   }
	 
   switch(getURLParam('city')){
      case "long":
         $('.zipCityState p').text('Mooselookmeguntic, ME'); /* longest city name in the US with fewest letter "i" */
         $('.zipTopnav').html('<span>Mooselookmeguntic, ME, <span class="zipCode"></span></span>');
                
         break;
      default:
         break;
   }
   
   switch(getURLParam('phone')) {
      case "long":
         /* Characters that use up the most horizontal space to ensure layout bugs do not occur */
         $('.drawerInner .support .phone').text('888-888-8888');
         break;
      default:
         break;
   }
   
   switch(getURLParam('custName')){
      /* Showing alternate long customer name use case and how to handle displaying of long names. "Jennifer" is hard coded in as a default. This overrides it to ensure worst case scenarios do not break layouts. */
      case "long":
         writeCookie("cusName","Rhoshandiatellyneshiaunneveshenk");/*Actual first name as stated on their birth certificate of a person born in Beaumont, TX in 1984*/
         var cusName = readCookie("cusName");
				 if (cusName.length>16) {
				   /* shorten customer name displayed to first 16 characters and apply an ellipsis. */
				   cusName = cusName.substr(0,16) + '&#8230;';
				 };
         
         $('.topnavInner .cust').html('<a href="#">Hello, <span class="custName">' + cusName + '</span></a>');
         $('.loginLegend').html('Welcome back, ' + cusName + '.');       
         break;
      default:
         break;
   }
	
	var sec = decodeURIComponent(getURLParam('sec'));
	var type = decodeURIComponent(getURLParam('type'));
	if (sec) {
		$('.tNav li[rel="' + sec + '"] a:eq(1)').click();
		if (type) {
		   $('.tNav li[rel="' + sec + '"] ul li[rel="' + type + '"] a:eq(0)').addClass('on');
		} else {
		   $('.tNav li[rel="' + sec + '"] a:eq(0)').addClass('on');
		}
	};	 
}

/* Gigya Custom Share 2013-09-13 */
var createShareButton;createShareButton=function(e,t,n,r){var i,s,o,u,a,f;o=function(e){if(Math.abs(Number(e))>=1e9){return Math.abs(Number(e))/1e9+"B"}else if(Math.abs(Number(e))>=1e6){return Math.abs(Number(e))/1e6+"M"}else if(Math.abs(Number(e))>=1e3){return Math.abs(Number(e))/1e3+"K"}else{return Math.abs(Number(e))}};u=function(e){var t,n;t=e.context.containerID;if(e.errorCode===0){n=e.shareCounts.facebook+e.shareCounts.twitter+e.shareCounts.pinterest+e.shareCounts.linkedin;if(n>49){if(n>999){n=o(n);n=parseFloat(n).toPrecision(2)+n.replace(/[^B|M|K]/g,"")}$("#"+t+"-reaction0-count").css("display","block");return $("#"+t+"-reaction0-count-value").text(n)}}};i=function(e){$("#"+e.containerID+"-reaction0-icon").css("display","none");return gigya.socialize.getProviderShareCounts({context:{containerID:e.containerID},callback:u,enableProviders:"facebook"},"twitter","linkedin","pinterest",{URL:t})};s={type:"image",src:r,href:t};f=new gigya.socialize.UserAction;f.setLinkBack(t);f.setTitle(n);f.addMediaItem(s);a={userAction:f,shareButtons:"share",operationMode:"simpleShare",showCounts:"right",buttonImages:{buttonLeftImgUp:"img/share/share-left.gif",buttonCenterBGImgUp:"img/share/share-middle.gif",buttonRightImgUp:"img/share/share-right.gif",buttonLeftImgOver:"img/share/share-left-over.gif"},containerID:e,onLoad:i};return gigya.socialize.showShareBarUI(a)}