var map;

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

// Google Maps API callback
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 59.3293, lng: 18.0686},
    zoom: 13
  });
}

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

  locations.forEach(function(location) {
    self.locationList.push(new Location(location));
  });

  // filterList triggers on each keyup event on the input field
  this.filterList = function() {
    this.locationList.removeAll();
    locations.forEach(function(location) {
      if(location.title.startsWith(self.searchQuery())) {
        self.locationList.push(new Location(location));
      }
    });
  };
};

ko.applyBindings(new ViewModel());
