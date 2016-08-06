#WebGeeks JWT Dojo

This is a dojo for Des Moines WebGeeks to try out JSON Web Tokens.
This is a simplified starting point for having user registration and a page we want only users to see.

##Goals
On the master branch, the means to issue and verify JWTs has not been implemented, which is the main challenge for the dojo.
To fix this, you basically need to create a function to sign JWTS with who the user is, and a function to verify JWTS (be sure that your user exists).

Some additional challenges you can do are
- Change the secure page message to greet the user with data from the JWT
- Add a secure delete user page
- Add refresh tokens, limit amount of JWTs that can be active, or allow users to revoke specific JWTs/sessions

##Getting started
All you need to do is run `npm install` then you'll be ready to go.
This project uses sqlite3 to store users, so you don't need to muck about with databases.
The [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) package will also install and is already included in `index.js`

To emphesize the simplicity and statelessness of JWTs, none of the endpoints require a browser.
You can use curl to test the endpoints yourself.
[`curl localhost:3000 --data "param=value"`].
Be sure to save the JWTs you get (clipboard or piping to a file).
Otherwise you can run npm test (requires mocha), and take a look at the unit tests.

##Final Note
If you would like to use (some of) this code as a starting point for a project, just be sure to change the DB from sqlite and you'll probably want to split this up into multiple files.

##License
Public domain (using unlicense)
