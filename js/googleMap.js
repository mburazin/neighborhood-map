(function() {
  var map;
  var markers = [];
  var infoWindow;
  var foursquareVenueCallback = null;

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
          viewModel.selectLocationByName(this.title);
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
  function _showLocationInfo(marker, foursquareInfo) {
    // close the existing infowindow
    if (infoWindow.marker != null) {
      _closeInfoWindow(infoWindow);
    }

    var locationInfoHtml = _formatLocationInfo(foursquareInfo);
    infoWindow.setContent(locationInfoHtml);
    infoWindow.marker = marker;
    infoWindow.open(map, marker);
    _animateMarker(marker);

    // remove any old listeners
    google.maps.event.clearListeners(infoWindow, 'closeclick');
    // Make sure the marker property is cleared if the infowindow is closed.
    infoWindow.addListener('closeclick', function() {
      _closeInfoWindow(infoWindow);
    });
  }

  // construct html shown in infoWindow related to the selected location
  function _formatLocationInfo(locationInfo) {
    var innerHTML = '<div>';
    if (locationInfo.name) {
      innerHTML += '<strong>' + locationInfo.name + '</strong>';
    }
    if (locationInfo.categoryName) {
      innerHTML += ' - <em>' + locationInfo.categoryName + '</em>';
    }
    var formattedAddress = locationInfo.location.formattedAddress;
    if (formattedAddress) {
      for (var i=0; i<formattedAddress.length; i++) {
        innerHTML += '<br>' + formattedAddress[i];
      }
    }
    if (locationInfo.phone) {
      innerHTML += '<br>' + locationInfo.phone;
    }
    var hours = locationInfo.hours;
    if (hours) {
      innerHTML += '<br><br><strong>' + hours.status + '</strong>';
      for (var i=0; i<hours.timeframes.length; i++) {
        innerHTML += '<br>' + hours.timeframes[i].days + ': ' + hours.timeframes[i].open[0].renderedTime;
      }
    }
    if (locationInfo.url) {
      innerHTML += '<br><br><a href="' + locationInfo.url + '">' + locationInfo.url + '</a>';
    }
    var photos = locationInfo.photos;
    if (photos && photos.count>0) {
      // take just the first photo
      innerHTML += '<br><br><img src="' + photos.groups[0].items[0].prefix + '300x200'
        + photos.groups[0].items[0].suffix + '">';
    }

    return innerHTML;
  }

  function _closeInfoWindow(infoWindow) {
    _stopAnimateMarker(infoWindow.marker);
    infoWindow.setContent('');
    infoWindow.close();
    infoWindow.marker = null;
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
      var titleLowerCase = markers[i].getTitle().toLowerCase();
      var filterLowerCase = filter.toLowerCase();
      if (titleLowerCase.startsWith(filterLowerCase)) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
  }

  function selectLocation(foursquareInfo) {
    var marker = _findMarker(foursquareInfo.locationTitle);
    if (marker) {
      _showLocationInfo(marker, foursquareInfo);
    }
  }

  function _findMarker(locationTitle) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getTitle() == locationTitle) {
        return markers[i];
      }
    }

    return null;
  }

  window.GoogleMap = {
    init: init,
    filterLocations: filterLocations,
    selectLocation: selectLocation
  };
})();
