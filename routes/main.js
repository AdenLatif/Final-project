const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Export a function that configures the app
module.exports = function(app) {
    // Middleware for parsing request bodies
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(express.static('public'));


    // Session configuration
    app.use(session({
        secret: 'your_secret_key', // Secret key for signing the session ID cookie
        resave: false,            // Do not force session save
        saveUninitialized: false, // Do not save uninitialized sessions
        cookie: { secure: false } // True in production if using HTTPS
    }));

    // Set EJS as the view engine for rendering HTML from templates
    app.set('view engine', 'ejs');

    // MySQL connection pool setup
    const pool = mysql.createPool({
        host: 'localhost',  // Database server address
        port: 3306,         // Database server port
        user: 'root',       // Database user
        password: 'app2027',  // Database password
        database: 'myMindvauvaultdb',  // Database name
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // Middleware to redirect users not logged in
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('/login');
        } else {
            next();
        }
    };

    // Route for the home page
    app.get('/', (req, res) => {
        res.render('index', { title: 'Home Page' });
    });

    // Route for the about page
    app.get('/about', (req, res) => {
        res.render('about', { vaultName: "MindVault" });
    });

    // Route for showing the login page
    app.get('/login', (req, res) => {
        res.render('login', { vaultName: "MindVault" });
    });

    // Route for handling login attempts
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            if (users.length > 0) {
                const user = users[0];
                if (await bcrypt.compare(password, user.password)) {
                    req.session.userId = user.id;
                    res.redirect('/loggedin'); // Redirect to loggedin page
                } else {
                    res.send('Invalid password');
                }
            } else {
                res.send('User not found');
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Error logging in user');
        }
    });
    
    // Route for loggedin.ejs
    app.get('/loggedin', (req, res) => {
        res.render('loggedin');
    });
    
    // Route for game.ejs
    app.get('/game', (req, res) => {
        res.render('game');
    });

    // Route for the registration page
    app.get('/register', (req, res) => {
        res.render('register', { vaultName: "MindVault" });
    });

    // Route for handling registration submissions
    app.post('/registered', async (req, res) => {
        const { first, last, email, username, password, country } = req.body;
        const termsAndConditions = req.body.termsAndConditions ? true : false;
        const hashedPassword = await bcrypt.hash(password, 8);
        try {
            const result = await pool.execute(`
                INSERT INTO users (first_name, last_name, email, username, password, country, terms_and_conditions)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [first, last, email, username, hashedPassword, country, termsAndConditions]);
            console.log(result);
            res.render('registered', { userFirstName: first });
        } catch (error) {
            console.error('Failed to register user:', error);
            res.status(500).send('Failed to register user.');
        }
    });

    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return console.error('Logout failed', err);
            }
            res.render('logout'); // Render the logout page with a timed redirect
        });
    });

    


    // Protected route for the list page
    app.get('/loggedin', redirectLogin, (req, res) => {
        res.send("This is the loggedin page, visible only to logged-in users.");
    });
};
