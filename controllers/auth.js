const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3");
var db = new sqlite3.Database(process.env.db);

module.exports = {
	register: function(body, cb) {
		if (!body.username) {
			return cb("Missing username");
		} else if (!body.password){
			return cb("Missing password");
		} else if (!body.passwordConf){
			return cb("Missing password confirmation");
		} else if (body.password !== body.passwordConf){
			return cb("Password and confirmation don't match");
		}

		db.get("SELECT username FROM users WHERE username == ?", [body.username], (err, row) => {
			if (row) {
				return cb("User already exists");
			}

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(body.password, salt, (err, hash) => {
					db.run("INSERT INTO users VALUES (?, ?)", [body.username, hash], (err) => {
						// Issue JWT here
						return cb(undefined, "Good");
					});
				});
			});
		});
	},


	login: function(body, cb) {
		if (!body.username) {
			return cb("Missing username");
		} else if (!body.password) {
			return cb("Missing password");
		}

		db.get("SELECT * FROM users WHERE username == ?", [body.username], (err, row) => {
			if (!row) {
				return cb("User doesn't exist");
			}

			bcrypt.compare(body.password, row.pass, (err, success) => {
				if (!success) {
					return cb("Wrong password");
				}
				// Issue JWT here
				return cb(undefined, "Good");
			});
		});
	}
};
