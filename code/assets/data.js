$(document).ready(function() {
  function Locations(data) {
    this.location = ko.observable(data);
  }

  function filterLocations(type) {
   if (type=='rainSnow') {
      var m;
      m = model.viewModel.locations().sort(function(left, right) { 
        return left.location()['2014 Rain & Snow'] == right.location()['2014 Rain & Snow'] ? 0 : (left.location()['2014 Rain & Snow'] < right.location()['2014 Rain & Snow'] ? -1 : 1) 
      });
      model.viewModel.locations(m);
   };
  }

  function formatMarkers(markerList, type) {
   var markers = [];
    for (var i = 0; i < model.viewModel.locations().length; i++) {
      markers.push({'latLng': [model.viewModel.locations()[i].location().Lat, model.viewModel.locations()[i].location().Lon], 'name': model.viewModel.locations()[i].location().City +", " + model.viewModel.locations()[i].location().State});
    }
    return markers;
  }

  function setMap() {
    var regionStyling = {initial: {fill: '#e8e8e8'},hover: {fill: "#666"}};
    var map = new jvm.WorldMap({
      container: $('.map'),
      map: 'us_aea_en',
      backgroundColor: '#fff',
      regionStyle:regionStyling,
      markerStyle: {
        initial: {
          fill: '#0096d6',
          stroke: '#0096d6'
        }
      },
      markers: [],
      regionsSelectable: false,
      markersSelectable: true,
      markersSelectableOne: true,
    });
    return map;
  }

  //THIS IS THE MODEL ---------------------------------
  function TaskListViewModel() {
    var self = this;
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
          type = $(e.currentTarget).data('type');
      $( "#tabs .tab" ).removeClass('selected');
      $(e.currentTarget).addClass('selected');
      filterLocations(type);
    });

});





