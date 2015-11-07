Drupal.harta = {};

Drupal.harta.getUrlParameter = function getUrlParameter(sParam) {
  return document.location.pathname.replace( '/', ' ' ).trim();    
};

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
  var autocomplete = new google.maps.places.SearchBox(location_field);
  autocomplete.bindTo( 'bounds', map );

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

  });

  var url_location = Drupal.harta.getUrlParameter( 'location' );
  if( url_location != '' ) {
	jQuery.get( 'https://maps.googleapis.com/maps/api/geocode/json?address=' + url_location, {}, function( data ){ 
	  var bounds = new google.maps.LatLngBounds();
          var geometry_bounds = data.results[0].geometry.bounds;
          bounds.extend( new google.maps.LatLng( geometry_bounds.northeast.lat, geometry_bounds.northeast.lng ) );
          bounds.extend( new google.maps.LatLng( geometry_bounds.southwest.lat, geometry_bounds.southwest.lng ) );
          map.fitBounds(bounds);
          jQuery( location_field ).val( data.results[0].formatted_address );
        });
  } else {
    jQuery( location_field ).addClass('huge');
  }

}; 
