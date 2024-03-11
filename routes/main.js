const express = require('express');
const app = express();
const port = 8001;
const bodyParser = require('body-parser');
// Symbols for the cards
const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
// Total number of cards (must be even)
const totalCards = 16; 
// Array to hold the cards
const cards = []; 

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Set the views directory

// Set up static files directory for CSS, JS, and images
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
    res.render('index', { vaultName: "MindVault" }); // Rendering index with vaultName
});

// Render the Learn page
module.exports = function(app, vaultData) {
    // Define routes here
// Render the Learn page
app.get('/about', function(req, res) {
    res.render('about', { vaultName: "MindVault" }); 
});
;
app.get('/register', function(req, res) {
    res.render('register', { vaultName: "MindVault" }); 
});

app.post('/registered', (req, res) => {
    // Extract data from the request body
    const { username, email, password } = req.body;

    // Assuming you have some logic to process the registration data here
    // For now, let's just log the received data
    console.log('Received registration data:');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    // Send a response back to the client
    res.send('Registration successful!'); 
});

app.get('/login', function(req, res) {
    res.render('login', { vaultName: "MindVault" }); 
});

}


// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
