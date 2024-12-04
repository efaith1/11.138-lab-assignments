const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

app.use(cors());
app.use(express.static('css'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0.li7yc.mongodb.net/ChurchesData?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema for GeoJSON data
const geoSchema = new mongoose.Schema({
    type: { type: String, default: "Feature" },
    properties: { type: Object },
    geometry: {
      type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
      coordinates: { type: [Number], required: true }
    }
  }, { collection: 'Churches' }); // My files come from the Churches folder, so enhance navigation to help find them
  
  const GeoModel = mongoose.model('GeoCollection', geoSchema);
  
  // API endpoint to get all GeoJSON data
  app.get('/api/geojson', async (req, res) => {
    try {
      const features = await GeoModel.find();
      res.json({
        type: "FeatureCollection",
        features: features
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  
  // Submit form data to Mongodb
  // Middleware to parse form data
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  
  const formSchema = new mongoose.Schema({
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
  });
  
  const FormData = mongoose.model('FormData', formSchema);
  
  app.get(['/contribute', '/contribute.html'], (req, res) => {
   res.sendFile(__dirname + '/contribute.html');
  });

  app.get(['/gallery', '/gallery.html'], (req, res) => {
    res.sendFile(__dirname + '/gallery.html');
 
   });

   app.get(['/infoPage', '/infoPage.html'], (req, res) => {
    res.sendFile(__dirname + '/infoPage.html');
 
   });

   app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(__dirname + '/index.html');
 
   });

   app.get(['/map', '/map.html'], (req, res) => {
    res.sendFile(__dirname + '/map.html');
 
   });
  
  app.post('/submit', async (req, res) => {
   const formData = new FormData({
       churchPhoto: req.body.churchPhoto || '',
       pastorPhoto: req.body.pastorPhoto || '',
       churchName: req.body.churchName,
       address: req.body.address || '' ,
       lon: req.body.lon || 0,
       lat: req.body.lat || 0,
       founder: req.body.founder || '' ,
       pastor: req.body.pastor || '' ,
       congregation: req.body.congregation || '' ,
       churchContactInfo: req.body.churchContactInfo || '' ,
       churchWebsite: req.body.churchWebsite || '' ,
       activismMoments: req.body.activismMoments || '' ,
       organizations: req.body.organizations || '' ,
       personalStories: req.body.personalStories || '' ,
       contributorName: req.body.contributorName || '' ,
       contributorEmail: req.body.contributorEmail || '' ,
       contributorPhoneNumber: req.body.contributorPhoneNumber || '' ,
       contributorAffiliation: req.body.contributorAffiliation || '' ,
       contributorPrefferedContactMethod: req.body.contributorPrefferedContactMethod || '' 
   });
  
   try {
       await formData.save();
       res.send('Contribution saved to MongoDB!');
   } catch (err) {
       res.status(500).send('Error saving contribution data');
   }
  });
  