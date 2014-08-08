$(document).ready(function() {
  function Locations(data) {
    this.location = ko.observable(data);
  }

  function filterLocations(type, year) {
    if (year==''){
      type = type;
    }
    else{
      type = year + ' ' + type;
    }

    var clonedArray = jQuery.extend(true, {}, model.viewModel.savedLocations()); //get all the data
    var currentType = type; //get the filter
    var clonedArray = ko.utils.arrayFilter(new model.viewModel.savedLocations(), function(item) {
      return item.location()[type] !== null && item.location()[type] !== -1;
    }); //get the location that has no nulls.
    var m = clonedArray.sort(function(left, right) {
      return left.location()[type] == right.location()[type] ? 0 : (left.location()[type] < right.location()[type] ? -1 : 1); 
    });
   model.viewModel.locations(m);
   setTopMarkers(10);
  }


  function setTopMarkers(numberCount) {
    var markerData = model.viewModel.map.markers; //[0].config.dataObj;
    for (var i = 0; i < numberCount; i++) {
     for (var j in markerData) {
       if (markerData[j].config.dataObj[model.viewModel.year()+' '+model.viewModel.type()] == i+1) {
          model.viewModel.map.setSelectedMarkers(j);
          $('circle[data-index="'+i+'"]').css('fill', model.viewModel.color);
       }
     };
    };
  }

  function formatMarkers(markerList, type) {
   var markers = [];
    for (var i = 0; i < model.viewModel.locations().length; i++) {
      markers.push({'style': {fill: model.viewModel.color, stroke: model.viewModel.strokeColor},'dataObj':model.viewModel.locations()[i].location(), 'id':true, 'latLng': [model.viewModel.locations()[i].location().Lat, model.viewModel.locations()[i].location().Lon], 'name': model.viewModel.locations()[i].location().City +", " + model.viewModel.locations()[i].location().State});
    }
    return markers;
  }

  function bringMarkerToTop(index) {
     var path = $('circle[data-index="'+index+'"]');
     var pathParent  = $('circle[data-index="'+index+'"]').parent();
     var text = '<svg class="textSvg"><text data-index="'+index+'" text-anchor="middle"  x="'+path.attr('cx')+'" y="'+(parseInt(path.attr('cy'))+4)+'" style="fill: #fff; font-size: 11px;">'+(parseInt(index)+1)+'  </text></svg>';
     if (path.attr('r') > 5) {
       $(pathParent).append(path);
       $(pathParent).append(text);
     };
  }

  function panMapToMarkers() {

    //SHOULD FIGURE OUT HOW TO PAN WITHOUT GOING TO TOP LEVEL ZOOM
    var lat = model.viewModel.currentActiveLocation().Lat;
    var lng = model.viewModel.currentActiveLocation().Lon;
    var scale = 4;
    var mapObj = model.viewModel.map;
    mapObj.setScale(0);
    var foo = mapObj.latLngToPoint(lat,lng);
    var w = (foo.x - 25) / mapObj.width;
    var h = foo.y / mapObj.height;
    mapObj.setFocus(scale, w, h);
  }

  function setMap(color, strokeColor) {
    var regionStyling = {initial: {fill: '#e8e8e8'},hover: {fill: "#666"}};
    var color = color || '#0096d6';
    var strokeColor = strokeColor || '#fff';
    var map = new jvm.WorldMap({
      container: $('.map'),
      zoomStep: 2,
      zoomOnScroll: false,
      map: 'us_aea_en',
      backgroundColor: '#fff',
      regionStyle:regionStyling,
      markerStyle: {
        initial: {
          stroke: strokeColor
        },
        selected: {
          r: 16,
          fill: color
        },
      },
      markers: [],
      regionsSelectable: false,
      markersSelectable: false,
      markersSelectableOne: false,

      onMarkerLabelShow: function(event, label, index){
        // console.log(label);
        label.html(
          '<div class="labelContainer">'+ label.html() +'</div>'
          );
        // return false;
      },
      onMarkerOver: function(event, index){
        //console.log('marker-over', index);
        bringMarkerToTop(index);
        return false;
      },
      onMarkerOut: function(event, index){
        //console.log('marker-out', index);
        return false;
      },
      onMarkerClick: function(event, index){
        model.viewModel.shouldScroll = true;
        model.viewModel.lastMarkerClicked = index;
        var obj = model.viewModel.map.markers[index].config.dataObj[model.viewModel.year()+' '+model.viewModel.type()];

        $('.toplistings ul li[idx="'+obj+'"]').click();
        bringMarkerToTop(index);
        event.stopPropagation();
        event.preventDefault();
        return;
      },
      onMarkerSelected: function(event, index, isSelected, selectedMarkers){
        bringMarkerToTop(index);
      },
      onRegionLabelShow: function(event, label, code){
        label.html(label.html()+' (modified)');
        return false;
      },
      onRegionOver: function(event, code){
        //console.log('region-over', code, map.getRegionName(code));
        return false;
      },
      onRegionOut: function(event, code){
        //console.log('region-out', code);
      },
      onRegionClick: function(event, code){
        //console.log('region-click', code);
      },
      onRegionSelected: function(event, code, isSelected, selectedRegions){
        //console.log('region-select', code, isSelected, selectedRegions);
        if (window.localStorage) {
          window.localStorage.setItem(
            'jvectormap-selected-regions',
            JSON.stringify(selectedRegions)
          );
        }
      },
      onViewportChange: function(e, scale, transX, transY){

        $('.jvectormap-container .labelSvg text').each(function(index, item) {
          var itemPicked = $(item).data('index');
          var x = $('.jvectormap-container circle[data-index="'+itemPicked+'"]').attr('cx');
          var y = $('.jvectormap-container circle[data-index="'+itemPicked+'"]').attr('cy');
          var xInt = parseInt(x) + 20;
          var yInt = parseInt(y) + 5;
          $(item).attr('x',xInt);
          $(item).attr('y',yInt);
        });
        $('.jvectormap-container .textSvg text').each(function(index, item) {
          var correctIndex = $(item).data('index');
          var x = $('.jvectormap-container circle[data-index="'+correctIndex+'"]').attr('cx');
          var y = $('.jvectormap-container circle[data-index="'+correctIndex+'"]').attr('cy');
          var yInt = parseInt(y) + 4;
          $(item).attr('x',x);
          $(item).attr('y',yInt);
        });

        window.a = window.a + 1 || 0;
        var scalefactor = 0;
        if (window.a > 0) {
          if (scale > 0 && scale < 2.0) {
            //console.log('US');
            scalefactor = 1;
          }
          else if(scale >= 2 && scale < 3.7) {
            //console.log('region');
            scalefactor = 2;
          }
          else if(scale >=3.7 && scale < 5) {
            //console.log('state');
            scalefactor = 3;
          }
          else if(scale >= 5 && scale <= 8) {
            //console.log('city');
            scalefactor = 4;
          }
          if (scalefactor !== model.viewModel.scalefactor()) {
            model.viewModel.scalefactor(scalefactor);
          };
        };
          //console.log(scalefactor);
        $('#zoom-bar').slider('value', '' + scalefactor + '');
      }

    });
    return map;
  }



 //Handle Markers on Scale ---------------------------------
  function setScaleInformation(scaleFactor) {
    $('.labelSvg').remove();
    if (scaleFactor == 2 || scaleFactor == 3 || scaleFactor == 4) {
        if (model.viewModel.allMarkersUpdated() !== true) {
          model.viewModel.allMarkersUpdated(true);
        }
        model.viewModel.map.clearSelectedMarkers();
        handleMarkersAndText(scaleFactor);
      };
      
     if(scaleFactor == 1 || scaleFactor == 0) {
      model.viewModel.allMarkersUpdated(false);
      model.viewModel.map.clearSelectedMarkers();
      $('.jvectormap-container text').remove();
      setTopMarkers(10);
    }
  }
  function setMarkerSelected(i) {
    var path = $('circle[data-index="'+i+'"]');
    var pathParent  = $('circle[data-index="'+i+'"]').parent();
    var color = model.viewModel.selectedColor() || '#0076a7';
    var text = ' <svg class="labelSvg"><g><rect></rect><text data-index="'+i+'" text-anchor="left" x="'+(parseInt(path.attr('cx'))+20)+'" y="'+(parseInt(path.attr('cy'))+5)+'" style="fill: '+color+'; font-family: "Open Sans" font-size: 13px;">'+model.viewModel.locations()[i].location().City +'  </text></g></svg>';
    model.viewModel.map.setSelectedMarkers(i);
    $('circle[data-index="'+i+'"]').css('fill', model.viewModel.color);
    $(pathParent).append(text);
  }
  function handleMarkersAndText(scaleFactor) {
    for (var i = 0; i < model.viewModel.locations().length; i++) {
        //if (model.viewModel.locations()[i].location()['Zoom Level'+scaleFactor+''] == 'Y' || i < 11) {
      if (model.viewModel.locations()[i].location()['Zoom Level' + scaleFactor + ''] == 'Y') {
        setMarkerSelected(i);
      }
      else {
        $('text[data-index="'+i+'"]').remove();
      }
    };
  }

//Handle Markers on Scale ---------------------------------


  //THIS IS THE MODEL ---------------------------------
  function TaskListViewModel() {
    var self = this;
    self.type =  ko.observable("Top Cities");
    self.initialLoadType =  ko.observable("2014 Top Cities");
    self.id =  ko.observable("topCity");
    self.byline = ko.observable("Explore cities that are least likely to experience collisions.");
    self.year =  ko.observable("2014");
    self.yearFomattedTopDriver = ko.observable(self.year() + ' Top Cities');
    self.selectedColor = ko.observable("#0076a7");
    self.color = '#0096d6';
    self.strokeColor = '#01d9d2';
    self.locations = ko.observableArray([]);
    self.savedLocations = ko.observableArray([]);
    self.allMarkersUpdated = ko.observable(false);
    self.scalefactor = ko.observable(1);
    self.map = setMap();
    self.currentActiveLocation = ko.observable({});

    self.formattedNumber = function(n) {
        return n + '<sup>' + ([, 'st', 'nd', 'rd'][~~(n / 10 % 10) - 1 ? n % 10 : 0] || 'th') + '</sup>';
    };


    self.popModal = function(currentLocation,e, shouldScrollList) {
            $('.toplistings ul li.active').removeClass('active');
            $(e.currentTarget).addClass('active');
            
          if (self.shouldScroll) {
            var pos= ($('.toplistings').scrollTop()+$('li.active').position().top - 190);
            $(".toplistings").animate({ scrollTop: pos }, 500);
            self.shouldScroll = false;
          };

            $('.modal').css('border', 'solid 5px ' + self.color + '');
            $('.tabContentMap').addClass('show-modal');
            self.currentActiveLocation(currentLocation.location());
            panMapToMarkers();

            var windowHeight = $('.toplistings ul').height();
            var currentTop = $('.toplistings').scrollTop();

             var markerIdx = model.viewModel.lastMarkerClicked ? model.viewModel.lastMarkerClicked : null;
             var markerData = model.viewModel.map.markers;
             if (!markerIdx) {
              for (var j in markerData) {
                 if (markerData[j].config.dataObj[model.viewModel.year()+' '+model.viewModel.type()] == currentLocation.location()[model.viewModel.year()+' '+model.viewModel.type()]) {
                    var markerIdx = j;
                 }
               };
             };

             var currentClasses = $('circle[data-index="' + markerIdx + '"]').attr("class");

            
             

             $('.panned-to').attr("class", currentClasses);
             $('circle[data-index="'+markerIdx+'"]').attr("class", currentClasses +" panned-to");
             setMarkerSelected(markerIdx);
             $('.panned-to').css('fill', model.viewModel.selectedColor());

             model.viewModel.lastMarkerClicked = null;

             e.stopPropagation();
            
         }
    

    $.getJSON("assets/best-driver.json", function(allData) {
        setSliderTicks();
        var mappedTasks = $.map(allData, function(item) { return new Locations(item) });
        var year = '';
        self.locations(mappedTasks);
        self.savedLocations(mappedTasks);
        filterLocations(self.initialLoadType(), year);
        addZoomBar();
    });  
  }

    //expose the model and bind
    model = { viewModel: new TaskListViewModel() };
    ko.applyBindings(model.viewModel);


    //Subscribe to the model to listen for changes and update map markers
    model.viewModel.locations.subscribe(function(newValue) {
      var markers = formatMarkers(newValue);
       model.viewModel.map.removeAllMarkers();
       model.viewModel.map.addMarkers(markers);
       $('.jvectormap-container .textSvg text').remove();
    });

    model.viewModel.scalefactor.subscribe(function(newValue) {
      setScaleInformation(newValue);
    });
 //END OF MODEL ---------------------------------

    //UI EVENTS
    $('.jvectormap-zoomin, .jvectormap-zoomout').on('click', function(e) {
        closeModal(e);
    });

    $( "#tabs .tab" ).on('click', function(e) {
      var id = $(e.currentTarget).attr('id'),
          sectionColor = $(e.currentTarget).data('color'),
          type = $(e.currentTarget).data('type'),
          selectedColor = $(e.currentTarget).data('selcolor'),
          byline = $(e.currentTarget).data('byline');
          strokeColor = $(e.currentTarget).data('strokecolor');

      $('.toplistings').scrollTop();
          
          // hacks to handle the bad JSON
          var year = '2014';
          var newtype = type.substring(5);
          model.viewModel.year('2014');

      $( "#tabs .tab" ).removeClass('selected');
      $(e.currentTarget).addClass('selected');
      $('.tabContentMap').removeClass('show-modal');

      $( "div.tabContent .tabContentMap .jvectormap-zoomin, div.tabContent .tabContentMap .jvectormap-zoomout").css('color', sectionColor);

      //Slider Options
      $("#slider").slider('value','2014');
      $('.tabContent .sliderContainer #slider, .timeLineCopyContainer').removeClass('disabled');
      if (!$('#tabs #topCity').hasClass('selected')){
        $('.tabContent .sliderContainer #slider, .timeLineCopyContainer').addClass('disabled');
        $("#slider").slider({
          disabled:true
        });
      }
      else{
       $("#slider").slider({
          disabled: false
        });
      }

      //change the color on the list items
      $('.tabContentOther .toplistings ul li svg path').css('fill', sectionColor);
      //$('.headingContainer .icon').removeClass().addClass('icon').addClass(id);
      model.viewModel.type(newtype);
      model.viewModel.id(id);
      model.viewModel.byline(byline);
      model.viewModel.year(year);
      model.viewModel.color = sectionColor;
      model.viewModel.strokeColor = strokeColor;
      model.viewModel.selectedColor(selectedColor);
      filterLocations(type, '');
      $('.ui-slider-handle').css('background-color', model.viewModel.color);

      //need to reset the map to be back at the US view.
      var mapObject = $('.map').vectorMap('get', 'mapObject');
      mapObject.setScale(0);
      $(".toplistings").scrollTop(0);

    });

     // Close the modal
    $( ".modalContainer .close" ).on('click', function(e) {
        closeModal(e);
    });

    $('.ui-blocker').not().on('click', function(e) {
        closeModal(e);
    });

    function closeModal(e) {
        var index =  $('.panned-to').data('index');
        var currentClasses = $('.panned-to').siblings('circle').attr("class");

        //NEED TO CLEAR MARKER SELECTED - THIS METHOD CLEARS ALL - ONLY CLEAR ONE
         //model.viewModel.map.clearSelectedMarkers(index);
         //$('text[data-index="'+index+'"]').remove();

       $('.toplistings ul li.active').removeClass('active');
       $('.tabContentMap').removeClass('show-modal');
       $('.panned-to').attr("class", currentClasses).css('fill', model.viewModel.color);
       e.stopPropagation();
    }

    //Set Slider
    $("#slider").slider({
      value: 2014,
      min: 2005,
      max: 2014,
      step: 1,
      slide: function( event, ui ) {
        closeModal(event);
        $(".toplistings").scrollTop(0);
        $('.tabContentMap').removeClass('show-modal');
        //need to reset the map to be back at the US view.
        var mapObject = $('.map').vectorMap('get', 'mapObject');
        mapObject.setScale(0);

        var val = ui.value;
        var yearString = 'Top Cities';
        filterLocations(yearString, val);
        model.viewModel.type(yearString);
        model.viewModel.year(ui.value);
        model.viewModel.yearFomattedTopDriver(ui.value +' '+ yearString);
      }
    });



    function addZoomBar() {
      var html = '<div class="zoom-bar-wrapper"><div id="zoom-bar"><div class="zoom-tick"></div><div class="zoom-tick"></div><div class="zoom-tick"></div><div class="zoom-tick"></div><div class="zoom-ball"></div></div></div>';
      $('.tabContentMap').prepend(html);
       $("#zoom-bar").slider({
        value: 1,
        min: 1,
        max: 4,
        step: 1,
        orientation:'vertical',
        slide: function( event, ui ) {
          var mapObj = $('.map').vectorMap('get', 'mapObject');
          var rounded = Math.round(ui.value);
          if (ui.value == 1) {
            rounded = 0;
          }
          else if (ui.value == 2) {
            rounded = 2;
          }
          else if (ui.value == 3) {
            rounded = 4;
          }
          else if (ui.value == 4) {
            rounded = 8;
          }
          //console.log('this '+ui.value)
          mapObj.setFocus(rounded,0.5,0.5);
          closeModal(event);
        }
      });
    };

    function setSliderTicks() {
      var $slider =  $('#slider');
      var max =  $slider.slider("option", "max") - $slider.slider("option", "min");
      var spacing =  $slider.width() / (max);

      $slider.find('.ui-slider-tick-mark').remove();
        for (var i = 0; i < max+1 ; i++) {
          $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) - 5 + 'px').appendTo($slider);                    
        }
      }

    window.onresize = function(event) {
      setSliderTicks();
    };


}); //END DOCUMENT READY





