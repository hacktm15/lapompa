(function($){
  "use strict";

  Drupal.behaviors.harta = {
    attach: function(context, settings) {
      $('#harta').once('map-initialized').each(function(){
        Drupal.harta.initMap();
      });
    }
  };

  Drupal.harta = {};
  Drupal.harta.markers = {};

  Drupal.harta.createMarker = function createMarker(pin) {
    var marker = new MarkerWithLabel({
      position: new google.maps.LatLng(pin.lat, pin.lon),
      map: Drupal.harta.map,
      icon: '/themes/custom/lapompa/pin.png',
      draggable: false,
      raiseOnDrag: false,
      labelContent: pin.pret,
      labelAnchor: new google.maps.Point(35, 50),
      labelClass: "mapIconLabel", // the CSS class for the label
      labelInBackground: false,
      idBenzinarie: pin.id
    });
    Drupal.harta.markers[pin.id] = marker;
    // Add ajax call for full view/edit.
  }

  Drupal.harta.initMap = function() {
    var mapOptions = {
      zoom: 11,
      center: new google.maps.LatLng(45, 21),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [{
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"hue": "#7fc8ed"}, {"saturation": 55}, {"lightness": -6}, {"visibility": "on"}]
      }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{"hue": "#7fc8ed"}, {"saturation": 55}, {"lightness": -6}, {"visibility": "off"}]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"hue": "#83cead"}, {"saturation": 1}, {"lightness": -15}, {"visibility": "on"}]
      }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{"hue": "#f3f4f4"}, {"saturation": -84}, {"lightness": 59}, {"visibility": "on"}]
      }, {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [{"hue": "#ffffff"}, {"saturation": -100}, {"lightness": 100}, {"visibility": "off"}]
      }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{"hue": "#ffffff"}, {"saturation": -100}, {"lightness": 100}, {"visibility": "on"}]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{"hue": "#bbbbbb"}, {"saturation": -100}, {"lightness": 26}, {"visibility": "on"}]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{"hue": "#ffcc00"}, {"saturation": 100}, {"lightness": -35}, {"visibility": "simplified"}]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{"hue": "#ffcc00"}, {"saturation": 100}, {"lightness": -22}, {"visibility": "on"}]
      }, {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [{"hue": "#d7e4e4"}, {"saturation": -60}, {"lightness": 23}, {"visibility": "on"}]
      }]
    };
    Drupal.harta.map = new google.maps.Map(document.getElementById('harta'), mapOptions);

    // Attach event for markers request. Daca zoom-ul e prea mare nu se face request.
    google.maps.event.addListener(Drupal.harta.map, 'dragend', function(){
      Drupal.harta.refreshMarkers();
    });
    google.maps.event.addListener(Drupal.harta.map, 'zoom_changed', function(){
      Drupal.harta.refreshMarkers();
    });
    Drupal.harta.createMarker('3,78', Drupal.harta.map, 45, 21);

    $( '#harta' ).append('<input id="cauta-locatie" type="text" placeholder="Unde esti?" /><div id="overlay-harta"></div>');

    Drupal.harta.adaugaLocation();

    Drupal.harta.resolve_url_location();

    window.addEventListener('popstate', function(e) {
      if (e.state.location) {
        Drupal.harta.geocode(e.state.location);
      }
    });
  }

  Drupal.harta.refreshMarkers = function() {
    if (Drupal.harta.data_request) {
      Drupal.harta.data_request.abort();
    }
    var param = [
      Drupal.harta.map.getBounds().getNorthEast().lat(),
      Drupal.harta.map.getBounds().getNorthEast().lng(),
      Drupal.harta.map.getBounds().getSouthWest().lat(),
      Drupal.harta.map.getBounds().getSouthWest().lng()
    ];

    Drupal.harta.data_request = $.ajax({
      url: '/harta/listing/' + param.join('/'),
      dataType: 'json',
      success: function(data){
        delete Drupal.harta.data_request;

        if (data && data.pins) {
          Drupal.harta.removeMarkers(data.pins);
          Drupal.harta.addMarkers(data.pins);
        }
        if (data && data.listing) {
          $('#wrapper-listing-benzinarii').html(data.listing);
        }
      }
    });
  }

  Drupal.harta.removeMarkers = function(pins) {
    var key, marker;
    for (key in Drupal.harta.markers) {
      if (Drupal.harta.markers.hasOwnProperty(key)){
        marker = Drupal.harta.markers[key];
        if (!pins.hasOwnProperty(key)) {
          marker.setMap(null);
          delete Drupal.harta.markers[key];
        }
      }
    }
  }

  Drupal.harta.addMarkers = function (pins) {
    var key, pin;
    for (key in pins) {
      if (pins.hasOwnProperty(key)){
        pin = pins[key];
        if (!Drupal.harta.markers.hasOwnProperty(pin.id)) {
          Drupal.harta.createMarker(pin);
        }
      }
    }
  }

  Drupal.harta.resolve_url_location = function() {
    var url_location = document.location.pathname.replace( '/', ' ' ).trim();

    if( url_location != '' ) {
      Drupal.harta.geocode(url_location);
    } else {
      // Make the location field huge.
      Drupal.harta.location_field.addClass('huge');
      Drupal.harta.overlay.removeClass('hidden');

      // Focus the location field
      google.maps.event.addListenerOnce(Drupal.harta.map, 'idle', function(){
          Drupal.harta.location_field.focus();
      });
    }

  }

  Drupal.harta.adaugaLocation = function() {
    var location_field = document.getElementById('cauta-locatie');
    Drupal.harta.location_field = $( location_field );
    Drupal.harta.overlay = $('#overlay-harta');

    var autocomplete = new google.maps.places.Autocomplete(location_field);
    autocomplete.bindTo( 'bounds', Drupal.harta.map );
    autocomplete.addListener('place_changed', function(e) {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        Drupal.harta.map.fitBounds(place.geometry.viewport);
      } else {
        Drupal.harta.map.setCenter(place.geometry.location);
        Drupal.harta.map.setZoom(17);
      }

      Drupal.harta.location_field.removeClass('huge');
      Drupal.harta.overlay.addClass('hidden');
      if (!!(window.history && history.pushState)) {
        history.pushState({location: Drupal.harta.location_field.val()}, null, '/' + Drupal.harta.location_field.val().trim().replace(/,/g, '').replace(/ +/g, '/'));
      }
    });
  }

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
      $.get( 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location, {}, function( data ){
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
    Drupal.harta.map.fitBounds(bounds);
    Drupal.harta.location_field.val( results[0].formatted_address );
    Drupal.harta.overlay.addClass('hidden');
  }

})(jQuery)