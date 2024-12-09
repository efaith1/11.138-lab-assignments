const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");

app.use(cors());
app.use(express.static("css"));

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dbUser:dbUserPassword@cluster0.li7yc.mongodb.net/ChurchesData?retryWrites=true&w=majority"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define schema for GeoJSON data - used by map page
const geoSchema = new mongoose.Schema(
  {
    type: { type: String, default: "Feature" },
    properties: { type: Object },
    geometry: {
      type: {
        type: String,
        enum: ["Point", "LineString", "Polygon"],
        required: true,
      },
      coordinates: { type: [Number], required: true },
    },
  },
  { collection: "Churches" }
); // My files come from the Churches folder, so enhance navigation to help find them

const GeoModel = mongoose.model("GeoCollection", geoSchema);

// API endpoint to get all GeoJSON data
app.get("/api/geojson", async (req, res) => {
  try {
    const features = await GeoModel.find();
    res.json({
      type: "FeatureCollection",
      features: features,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Submit form data to Mongodb
// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define schema for GeoJSON data
const formSchema = new mongoose.Schema(
  {
    type: { type: String, default: "FormEntry" },
    properties: {
      churchPhoto: { type: String, required: false }, // File path or URL for church photo
      pastorPhoto: { type: String, required: false },
      churchName: { type: String, required: false },
      address: { type: String, required: false },
      lon: { type: Number, required: false },
      lat: { type: Number, required: false },
      founder: { type: String, required: false },
      pastor: { type: String, required: false },
      congregation: { type: String, required: false },
      churchContactInfo: { type: String, required: false },
      churchWebsite: { type: String, required: false },
      activismMoments: { type: String, required: false },
      organizations: { type: String, required: false },
      personalStories: { type: String, required: false },
      contributorName: { type: String, required: false },
      contributorEmail: { type: String, required: false },
      contributorPhoneNumber: { type: String, required: false },
      contributorAffiliation: { type: String, required: false },
      contributorPrefferedContactMethod: { type: String, required: false },
    },
    geometry: {
      type: { type: String, required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { collection: "formdatas" }
);

const FormData = mongoose.model("FormData", formSchema);

// API endpoint to get all GeoJSON data
app.get("/api/formdata", async (req, res) => {
  try {
    const features = await FormData.find();
    res.json({
      type: "FeatureCollection",
      features: features,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// POST route with explicit mapping and basic validation
app.post("/submit", async (req, res) => {
  try {
    const { type = "FormEntry", properties = {}, geometry = {} } = req.body;

    const {
      churchPhoto = "",
      pastorPhoto = "",
      churchName = "",
      address = "",
      lon = null,
      lat = null,
      founder = "",
      pastor = "",
      congregation = "",
      churchContactInfo = "",
      churchWebsite = "",
      activismMoments = "",
      organizations = "",
      personalStories = "",
      contributorName = "",
      contributorEmail = "",
      contributorPhoneNumber = "",
      contributorAffiliation = "",
      contributorPrefferedContactMethod = "",
    } = properties;

    const { type: geometryType, coordinates } = geometry;

    // Basic Validation
    if (
      !geometryType ||
      !["Point", "LineString", "Polygon"].includes(geometryType)
    ) {
      return res.status(400).json({
        error:
          "Invalid or missing geometry type. Must be one of Point, LineString, Polygon.",
      });
    }

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({
        error:
          "Invalid or missing coordinates. Must be an array of at least two numbers.",
      });
    }

    // Additional validation can be added here as needed

    const formData = new FormData({
      type,
      properties: {
        churchPhoto,
        pastorPhoto,
        churchName,
        address,
        lon,
        lat,
        founder,
        pastor,
        congregation,
        churchContactInfo,
        churchWebsite,
        activismMoments,
        organizations,
        personalStories,
        contributorName,
        contributorEmail,
        contributorPhoneNumber,
        contributorAffiliation,
        contributorPrefferedContactMethod,
      },
      geometry: {
        type: geometryType,
        coordinates,
      },
    });

    const savedData = await formData.save();

    res.status(201).json(savedData);
  } catch (error) {
    console.error("Error saving form data:", error.message);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: "Server Error" });
  }
});

app.get(["/contribute", "/contribute.html"], (req, res) => {
  res.sendFile(__dirname + "/contribute.html");
});

app.get(["/gallery", "/gallery.html"], (req, res) => {
  res.sendFile(__dirname + "/gallery.html");
});

app.get(["/infoPage", "/infoPage.html"], (req, res) => {
  res.sendFile(__dirname + "/infoPage.html");
});

app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get(["/map", "/map.html"], (req, res) => {
  res.sendFile(__dirname + "/map.html");
});
