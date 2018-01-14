(function() {

  // Base Foursquare URL data used for JSON request
  var foursquareApiURL = "https://api.foursquare.com/v2/venues/";
  var clientId = "TDZHZUVYDMCLKMHM2MES2DGMGWWFKWJFNPXF1SJI51R2WD4L";
  var clientSecret = "QHVCNGMUAR5LAUA4P2LKECJAECJE51OTHBYVJFVY2U23DFO0";

  var callback = null;
  var locationTitle = "";
  var self = this;

  // getLocationInfo fetches location specific information from Foursquare
  // "locTitle" is the name of the location to fetches
  // "location" is the object containing the coordinates of the location
  // "callback" is the function which gets called after the location is fetched
  // successfully from Foursquare
  function getLocationInfo(locTitle, location, callback) {
    var queryURL = _getVenueSearchURL(locTitle, location);
    self.callback = callback;
    self.locationTitle = locTitle;
    $.getJSON(queryURL, _receivedVenueData)
      .fail(function() {
        alert("Failed getting location info from Foursquare! No connection?");
      });

    return;
  }

  // construct the URL used to fetch location from Foursquare
  function _getVenueSearchURL(locTitle, location) {
    var queryURL = foursquareApiURL + "search";
    queryURL += "?ll=" + location.lat + "," + location.lng;
    queryURL += "&query=" + locTitle;
    queryURL += "&intent=match";
    queryURL += "&v=20180106&client_id=" + clientId + "&client_secret=" + clientSecret;
    return encodeURI(queryURL);
  }

  // private callback function that gets called after first fetch from Foursquare
  // which is used just to get the Foursquare "Venue ID"
  function _receivedVenueData(data) {
    // Get Venue ID from the reply
    var venue = data.response.venues[0];
    if (venue) {
      var venueURL = _getVenueDetailsURL(venue.id);
      // fetch details about venue using reeived venue ID
      $.getJSON(venueURL, _receivedVenueDetails)
        .fail(function() {
          alert("Failed getting location info from Foursquare! No connection?");
        });
    }
  }

  // construct the URL used to fetch more details about a specific location/venue
  // from Foursquare
  function _getVenueDetailsURL(venueId) {
    var venueURL = foursquareApiURL + venueId;
    venueURL += "?v=20180106&client_id=" + clientId + "&client_secret=" + clientSecret;

    return encodeURI(venueURL);
  }

  // private callback function that gets called after Foursquare venue (location)
  // details are fetched successfully
  function _receivedVenueDetails(details) {
    // store only wanted location details into cbDetails
    var venue = details.response.venue;
    var cbDetails = {};
    cbDetails.categoryName = venue.categories[0].name;
    cbDetails.phone = venue.contact.formattedPhone;
    cbDetails.locationTitle = self.locationTitle;
    cbDetails.location = venue.location;
    cbDetails.name = venue.name;
    cbDetails.url = venue.url;
    cbDetails.hours = venue.hours;
    cbDetails.photos = venue.photos;

    // dispatch the cbDetails to the external callback function provided
    self.callback(cbDetails);
  }

  window.Foursquare = {
    getLocationInfo: getLocationInfo
  };
}
)();
