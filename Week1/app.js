const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the Public directory
app.use(express.static(path.join(__dirname, 'Public')));

//Basic get route
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
  console.log('Index page accessed');
});

app.get('/secondpage', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'secondpage.html'));
});

//Routes for data and data files
//json API route
app.get('/api/data', (req, res) => {
  res.json ({
    message:"Hello, this is your JSON data!",
    timestamp: new Date(),
    items: ["Node.js", "Express", "npm"]
  });
});

// API route for course data from JSON file
app.get('/api/course', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'data.json'), "utf-8", (err, data) => {
    if (err) {
      console.error('Error reading course data:', err);
      res.status(500).send('Error reading course data');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

//route for running our server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});