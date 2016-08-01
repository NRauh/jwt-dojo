process.env.db = "test.db";
const expect = require("chai").expect;
const auth = require("../controllers/auth");
const fs = require("fs");
const sqlite3 = require("sqlite3");
var db = new sqlite3.Database(process.env.db);

before((done) => {
	db.serialize(() => {
		db.run("CREATE TABLE IF NOT EXISTS users(username TEXT, pass TEXT)");
		done();
	});
});

describe("register", () => {
	it("requires a username", (done) => {
		auth.register({}, (err) => {
			expect(err).to.equal("Missing username");
			done();
		});
	});

	it("requires a password", (done) => {
		auth.register({username: "Charley"}, (err) => {
			expect(err).to.equal("Missing password");
			done();
		});
	});

	it("requires a password confirmation", (done) => {
		auth.register({
			username: "Charley",
			password: "123"
		}, (err) => {
			expect(err).to.equal("Missing password confirmation");
			done();
		});
	});

	it("requires both password and password confirmation to match", (done) => {
		auth.register({
			username: "Charley",
			password: "123",
			passwordConf: "321"
		}, (err) => {
			expect(err).to.equal("Password and confirmation don't match");
			done();
		});
	});

	it("adds the user to the database", (done) => {
		auth.register({
			username: "Charley",
			password: "123",
			passwordConf: "123"
		}, (err) => {
			db.get("SELECT * FROM users WHERE username == 'Charley'", (err, row) => {
				expect(row.username).to.equal("Charley");
				done();
			});
		});
	});

	it("salts and hashes the password", (done) => {
		auth.register({
			username: "Isabel",
			password: "123",
			passwordConf: "123"
		}, (err) => {
			db.get("SELECT * FROM users WHERE username == 'Isabel'", (err, row) => {
				expect(row.pass).to.exist;
				expect(row.pass).to.not.equal("123");
				done();
			});
		});
	});

	it("checks username uniqueness", (done) => {
		auth.register({
			username: "Isabel",
			password: "123",
			passwordConf: "123"
		}, (err) => {
			expect(err).to.equal("User already exists");
			done();
		});
	});

	it("returns a jwt", (done) => {
		auth.register({
			username: "Carine",
			password: "123",
			passwordConf: "123"
		}, (err, jwt) => {
			expect(err).to.equal(undefined);
			expect(jwt).to.exist;
			done();
		});
	});
});

describe("login", () => {
	it("requires a username", (done) => {
		auth.login({}, (err) => {
			expect(err).to.equal("Missing username");
			done();
		});
	});

	it("requires a password", (done) => {
		auth.login({username: "Isabel"}, (err) => {
			expect(err).to.equal("Missing password");
			done();
		});
	});

	it("checks that the user exists", (done) => {
		auth.login({
			username: "Simon",
			password: "123",
		}, (err) => {
			expect(err).to.equal("User doesn't exist");
			done();
		});
	});

	it("compares password with stored hash", (done) => {
		auth.login({
			username: "Charley",
			password: "321"
		}, (err) => {
			expect(err).to.equal("Wrong password");
			done();
		});
	});

	it("returns a jwt", (done) => {
		auth.login({
			username: "Charley",
			password: "123"
		}, (err, jwt) => {
			expect(err).to.equal(undefined);
			expect(jwt).to.exist;
			done();
		});
	});
});

after(() => {
	fs.unlinkSync("test.db");
});

