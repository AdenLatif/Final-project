const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define our data
var vaultData = {vaultName: "MindVault"};

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to My Website', vaultName: vaultData.vaultName });
});

// Include routes from routes/main.js
require("./routes/main")(app, vaultData);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
