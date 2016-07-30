const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("users.db");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Initialize the database.
// It'll create the file if it doesn't exist as well
db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS users(username TEXT, pass TEXT)");
});


// Routes
app.post("/signup", (req, res) => {
	var usr = {
		username: req.body.username,
		password: req.body.password,
		passwordConf: req.body.passconf
	};

	if (!usr.username) {
		return res.send("Missing username\n");
	} else if (!usr.password || !usr.passwordConf) {
		return res.send("Missing password, or password confirmation\n");
	} else if (usr.password !== usr.passwordConf) {
		return res.send("Password and confirmation don't match\n");
	}

	db.get("SELECT username FROM users WHERE username == ?", [usr.username], (err, row) => {
		if (row) {
			return res.send("User already exists\n");
		}

		addUser(usr, () => {
			// Here is where you will send the JWT
			return res.send("Hi\n");
		});
	});

	function addUser(user, cb) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				db.run("INSERT INTO users VALUES (?, ?)", [user.username, hash]);
				return cb();
			});
		});
	}
});

app.post("/login", (req, res) => {
	var usr = {
		username: req.body.username,
		password: req.body.password
	};

	if (!usr.username) {
		return res.send("Missing username\n");
	} else if (!usr.password) {
		return res.send("Missing password\n");
	}

	db.get("SELECT * FROM users WHERE username == ?", [usr.username], (err, row) => {
		if (!row) {
			return res.send("User not found\n");
		}

		bcrypt.compare(usr.password, row.pass, (err, success) => {
			if (!success) {
				return res.send("Wrong password\n");
			}

			// Here's where you will send a JWT
			return res.send("Hello\n");
		});
	});
});

app.get("/secure", (req, res) => {
	return res.send("Hello World");
});


// Start Server
app.listen(3000, () => {
	console.log("Listening on port 3000");
});
