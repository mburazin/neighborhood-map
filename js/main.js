/* Model used for Knockout JS */
var Location = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
};

/* ViewModel used for Knockout JS */
var ViewModel = function() {
  var self = this;
  this.locationList = ko.observableArray();
  this.locMenuShown = ko.observable(false);
  this.searchQuery = ko.observable();
  this.googleMapApiLoaded = ko.observable();
  this.googleMapApiLoaded(false);
  this.foursquareInfoReceived = ko.observable();
  this.foursquareInfoReceived(false);

  this.foursquareLocationInfo = {};

  // add locations to the observable array
  locations.forEach(function(location) {
    self.locationList.push(new Location(location));
  });

  // filterList triggers on each keyup event on the input field
  this.filterList = function() {
    this.locationList.removeAll();
    locations.forEach(function(location) {
      var title = location.title.toLowerCase();
      var searchQuery = self.searchQuery().toLowerCase();

      if(title.startsWith(searchQuery)) {
        self.locationList.push(new Location(location));
      }
      GoogleMap.filterLocations(self.searchQuery());
    });
  };

  // triggered when the hamburger icon is clicked
  this.showLocationsMenu = function() {
    this.locMenuShown(true);
    console.log(this.locMenuShown());
  };

  // triggered when the close menu icon (x) is clicked
  this.hideLocationsMenu = function() {
    this.locMenuShown(false);
    console.log(this.locMenuShown());
  };

  // when Google Maps API is downloaded, change the googleMapApiLoaded observable
  this.initMap = function() {
    this.googleMapApiLoaded(true);
  };

  // subscribe function to be triggered when Google Maps API is loaded
  this.googleMapApiLoaded.subscribe(function(isLoaded) {
    if (isLoaded) {
      GoogleMap.init(locations);
    }
  });

  // this callback is performed from googleMap object signalling to select a
  // specific location after the user has clicked on it on the map
  this.selectLocationByName = function(name) {
    // store found location. If not found, location is undefined
    var location = self.locationList().find(function(element) {
      if (element.title() == name) {
        return true;
      }
      return false;
    });

    if (location) {
      self.selectLocation(location);
    } else {
      alert("Unknown location. Critical error!");
    }
  };

  // triggered when the location list item is clicked
  this.selectLocation = function(location) {
    Foursquare.getLocationInfo(location.title(), location.location(), self.fetchedFoursquareInfo);
  };

  // this callback is performed after Foursquare answers to the getLocationInfo query
  this.fetchedFoursquareInfo = function(locationInfo) {
    self.foursquareLocationInfo = locationInfo;
    self.foursquareInfoReceived(true);
  };

  // the subscribed function gets called when the foursquareInfoReceived flag is set
  this.foursquareInfoReceived.subscribe(function(isReceived) {
    if (isReceived) {
      // console.log(self.foursquareLocationInfo);
      GoogleMap.selectLocation(self.foursquareLocationInfo);
      self.foursquareLocationInfo = {};
      self.foursquareInfoReceived(false);
    }
  });
};

// Create new Knockout JS ViewModel
viewModel = new ViewModel();
ko.applyBindings(viewModel);

// Called as soon as Google Map API script loads
function initMap() {
  viewModel.initMap();
}

// alert error if google maps api isn't reachable
googleMapsApiError = function() {
  alert("Google Maps API not reachable! Could not load map!");
};
