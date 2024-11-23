// ADD YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken = "pk.eyJ1IjoiZWZhaXRoMSIsImEiOiJjbTNpMm00d3MwbWZiMmpwdmZ6ajk1MWpxIn0.QLpkPhqyjTw3DgiFigg0mQ";


// CREATE A NEW OBJECT CALLED MAP
const map = new mapboxgl.Map({
  container: "map", // container ID for the map object (this points to the HTML element)
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-73.9442, 40.6482], // starting position [lng, lat] (google brooklyn)
  zoom: 12, // starting zoom (adjust it as you wish)
});

// Added part
map.on('load', () => {
  // Add a GeoJSON source with data from the API
  map.addSource('mongoLayer', {
    type: 'geojson',
    // data: 'http://localhost:3000/api/geojson' // Replace with your API endpoint
    data:'https://roots-of-resilience-f93bdedc188d.herokuapp.com/api/geojson'
  });

  // Add a layer to display MongoDB data
  map.addLayer({
    id: 'mongoLayer',
    type: 'circle', // Options: 'circle', 'line', 'fill'
    source: 'mongoLayer',
    paint: {
      'circle-radius': 5,
      'circle-color': 'red'
    }
  });
});
