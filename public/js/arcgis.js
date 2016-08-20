require([
    "esri/tasks/Locator",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Search",
    "dojo/domReady!"
], function(Locator, Map, MapView, Search) {
// Set up a locator task using the world geocoding service
var locatorTask = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
})

// Create the Map
var map = new Map({
    basemap: "streets-navigation-vector"
})

// Create the MapView
var view = new MapView({
    container: "arcgis-map",
    map: map,
    center: [-116.3031, 43.6088],
    zoom: 12
})
var searchWidget = new Search({
    view: view,
    });
searchWidget.startup();

// Add the search widget to the top left corner of the view
view.ui.add(searchWidget, {
    position: "top-left",
    index: 0
});

/*******************************************************************
 * This click event sets generic content on the popup not tied to
 * a layer, graphic, or popupTemplate. The location of the point is
 * used as input to a reverse geocode method and the resulting
 * address is printed to the popup content.
 *******************************************************************/
view.on("click", function(evt) {
// Get the coordinates of the click on the view
var x = evt.mapPoint.longitude
var y = evt.mapPoint.latitude
var lon = Math.round(evt.mapPoint.longitude * 1000) / 1000  // x
var lat = Math.round(evt.mapPoint.latitude * 1000) / 1000   // y

view.popup.open({
    // Set the popup's title to the coordinates of the location
    title: "Resolving address...",
    location: evt.mapPoint, // Set the location of the popup to the clicked location
    content: "Reverse geocode: [" + lon + ", " + lat + "]" + 
             '<a href="@' + x + ':' + y + '">I can donate blood here</a>'
})

// Display the popup
// Execute a reverse geocode using the clicked location
locatorTask.locationToAddress(evt.mapPoint).then(function(
    response) {
    // If an address is successfully found, print it to the popup's content
    var address = response.address.Match_addr
    view.popup.title = address
}).otherwise(function(err) {
    // If the promise fails and no result is found, print a generic message
    // to the popup's content
    view.popup.title = "No address was found for this location<br>" + 
                       "However you can still donate on this location"
})})
})