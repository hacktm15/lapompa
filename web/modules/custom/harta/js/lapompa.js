Drupal.harta = {};

Drupal.behaviors.harta = {
  attach: function(context, settings) {
   jQuery('#harta').once('map-initialized').each(function(){
      Drupal.harta.initMap();
    });
  }
};

Drupal.harta.getUrlParameter = function getUrlParameter(sParam) {
  return document.location.pathname.replace( '/', ' ' ).trim();    
};

Drupal.harta.createMarker = function createMarker(number, currentMap, lat, lng) {

   var marker = new MarkerWithLabel({
       position: new google.maps.LatLng(lat, lng),
                 map: currentMap,
                 icon: 'http://lapompa.in/themes/custom/lapompa/pin.png',
                 draggable: false,
                 raiseOnDrag: false,
                 labelContent: number,
                 labelAnchor: new google.maps.Point(35, 50),
                 labelClass: "mapIconLabel", // the CSS class for the label
                 labelInBackground: false
      });
   }

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

  Drupal.harta.createMarker('3,78', map, 45, 21);
  
  jQuery( '#harta' ).append('<input id="cauta-locatie" type="text" placeholder="Unde esti?" /><div id="overlay-harta"></div>');

  var location_field = document.getElementById('cauta-locatie'); 
  var $location_field = jQuery( location_field );
  var $location_field_overlay = jQuery('#overlay-harta');
  var autocomplete = new google.maps.places.Autocomplete(location_field);
  autocomplete.bindTo( 'bounds', map );

  autocomplete.addListener('place_changed', function(e) {
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
    $location_field.removeClass('huge');
    $location_field_overlay.addClass('hidden');
    if (!!(window.history && history.pushState)) {
      history.pushState({location: $location_field.val()}, null, '/' + $location_field.val().trim().replace(/,/g, '').replace(/ +/g, '/'));
    }
  });

  Drupal.harta.storageAvailable = function (type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  Drupal.harta.geocode = function (location) {
    var storage, results;
    if (Drupal.harta.storageAvailable('localStorage')) {
      storage = localStorage;
    }
    else if (Drupal.harta.storageAvailable('sessionStorage')) {
      storage = sessionStorage;
    }
    
    if (storage && (results = storage.getItem(location))) {
      Drupal.harta.newLocation(JSON.parse(results));
    }
    else {
        jQuery.get( 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location, {}, function( data ){
          if (data.status != 'OK') {
            return;
          }
          if (storage) {
            storage.setItem(location, JSON.stringify(data.results));
          }
          Drupal.harta.newLocation(data.results);
        });    
    }
  }

  Drupal.harta.newLocation = function(results) {
    var bounds = new google.maps.LatLngBounds();
    var geometry_bounds = results[0].geometry.bounds;
    bounds.extend( new google.maps.LatLng( geometry_bounds.northeast.lat, geometry_bounds.northeast.lng ) );
    bounds.extend( new google.maps.LatLng( geometry_bounds.southwest.lat, geometry_bounds.southwest.lng ) );
    map.fitBounds(bounds);
    $location_field.val( results[0].formatted_address );
    $location_field_overlay.addClass('hidden');
  }

  window.addEventListener('popstate', function(e) {
    if (e.state.location) {
      Drupal.harta.geocode(e.state.location);
      return;
      jQuery.get( 'https://maps.googleapis.com/maps/api/geocode/json?address=' + e.state.location, {}, function( data ){
          var bounds = new google.maps.LatLngBounds();
          var geometry_bounds = data.results[0].geometry.bounds;
          bounds.extend( new google.maps.LatLng( geometry_bounds.northeast.lat, geometry_bounds.northeast.lng ) );
          bounds.extend( new google.maps.LatLng( geometry_bounds.southwest.lat, geometry_bounds.southwest.lng ) );
          map.fitBounds(bounds);
          $location_field.val( data.results[0].formatted_address );
          $location_field_overlay.addClass('hidden');
        });
    }
  });

  var url_location = Drupal.harta.getUrlParameter( 'location' );
  if( url_location != '' ) {
    Drupal.harta.geocode(url_location);
/*	jQuery.get( 'https://maps.googleapis.com/maps/api/geocode/json?address=' + url_location, {}, function( data ){ 
	  var bounds = new google.maps.LatLngBounds();
          var geometry_bounds = data.results[0].geometry.bounds;
          bounds.extend( new google.maps.LatLng( geometry_bounds.northeast.lat, geometry_bounds.northeast.lng ) );
          bounds.extend( new google.maps.LatLng( geometry_bounds.southwest.lat, geometry_bounds.southwest.lng ) );
          map.fitBounds(bounds);
          $location_field.val( data.results[0].formatted_address );
          $location_field_overlay.addClass('hidden');
        });*/
  } else {
    $location_field.addClass('huge');
    $location_field_overlay.removeClass('hidden');
  }

  google.maps.event.addListenerOnce(map, 'idle', function(){
    if( url_location == '' )
      $location_field.focus();
  });

}; 
