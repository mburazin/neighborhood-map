var locations = [
  {title: 'Giro pizzeria', location: {lat: 59.337016, lng: 18.062643}},
  {title: '800 Grader pizzeria', location : {lat: 59.342055, lng: 18.040991}},
  {title: 'Sempre espresso bar', location : {lat: 59.334869, lng: 18.072082}},
  {title: 'Bengans record store', location : {lat: 59.330199, lng: 18.065171}},
  {title: 'Johan & Nyström coffee shop', location : {lat: 59.328092, lng: 18.049147}},
  {title: 'Fotografiska museum', location : {lat: 59.317943, lng: 18.085914}},
  {title: 'Moderna museum of modern art', location : {lat: 59.326162, lng: 18.084539}},
  {title: 'Hermans vegetarian buffet', location : {lat: 59.317600, lng: 18.083989}},
  {title: 'NK Stockholm department store', location : {lat: 59.333135, lng: 18.069097}}
];

(function() {
  var map;
  var markers = [];
  var infoWindow;

  function init(locations) {
    // create a new map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 59.3293, lng: 18.0686},
      zoom: 13
    });
    var bounds = new google.maps.LatLngBounds();

    // Create a single infowindow to be used with all markers
    // only one can be opened at a time
    infoWindow = new google.maps.InfoWindow();

    // Create array of markers from all locations
    locations.forEach(function(location) {
      var marker = new google.maps.Marker({
        position: location.location,
        title: location.title,
        animation: google.maps.Animation.DROP
      });

      // assign place ID to marker.placeId
      _fetchPlaceId(marker);

      marker.addListener('click', function() {
        if (infoWindow.marker == this) {
          console.log("This infowindow already is on this marker!");
        } else {
          _showLocationInfo(this);
        }
      });

      markers.push(marker);

      bounds.extend(marker.position);
      map.fitBounds(bounds);
    });

    filterLocations();
  }

  // fetch unique place ID of which marker is pointing to and assign it
  // to marker.placeId
  function _fetchPlaceId(marker) {
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
      query: marker.title,
      location: marker.position
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // I feel lucky, consider first search result as correct
        marker.placeId = results[0].place_id;
      } else {
        alert("Error: Could not get selected place id");
      }
    });
  }

  // shows infoWindow on the specified marker with info about a place
  function _showLocationInfo(marker) {
    var service = new google.maps.places.PlacesService(map);

    // close the existing infowindow
    if (infoWindow.marker != null) {
      _closeInfoWindow(infoWindow);
    }

    if (marker.placeId != null) {
      service.getDetails({
          placeId: marker.placeId
        }, function(place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            var placeDetailsHtml = _formatPlaceDetails(place);
            infoWindow.setContent(placeDetailsHtml);
            infoWindow.marker = marker;
            infoWindow.open(map, marker);
            _animateMarker(marker);

            // remove any old listeners
            google.maps.event.clearListeners(infoWindow, 'closeclick');
            // Make sure the marker property is cleared if the infowindow is closed.
            infoWindow.addListener('closeclick', function() {
              _closeInfoWindow(infoWindow);
            });
          } else {
            alert("Could not get location info from Google Maps API");
          }
        }
      );
    }

  }

  function _closeInfoWindow(infoWindow) {
    _stopAnimateMarker(infoWindow.marker);
    infoWindow.setContent('');
    infoWindow.close();
    infoWindow.marker = null;
  }

  function _formatPlaceDetails(place) {
    var innerHTML = '<div>';
    if (place.name) {
      innerHTML += '<strong>' + place.name + '</strong>';
    }
    if (place.formatted_address) {
      innerHTML += '<br>' + place.formatted_address;
    }
    if (place.formatted_phone_number) {
      innerHTML += '<br>' + place.formatted_phone_number;
    }
    if (place.opening_hours) {
      innerHTML += '<br><br><strong>Hours:</strong><br>' +
          place.opening_hours.weekday_text[0] + '<br>' +
          place.opening_hours.weekday_text[1] + '<br>' +
          place.opening_hours.weekday_text[2] + '<br>' +
          place.opening_hours.weekday_text[3] + '<br>' +
          place.opening_hours.weekday_text[4] + '<br>' +
          place.opening_hours.weekday_text[5] + '<br>' +
          place.opening_hours.weekday_text[6];
    }
    if (place.photos) {
      innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
          {maxHeight: 100, maxWidth: 200}) + '">';
    }
    innerHTML += '</div>';

    return innerHTML;
  }

  function _animateMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }

  function _stopAnimateMarker(marker) {
    marker.setAnimation(null);
  }

  function filterLocations(filter = "") {
    // Display only the markers corresponding to the applied filter
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getTitle().startsWith(filter)) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
  }

  function selectLocation(location) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getTitle() == location) {
        _showLocationInfo(markers[i]);
        break;
      }
    }
  }

  window.GoogleMap = {
    init: init,
    filterLocations: filterLocations,
    selectLocation: selectLocation
  };
})();

/* Model */
var Location = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
};

/* ViewModel */
var ViewModel = function() {
  var self = this;
  this.locationList = ko.observableArray();
  this.searchQuery = ko.observable();
  this.googleMapApiLoaded = ko.observable();
  this.googleMapApiLoaded(false);

  // add locations to the observable array
  locations.forEach(function(location) {
    self.locationList.push(new Location(location));
  });

  // filterList triggers on each keyup event on the input field
  this.filterList = function() {
    this.locationList.removeAll();
    locations.forEach(function(location) {
      if(location.title.startsWith(self.searchQuery())) {
        self.locationList.push(new Location(location));
        GoogleMap.filterLocations(self.searchQuery());
      }
    });
  };

  // triggered when the location list item is clicked
  this.selectLocation = function(location) {
    console.log("clicked List Item: " + location.title());
    GoogleMap.selectLocation(location.title());
  };

  // when Google Maps API is downloaded, change the googleMapApiLoaded observable
  this.initMap = function() {
    this.googleMapApiLoaded(true);
  };

  // subscribe function to be loaded when Google Maps API is loaded
  this.googleMapApiLoaded.subscribe(function(isLoaded) {
    if (isLoaded) {
      GoogleMap.init(locations);
    }
  });
};

viewModel = new ViewModel();
ko.applyBindings(viewModel);
