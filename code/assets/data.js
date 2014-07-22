$(document).ready(function() {
  function Task(data) {
    this.location = ko.observable(data);
  }

  function formatMarkers(markers) {
   var markers = [];
    for (var i = 0; i < model.viewModel.tasks().length; i++) {
      markers.push({'latLng': [model.viewModel.tasks()[i].location().Lat, model.viewModel.tasks()[i].location().Lon], 'name': model.viewModel.tasks()[i].location().City +", " + model.viewModel.tasks()[i].location().State});
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

  function TaskListViewModel() {
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.map = setMap();
    
    $.getJSON("/assets/best-driver.json", function(allData) {
        var mappedTasks = $.map(allData, function(item) { return new Task(item) });
        self.tasks(mappedTasks);
    });  
  }

    //expose the model and bind
    model = { viewModel: new TaskListViewModel() };
    ko.applyBindings(model.viewModel);


    //Subscribe to the model to listen for changes and update map markers
    model.viewModel.tasks.subscribe(function(newValue) {
      var markers = formatMarkers(newValue);
      model.viewModel.map.addMarkers(markers);
    });





    //UI EVENTS
    $( "#tabs .tab" ).on('click', function(e) {
      var id = $(e.currentTarget).attr('id'),
          type = $(e.currentTarget).data('type');
      $( "#tabs .tab" ).removeClass('selected');
      $(e.currentTarget).addClass('selected');
    });

});





