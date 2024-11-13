// ADD YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken = "pk.eyJ1IjoiZWZhaXRoMSIsImEiOiJjbHVwM3hqbngxejEwMmlxcHZoMnd4NzVoIn0.aImOljzGu-9EUSa9aFcQzw";


// CREATE A NEW OBJECT CALLED MAP
const map = new mapboxgl.Map({
  container: "map", // container ID for the map object (this points to the HTML element)
  style: "mapbox://styles/efaith1/cm187o7vv00ac01nw2eld0qpl",
  center: [-73.9442, 40.6482], // starting position [lng, lat] (google brooklyn)
  zoom: 12, // starting zoom (adjust it as you wish)
  projection: "globe", // display the map as a 3D globe
});

// Added part
map.on('load', () => {
  // Add a GeoJSON source with data from the API
  map.addSource('mongoLayer', {
    type: 'geojson',
    data: 'http://localhost:3000/api/geojson' // Replace with your API endpoint
  });

  // Add a layer to display MongoDB data
  map.addLayer({
    id: 'mongoLayer',
    type: 'circle', // Options: 'circle', 'line', 'fill'
    source: 'mongoLayer',
    paint: {
      'circle-radius': 5,
      'circle-color': '#007cbf'
    }
  });
});
