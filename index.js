process.env.db = "users.db";
const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./controllers/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(process.env.db);
var app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Initialize the database.
// It'll create the file if it doesn't exist as well
db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS users(username TEXT, pass TEXT)");
});


// Routes
app.post("/signup", (req, res) => {
	auth.register(req.body, (err) => {
		return res.send(err);
	});
});

app.post("/login", (req, res) => {
	auth.login(req.body, (err, jwt) => {
		if (err) {
			return res.send(err);
		}

		return res.send(jwt);
	});
});

app.get("/secure", (req, res) => {
	// Decode JWT here
	return res.send("Hello World");
});


// Start Server
app.listen(3000, () => {
	console.log("Listening on port 3000");
});
