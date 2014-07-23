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
  }

  function formatMarkers(markerList, type) {
   var markers = [];
    for (var i = 0; i < model.viewModel.locations().length; i++) {
      markers.push({'style': {fill: model.viewModel.color},'id':true, 'latLng': [model.viewModel.locations()[i].location().Lat, model.viewModel.locations()[i].location().Lon], 'name': model.viewModel.locations()[i].location().City +", " + model.viewModel.locations()[i].location().State});
    }
    return markers;
  }

  function setMap(color) {
    var regionStyling = {initial: {fill: '#e8e8e8'},hover: {fill: "#666"}};
    var color = color || '#0096d6';
    var map = new jvm.WorldMap({
      container: $('.map'),
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
      markersSelectable: true,
      markersSelectableOne: false,

      onMarkerLabelShow: function(event, label, index){
        label.html(label.html()+' (modified marker)');
      },
      onMarkerOver: function(event, index){
        console.log('marker-over', index);
        return false;
      },
      onMarkerOut: function(event, index){
        console.log('marker-out', index);
      },
      onMarkerClick: function(event, index){
        
      },
      onMarkerSelected: function(event, index, isSelected, selectedMarkers){
         var path    = $('circle[data-index="'+index+'"]');
         var pathParent  = $('circle[data-index="'+index+'"]').parent();
         var text = ' <svg class="textSvg"><text data-index="'+index+'" text-anchor="middle" alignment-baseline="middle" x="'+path.attr('cx')+'" y="'+path.attr('cy')+'" style="fill: #fff; font-size: 11px;">'+index+'  </text></svg>';

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
        $('.jvectormap-container .textSVG text').each(function(index, item) {
          var x = $('.jvectormap-container circle[data-index="'+index+'"]').attr('cx');
          var y = $('.jvectormap-container circle[data-index="'+index+'"]').attr('cy');
          $(item).attr('x',x);
          $(item).attr('y',y)
        });
        var scalefactor = 1;
        if (scale > 0 && scale <= 1.1) {
          console.log('US');
          scalefactor = 1;
        }
        else if(scale > 1 && scale <= 2.56) {
          console.log('region');
          scalefactor = 2;
        }
        else if(scale > 2.57 && scale <= 4.096) {
          console.log('state');
          scalefactor = 3;
        }
        else if(scale > 4.097 && scale <= 6.554) {
          console.log('city');
          scalefactor = 4;
        }
        else if(scale > 6.555 && scale <= 8) {
          console.log('county');
          scalefactor = 5;
        }

        console.log(scalefactor + ' scale');

      }

    });
    return map;
  }

  //THIS IS THE MODEL ---------------------------------
  function TaskListViewModel() {
    var self = this;
    self.type =  ko.observable("2014 Best Driver Rank");
    self.id =  ko.observable("topCity");
    self.byline =  ko.observable("Explore the cities with the fewest auto collisions");
    self.locations = ko.observableArray([]);
    self.map = setMap();
    self.currentActiveLocation = ko.observable({});

    self.popModal = function(currentLocation) {
            $('.modal').addClass('show-modal');
            self.currentActiveLocation(currentLocation.location());
         }
    
    $.getJSON("/assets/best-driver.json", function(allData) {
        var mappedTasks = $.map(allData, function(item) { return new Locations(item) });
        self.locations(mappedTasks);
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
       $('.jvectormap-container .textSVG text').remove();

    });


    //UI EVENTS
    $( "#tabs .tab" ).on('click', function(e) {
      var id = $(e.currentTarget).attr('id'),
          sectionColor = $(e.currentTarget).data('color'),
          type = $(e.currentTarget).data('type'),
          byline = $(e.currentTarget).data('byline');

      $( "#tabs .tab" ).removeClass('selected');
      $(e.currentTarget).addClass('selected');

      $('.tabContent .sliderContainer #slider').removeClass('disabled');
      if (!$('#tabs #topCity').hasClass('selected')){
        $('.tabContent .sliderContainer #slider').addClass('disabled');
      }

      //change the color on the list items
      $('.tabContentOther .toplistings ul li svg path').css('fill', sectionColor);
      //$('.headingContainer .icon').removeClass().addClass('icon').addClass(id);
      model.viewModel.type(type);
      model.viewModel.id(id);
      model.viewModel.byline(byline);

      model.viewModel.color = sectionColor;
      filterLocations(type);

      for (var i = 0; i < 11; i++) {
       model.viewModel.map.setSelectedMarkers(i);
      };
    
    });

  

});





