# Neighborhood Map
Neighborhood Map is a single page application developed for the Udacity Frontend
Web Developer course.
It features a filterable list of locations to visit in central Stockholm with
relevant information about each location displayed on the Google Map. The information that is displayed is fetched from the Foursquare API.

## How to use the application
1) Either open the `index.html` file locally in your web browser or navigate to the  [online version of the page](https://mburazin.github.io/neighborhood-map).
1) On the left you will find a navigation pane with a list of locations you can filter through by using the text input filter. This pane is hidden on mobile devices and one can access it by pressing the top left hamburger icon.
1) On the right you will see the Google map which displays the locations using markers.
1) The filter filters through both the list of locations and the markers on the Google Map view.
1) To display more information about a particular place you can either click on the list in the navigation pane or click the marker in Google Maps. This will popup the Window above the marker with more information displayed.

## About the project
This project is one of the Javascript projects developed as a requirement to acquire the Udacity Frontend Development Nanodegree. The goal of this project was to develop a single-page application featuring a map of my neighborhood using Google Maps. I chose the Stockholm city center.  

The requirement was to:

- Add additional functionality to this application, including: map markers to identify popular locations or places one would like to visit,
- Search function to easily discover these locations, and a listview to support simple browsing of all locations.
- Research and implement third-party APIs that provide additional information about each of these locations (such as StreetView images, Wikipedia articles, Yelp reviews, etc). I chose [Foursqare](https://www.foursquare.com).
- Use Knockout JS - MVVM framework to do separation of concerns within the code
- Load all the remote data asynchronously and implement error handling in case the data failed to download
- Make the page responsive and usable on all devices, e.g. desktop, mobile, etc.


### Licensing information
This project is licensed under the terms of the MIT license. For more information, see LICENSE file.

#### Attribution
- Google Maps API - https://developers.google.com/maps/
- Foursquare API - https://developer.foursquare.com/
- JQuery - https://jquery.com/
- Knockout JS - http://knockoutjs.com/
