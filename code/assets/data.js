$(document).ready(function() {
  function Locations(data) {
    this.location = ko.observable(data);
  }

  function filterLocations(type) {
    var clonedArray = jQuery.extend([], model.viewModel.locations());
    var currentType = type;
    var clonedArray = ko.utils.arrayFilter(model.viewModel.locations(), function(item) {
      return item.location()[type] !== null;
    });
     var m = clonedArray.sort(function(left, right) {
        return left.location()[type] == right.location()[type] ? 0 : (left.location()[type] < right.location()[type] ? -1 : 1); 
      });

   model.viewModel.locations(m);
   setTopMarkers();
  }


  function setTopMarkers() {
    for (var i = 0; i < 10; i++) {
     model.viewModel.map.setSelectedMarkers(i);
     $('circle[data-index="'+i+'"]').css('fill', model.viewModel.color);
    };
  }

  function formatMarkers(markerList, type) {
   var markers = [];
    for (var i = 0; i < model.viewModel.locations().length; i++) {
      markers.push({'style': {fill: model.viewModel.color},'id':true, 'latLng': [model.viewModel.locations()[i].location().Lat, model.viewModel.locations()[i].location().Lon], 'name': model.viewModel.locations()[i].location().City +", " + model.viewModel.locations()[i].location().State});
    }
    return markers;
  }

  function panMapToMarkers() {
    var lat = model.viewModel.currentActiveLocation().Lat;
    var lng = model.viewModel.currentActiveLocation().Lon;
    var scale = 5;
    // zoom to the area of interest
    // debugger;
    var mapObj = $('.map').vectorMap('get', 'mapObject');
    mapObj.setScale(0);
    var foo = mapObj.latLngToPoint(lat,lng);
    var w = (foo.x - 25) / mapObj.width;
    var h = foo.y / mapObj.height;
    mapObj.setFocus(scale, w, h);
  }

  function setMap(color) {
    var regionStyling = {initial: {fill: '#e8e8e8'},hover: {fill: "#666"}};
    var color = color || '#0096d6';
    var map = new jvm.WorldMap({
      container: $('.map'),
      zoomStep: 2,
      zoomOnScroll: false,
      map: 'us_aea_en',
      backgroundColor: '#fff',
      regionStyle:regionStyling,
      markerStyle: {
        initial: {
          fill: color,
          stroke:'transparent'
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
        label.html(label.html()+' (modified marker)');
        return false;
      },
      onMarkerOver: function(event, index){
        console.log('marker-over', index);
        return false;
      },
      onMarkerOut: function(event, index){
        console.log('marker-out', index);
        return false;
      },
      onMarkerClick: function(event, index){
        $('.toplistings ul li').get(index).click();
        event.stopPropagation();
        event.preventDefault();
        return;
        
      },
      onMarkerSelected: function(event, index, isSelected, selectedMarkers){
         var path    = $('circle[data-index="'+index+'"]');
         var pathParent  = $('circle[data-index="'+index+'"]').parent();
         var text = ' <svg class="textSvg"><text data-index="'+index+'" text-anchor="middle" alignment-baseline="middle" x="'+path.attr('cx')+'" y="'+path.attr('cy')+'" style="fill: #fff; font-size: 11px;">'+(parseInt(index)+1)+'  </text></svg>';

         $(pathParent).append(path);
         $(pathParent).append(text);
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
          $('.jvectormap-container .textSvg text').each(function(index, item) {
          var x = $('.jvectormap-container circle[data-index="'+index+'"]').attr('cx');
          var y = $('.jvectormap-container circle[data-index="'+index+'"]').attr('cy');
          $(item).attr('x',x);
          $(item).attr('y',y);
        });
        var scalefactor = 1;
        if (scale > 0 && scale <= 2.0) {
          console.log('US');
          scalefactor = 1;
        }
        else if(scale > 2.1 && scale <= 4.0) {
          console.log('region');
          scalefactor = 2;
        }
        else if(scale > 4.1 && scale <= 6.0) {
          console.log('state');
          scalefactor = 3;
        }
        else if(scale > 6.1 && scale <= 8) {
          console.log('city');
          scalefactor = 4;
        }
        console.log(scalefactor + ' scale');

      }

    });
    return map;
  }

  //THIS IS THE MODEL ---------------------------------
  function TaskListViewModel() {
    var self = this;
    self.type =  ko.observable("Top Cities");
    self.initialLoadType =  ko.observable("2014 Top Cities");
    self.id =  ko.observable("topCity");
    self.byline =  ko.observable("Explore the cities with the fewest auto collisions");
    self.year =  ko.observable("2014");
    self.locations = ko.observableArray([]);
    self.map = setMap();
    self.currentActiveLocation = ko.observable({});

    self.popModal = function(currentLocation,e) {
            $('.toplistings ul li.active').removeClass('active');
            $(e.currentTarget).addClass('active');
            $('.modal').css('border', 'solid 5px' + self.color + '');
            $('.tabContentMap').addClass('show-modal');
            self.currentActiveLocation(currentLocation.location());
            e.stopPropagation();
            panMapToMarkers();

            var markerIdx = $(e.currentTarget).attr('idx');
            var currentClasses = $('circle[data-index="' + markerIdx + '"]').attr("class");
            $('.panned-to').attr("class", currentClasses);
            $('circle[data-index="'+markerIdx+'"]').attr("class", currentClasses +" panned-to");
            
         }
    



    $.getJSON("/assets/best-driver.json", function(allData) {
        setSliderTicks();
        var mappedTasks = $.map(allData, function(item) { return new Locations(item) });
        self.locations(mappedTasks);
        filterLocations(self.initialLoadType());
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


    //UI EVENTS
    $( "#tabs .tab" ).on('click', function(e) {
      var id = $(e.currentTarget).attr('id'),
          sectionColor = $(e.currentTarget).data('color'),
          type = $(e.currentTarget).data('type'),
          byline = $(e.currentTarget).data('byline');
          
          // hacks to handle the bad JSON
          var year = '2014';
          var newtype = type.substring(5);
          model.viewModel.year('2014');

      $( "#tabs .tab" ).removeClass('selected');
      $(e.currentTarget).addClass('selected');
      $('.tabContentMap').removeClass('show-modal');

      $( "div.tabContent .tabContentMap .jvectormap-zoomin, div.tabContent .tabContentMap .jvectormap-zoomout").css('color', sectionColor);

      $('.tabContent .sliderContainer #slider').removeClass('disabled');
      if (!$('#tabs #topCity').hasClass('selected')){
        $('.tabContent .sliderContainer #slider').addClass('disabled');
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
      filterLocations(type);

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
       $('.toplistings ul li.active').removeClass('active');
       $('.tabContentMap').removeClass('show-modal');
        e.stopPropagation();
       var currentClasses = $('.panned-to').siblings().attr("class");
       $('.panned-to').attr("class", currentClasses);
    }

    //Set Slider
    $("#slider").slider({
      value: 2014,
      min: 2005,
      max: 2014,
      step: 1,
      slide: function( event, ui ) {
        // debugger;
        closeModal(event);
        $('.tabContentMap').removeClass('show-modal');
        //need to reset the map to be back at the US view.
        var mapObject = $('.map').vectorMap('get', 'mapObject');
        mapObject.setScale(0);

        var val = ui.value;
        var yearString = 'Top Cities';
        filterLocations(yearString);
        model.viewModel.type(yearString);
        model.viewModel.year(ui.value);
      }
    });

    function setSliderTicks() {
      var $slider =  $('#slider');
      var max =  $slider.slider("option", "max") - $slider.slider("option", "min");
      var spacing =  $slider.width() / (max);

      $slider.find('.ui-slider-tick-mark').remove();
        for (var i = 0; i < max+1 ; i++) {
          $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) - 4 + 'px').appendTo($slider);                    
        }
      }

    window.onresize = function(event) {
      setSliderTicks();
    };


}); //END DOCUMENT READY





