$(document).ready(function() {
  $.getJSON('http://localhost/assets/best-driver.json', function(data){
   
  });
  $(function(){
    var regionStyling = {initial: {fill: '#e8e8e8'},hover: {fill: "#666"}};
    var markers = [
          [61.18, -149.53],
          [21.18, -157.49],
          {latLng: [40.66, -73.56], name: 'New York City', style: {r: 8, fill: 'yellow'}},
          {latLng: [41.52, -87.37], style: {fill: 'red', r: 10}}
        ],
        values1 = [1, 2, 3, 4],
        values2 = [1, 2, 3, 4];

    var map = new jvm.WorldMap({
      container: $('.map'),
      map: 'us_aea_en',
      markers: markers,
      backgroundColor: '#fff',
      regionStyle:regionStyling,
      series: {
        markers: [{
          attribute: 'fill',
          scale: ['#C8EEFF', '#0071A4'],
          normalizeFunction: 'polynomial',
          values: values1
        },{
          attribute: 'r',
          scale: [5, 20],
          normalizeFunction: 'polynomial',
          values: values2
        }],
        regions: [{
          scale: {
            red: '#ccc',
            blue: '#999'
          },
          attribute: 'fill',
          normalizeFunction: 'polynomial',
          values: {
            "US-KS": 'red',
            "US-MO": 'red',
            "US-IA": 'blue',
            "US-NE": 'blue'
          }
        },{
          values: {
            "US-NY": 'blue',
            "US-FL": 'blue',
          },
          attribute: 'fill'
        }]
      },
      regionsSelectable: true,
      markersSelectable: true,
      markersSelectableOne: true,
      selectedRegions: JSON.parse( window.localStorage.getItem('jvectormap-selected-regions') || '[]' ),
      selectedMarkers: JSON.parse( window.localStorage.getItem('jvectormap-selected-markers') || '[]' ),

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