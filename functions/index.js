const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cors = require('cors')({origin: true});
const app = express();

app.use(cors);

class User {
    name;
    lastname;
    constructor (name, lastname) {
        this.name = name;
        this.lastname = lastname;
    }
}

app.get('/acuerdo/:id', (req, resp) => {
    var user = new User("lorenzo", "Soler");
    resp.json({name: user.name, lastname: user.lastname});
})


exports.api = functions.https.onRequest(app);


