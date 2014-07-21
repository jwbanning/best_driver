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

    var markers = [];
    for (var i = 0; i < data.length; i++) {
      // newMarkers.push(data[i].Lat, data[i].Long);
      markers.push({'latLng': [data[i].Lat, data[i].Lon], 'name': data[i].City +", " + data[i].State});
    }

    var regionStyling = {initial: {fill: '#e8e8e8'},hover: {fill: "#666"}};
    // var markers = [
    //       [61.18, -149.53],
    //       [21.18, -157.49],
    //       {latLng: [40.66, -73.56], name: 'New York City', style: {r: 8, fill: 'yellow'}},
    //       {latLng: [41.52, -87.37], style: {fill: 'red', r: 10}}
    //     ],
    //     values1 = [1, 2, 3, 4],
    //     values2 = [1, 2, 3, 4];

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
        markers: markers,
        regionsSelectable: false,
        markersSelectable: true,
        markersSelectableOne: true,
        // selectedRegions: JSON.parse( window.localStorage.getItem('jvectormap-selected-regions') || '[]' ),
        // selectedMarkers: JSON.parse( window.localStorage.getItem('jvectormap-selected-markers') || '[]' ),

        onMarkerLabelShow: function(event, label, index){
          label.html(label.html()+' (modified marker)');
        },
        onMarkerOver: function(event, index){
          console.log('marker-over', index);
        },
        onMarkerOut: function(event, index){
          console.log('marker-out', index);
        },
        onMarkerClick: function(event, index){
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
        },
        onRegionOver: function(event, code){
          console.log('region-over', code, map.getRegionName(code));
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
    });
  });
});