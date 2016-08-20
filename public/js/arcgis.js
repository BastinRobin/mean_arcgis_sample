require([
    "esri/tasks/Locator",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Search",
    "esri/geometry/support/webMercatorUtils",
    "dojo/domReady!"
], function(Locator, Map, MapView, Search, webMercatorUtils) {
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
// Setup search box
var searchWidget = new Search({
    view: view,
    })
searchWidget.startup()
// Add the search widget to the top left corner of the view
view.ui.add(searchWidget, {
    position: "top-left",
    index: 0
})
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










var P1 = 0
var P2 = 0
// Extract boundaries to be used with socket.io
setInterval(function(){
    var v = view.extent
    P1 = webMercatorUtils.xyToLngLat(v.xmin, v.ymin)
    P2 = webMercatorUtils.xyToLngLat(v.xmax, v.ymax)
}, 100)
var server = io()
var old_p1 = 0
var old_p2 = 0
// Coordinate boundaries are set undefined at the load stage of the map
// So in order to avoid errors, first we set a listener whether map has
// Loaded, after starting to get defined values from P1 and P2, we start 
// to listen every 1500 ms for changes on P1 and P2, if there is a change 
// we lazy load pinpoints in that area
var load = function() {
  if (P1 !== undefined && P2 !== undefined) {
    // Map has been loaded (initialized)
    // Setup the listener for navigation changes
    setInterval(function(){
      if (old_p1[0] != P1[0] || old_p1[1] != P1[1] || 
          old_p2[0] != P2[0] || old_p2[1] != P2[1]) {
          // Update old values with new ones
          old_p1 = P1
          old_p2 = P2
          // Lazy load
          server.emit("2", { x1: P1[0], y1: P1[1], x2: P2[0], y2: P2[1]})
      }
    }, 1500)
  } else {
    setTimeout(load, 100)
  }
}
setTimeout(load, 100)
// Server has sent pinpoints
server.on("2", function(msg) {
  // Load pinpoints
  for (var i = msg.length - 1; i != -1; i-=1) {
    console.log(msg[i])
  }
})
//w00t
})