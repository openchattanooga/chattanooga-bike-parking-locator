(function() {
  'use strict';

  var spots = null,
    chattanoogaCoords = [35.0456, -85.2672],
    grayMarker = L.AwesomeMarkers.icon({
      prefix: 'fa',
      icon: 'user',
      markerColor: 'gray'
    }),
    greenMarker = L.AwesomeMarkers.icon({
      prefix: 'fa',
      icon: 'check',
      markerColor: 'green'
    }),
    redMarker = L.AwesomeMarkers.icon({
      prefix: 'fa',
      icon: 'times',
      markerColor: 'red'
    }),
    map = L.map('map');

  map.on('load', function() {
    $.getJSON('https://data.chattlibrary.org/resource/bicycle-parking-locations-in-the-city-of-chattanooga.json', function(data) {
      var points = [{
        type: 'FeatureCollection',
        features: $.map(data, function(v) {
          return {
            'type': 'Feature',
            'properties': {
              'name': v.name,
              'capacity': v.capacity,
              'description': v.description,
              'type': v.type
            },
            'geometry': {
              'type': 'Point',
              /*jshint camelcase: false */
              'coordinates': [v.location_1.longitude, v.location_1.latitude]
            }
          };
        })
      }];

      spots = L.geoJson(points, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: redMarker});
        }
      });

      spots.addTo(map);

    });
  });

  map.setView(chattanoogaCoords, 18);

  var centerMarker = L.marker(chattanoogaCoords, {icon: grayMarker});

  var layer = new L.StamenTileLayer('toner');
  map.addLayer(layer);

  centerMarker.addTo(map);

  function showMap(position) {
    var coords = new L.LatLng(position.coords.latitude, position.coords.longitude),
      nearest = leafletKnn(spots).nearest(coords, 5),
      $entries = $('#entries');

    centerMarker.setLatLng(coords);
    map.setView(coords);
    $entries.html('');
    $.each(nearest, function(i, v) {
      var p = v.layer.feature.properties,
        name = p.name === undefined ? '?' : p.name,
        type = p.type === undefined ? '?' : p.type,
        capacity = p.capacity === undefined ? '?' : p.capacity;
      v.layer.setIcon(greenMarker);
      $entries.append('<tr><td>' + name + '</td><td>' + type + '</td><td>' + capacity + '</td></tr>');
    });
    
  }

  function getLocation() {
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(showMap);
    } else {
      // fallback with something..
    }
  }

  setInterval(getLocation, 1000);

})();
