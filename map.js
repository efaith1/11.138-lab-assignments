// ADD YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken =
  "pk.eyJ1IjoiZWZhaXRoMSIsImEiOiJjbTNpMm00d3MwbWZiMmpwdmZ6ajk1MWpxIn0.QLpkPhqyjTw3DgiFigg0mQ";

// CREATE A NEW OBJECT CALLED MAP
const map = new mapboxgl.Map({
  container: "map", // container ID for the map object (this points to the HTML element)
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-73.9442, 40.6482], // starting position [lng, lat] (google brooklyn)
  zoom: 12, // starting zoom (adjust it as you wish)
});

// Added part
map.on("load", () => {
  // Add a GeoJSON source with data from the API
  map.addSource("mongoLayer", {
    type: "geojson",
    data: "https://roots-of-resilience-f93bdedc188d.herokuapp.com/api/geojson",
  });

  // Add a layer to display MongoDB data
  map.addLayer({
    id: "mongoLayer",
    type: "circle", // Options: 'circle', 'line', 'fill'
    source: "mongoLayer",
    paint: {
      "circle-radius": 5,
      "circle-color": "red",
    },
  });

  // Step 3: Create a pop-up instance
  const popup = new mapboxgl.Popup({
    closeButton: false, // Disable close button
    closeOnClick: false, // Keep pop-up open when clicking elsewhere
  });

  // Step 4: Add mouseenter event to show the pop-up
  map.on("mouseenter", "mongoLayer", (e) => {
    // Change the cursor to a pointer to indicate interactivity
    map.getCanvas().style.cursor = "pointer";

    // Extract the coordinates and properties of the hovered point
    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;
    // console.log(properties);

    // Set the content of the pop-up
    popup
      .setLngLat(coordinates)
      .setHTML(
        `
            <h3>${properties.Name || "Unknown Name"}</h3>
            <p>${properties.Location || "Unknown Location"}</p>
        `
      )
      .addTo(map);
  });

  // Step 5: Add mouseleave event to remove the pop-up
  map.on("mouseleave", "mongoLayer", () => {
    // Reset the cursor style
    map.getCanvas().style.cursor = "";
    // Remove the pop-up
    popup.remove();
  });

  // map.on("click", "mongoLayer", (e) => {
  //   const properties = e.features[0].properties;
  //   const churchId = properties._id; // Replace `_id` with the appropriate property from your GeoJSON
  //   if (churchId) {
  //     window.location.href = `infoPage.html?id=${churchId}`;
  //   } else {
  //     alert("No ID found for this point.");
  //   }
  // });
});
