var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;

    // Push it into the Realtime Database then send a response
    admin.database().ref('/messages').push({'mensaje-funcloud': original}).then(snapshot =>{
        var obj = {'mensaje-funcloud': original};
        console.log(obj);
        var json = JSON.stringify(obj);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.json(json);
    });
});

