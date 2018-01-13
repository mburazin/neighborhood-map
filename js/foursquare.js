(function() {

  var foursquareApiURL = "https://api.foursquare.com/v2/venues/"
  var clientId = "TDZHZUVYDMCLKMHM2MES2DGMGWWFKWJFNPXF1SJI51R2WD4L";
  var clientSecret = "QHVCNGMUAR5LAUA4P2LKECJAECJE51OTHBYVJFVY2U23DFO0";
  var callback = null;
  var locationTitle = "";
  var self = this;

  function getLocationInfo(locTitle, location, callback) {
    var queryURL = _getVenueSearchURL(locTitle, location);
    self.callback = callback;
    self.locationTitle = locTitle;
    $.getJSON(queryURL, _receivedVenueData)
      .fail(function() {
        alert("Failed getting location info from Foursquare! No connection?");
      });;

    return;
  }

  function _getVenueSearchURL(locTitle, location) {
    var queryURL = foursquareApiURL + "search";
    queryURL += "?ll=" + location.lat + "," + location.lng;
    queryURL += "&query=" + locTitle;
    queryURL += "&intent=match";
    queryURL += "&v=20180106&client_id=" + clientId + "&client_secret=" + clientSecret;
    return encodeURI(queryURL);
  }

  function _receivedVenueData(data) {
    var venue = data.response.venues[0];
    if (venue) {
      var venueURL = _getVenueDetailsURL(venue.id);
      $.getJSON(venueURL, _receivedVenueDetails)
        .fail(function() {
          alert("Failed getting location info from Foursquare! No connection?");
        });
    }
  }

  function _getVenueDetailsURL(venueId) {
    var venueURL = foursquareApiURL + venueId;
    venueURL += "?v=20180106&client_id=" + clientId + "&client_secret=" + clientSecret;

    return encodeURI(venueURL);
  }

  function _receivedVenueDetails(details) {
    var venue = details.response.venue
    var cbDetails = {};
    cbDetails.categoryName = venue.categories[0].name;
    cbDetails.phone = venue.contact.formattedPhone;
    cbDetails.locationTitle = self.locationTitle;
    cbDetails.location = venue.location;
    cbDetails.name = venue.name;
    cbDetails.url = venue.url;
    cbDetails.hours = venue.hours;
    cbDetails.photos = venue.photos;
    self.callback(cbDetails);
  }

  window.Foursquare = {
    // init: init,
    getLocationInfo: getLocationInfo
  }
}
)();
