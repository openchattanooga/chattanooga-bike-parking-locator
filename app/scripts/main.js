(function() {
  'use strict';

  var spots = null,
    chattanoogaCoords = [35.0456, -85.2672],
    grayMarker = L.AwesomeMarkers.icon({
      icon: 'user',
      markerColor: 'gray'
    }),
    greenMarker = L.AwesomeMarkers.icon({
      icon: 'ok',
      markerColor: 'green'
    }),
    redMarker = L.AwesomeMarkers.icon({
      icon: 'remove',
      markerColor: 'red'
    }),
    map = L.map('map');

  map.on('load', function() {
    $.getJSON('scripts/data/bicycle_parking.geojson', function(data) {
      spots = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: redMarker});
        }
      });
      spots.addTo(map);
    });
  });

  map.setView(chattanoogaCoords, 18);

  var centerMarker = L.marker(chattanoogaCoords, {icon: grayMarker});

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18
    }).addTo(map);

  centerMarker.addTo(map);

  function showMap(position) {
    var coords = new L.LatLng(position.coords.latitude, position.coords.longitude),
      nearest = leafletKnn(spots).nearest(coords, 5),
      $entries = $('#entries');

    centerMarker.setLatLng(coords);
    map.setView(coords);
    $entries.html('');
    $.each(nearest, function(i, v) {
      v.layer.setIcon(greenMarker);
      var p = v.layer.feature.properties;
      $entries.append('<tr><td>' + p.Name + '</td><td>' + p.type + '</td><td>' + p.capacity + '</td></tr>');
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
