const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
var session = require ('express-session');

// Define vaultData
const vaultData = { vaultName: "MindVault" };


// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));


// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to My Website', vaultName: vaultData.vaultName });
});

// Include routes from routes/main.js
require('./routes/main')(app);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
