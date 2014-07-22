$(document).ready(function() {
  function Locations(data) {
    this.location = ko.observable(data);
  }

  function filterLocations(type) {
    var clonedArray = jQuery.extend([], model.viewModel.locations());
     var m = clonedArray.sort(function(left, right) { 
        return left.location()[type] == right.location()[type] ? 0 : (left.location()[type] < right.location()[type] ? -1 : 1); 
      });
   model.viewModel.locations(m);
  }

  function formatMarkers(markerList, type) {
   var markers = [];
    for (var i = 0; i < model.viewModel.locations().length; i++) {
      markers.push({'style': {fill: model.viewModel.color}, 'latLng': [model.viewModel.locations()[i].location().Lat, model.viewModel.locations()[i].location().Lon], 'name': model.viewModel.locations()[i].location().City +", " + model.viewModel.locations()[i].location().State});
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
          fill: 'blue'
        },
      },
      markers: [],
      regionsSelectable: false,
      markersSelectable: true,
      markersSelectableOne: true,

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
        alert('show marker');

        console.log('marker-click', index);
      },
      onMarkerSelected: function(event, index, isSelected, selectedMarkers){
        console.log('marker-select', index, isSelected, selectedMarkers);
        if (window.localStorage) {
          window.localStorage.setItem(
            'jvectormap-selected-markers',
            JSON.stringify(selectedMarkers)
          );
        }
      },
      onRegionLabelShow: function(event, label, code){
        label.html(label.html()+' (modified)');
        return false;
      },
      onRegionOver: function(event, code){
        console.log('region-over', code, map.getRegionName(code));
        return false;
      },
      onRegionOut: function(event, code){
        console.log('region-out', code);
      },
      onRegionClick: function(event, code){
        console.log('region-click', code);
      },
      onRegionSelected: function(event, code, isSelected, selectedRegions){
        console.log('region-select', code, isSelected, selectedRegions);
        if (window.localStorage) {
          window.localStorage.setItem(
            'jvectormap-selected-regions',
            JSON.stringify(selectedRegions)
          );
        }
      },
      onViewportChange: function(e, scale, transX, transY){
          console.log('viewportChange', scale, transX, transY);
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

    self.newTaskText = ko.observable();
    self.map = setMap();
    
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
    });


    //UI EVENTS
    $( "#tabs .tab" ).on('click', function(e) {
      var id = $(e.currentTarget).attr('id'),
          sectionColor = $(e.currentTarget).data('color'),
          type = $(e.currentTarget).data('type');
          byline = $(e.currentTarget).data('byline');

      $( "#tabs .tab" ).removeClass('selected');
      $(e.currentTarget).addClass('selected');
      //change the color on the list items
      $('.tabContentOther .toplistings ul li svg path').css('fill', sectionColor);
      $('.headingContainer .icon').removeClass().addClass('icon').addClass(id);
      model.viewModel.type = type;
      model.viewModel.id = id;
      model.viewModel.byline = byline;
      model.viewModel.color = sectionColor;
      //model.viewModel.map.setSelectedMarkers();
      filterLocations(type);
    });

});





