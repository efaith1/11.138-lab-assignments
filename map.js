// ADD YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken = "pk.eyJ1IjoiZWZhaXRoMSIsImEiOiJjbHVwM3hqbngxejEwMmlxcHZoMnd4NzVoIn0.aImOljzGu-9EUSa9aFcQzw";


// CREATE A NEW OBJECT CALLED MAP
const map = new mapboxgl.Map({
  container: "map", // container ID for the map object (this points to the HTML element)
  style: "mapbox://styles/efaith1/cm187o7vv00ac01nw2eld0qpl",
  center: [-73.9442, 40.6482], // starting position [lng, lat] (google brooklyn)
  zoom: 11, // starting zoom (adjust it as you wish)
  projection: "globe", // display the map as a 3D globe
});
