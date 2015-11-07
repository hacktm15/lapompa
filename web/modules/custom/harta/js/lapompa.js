Drupal.harta = {};
Drupal.harta.initMap = function() {
  "use strict";
  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(45,21),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    styles:  [ { "featureType": "water", "elementType": "all", "stylers": [ { "hue": "#7fc8ed" }, { "saturation": 55 }, { "lightness": -6 }, { "visibility": "on" } ] }, { "featureType": "water", "elementType": "labels", "stylers": [ { "hue": "#7fc8ed" }, { "saturation": 55 }, { "lightness": -6 }, { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "hue": "#83cead" }, { "saturation": 1 }, { "lightness": -15 }, { "visibility": "on" } ] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "hue": "#f3f4f4" }, { "saturation": -84 }, { "lightness": 59 }, { "visibility": "on" } ] }, { "featureType": "landscape", "elementType": "labels", "stylers": [ { "hue": "#ffffff" }, { "saturation": -100 }, { "lightness": 100 }, { "visibility": "off" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "hue": "#ffffff" }, { "saturation": -100 }, { "lightness": 100 }, { "visibility": "on" } ] }, { "featureType": "road", "elementType": "labels", "stylers": [ { "hue": "#bbbbbb" }, { "saturation": -100 }, { "lightness": 26 }, { "visibility": "on" } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "hue": "#ffcc00" }, { "saturation": 100 }, { "lightness": -35 }, { "visibility": "simplified" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "hue": "#ffcc00" }, { "saturation": 100 }, { "lightness": -22 }, { "visibility": "on" } ] }, { "featureType": "poi.school", "elementType": "all", "stylers": [ { "hue": "#d7e4e4" }, { "saturation": -60 }, { "lightness": 23 }, { "visibility": "on" } ] } ]  
  };
  var map = new google.maps.Map( document.getElementById( 'harta' ), mapOptions );
  
  jQuery( '#harta' ).append('<input id="cauta-locatie" type="text" placeholder="Unde esti?" />');
  var location_field = document.getElementById('cauta-locatie');

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(location_field);
  var autocomplete = new google.maps.places.Autocomplete(location_field);
  autocomplete.bindTo( 'bounds', map );

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

  });
}; 
