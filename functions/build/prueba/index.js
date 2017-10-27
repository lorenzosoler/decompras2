"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Create and Deploy Cloud Function with TypeScript using script that is
// defined in functions/package.json:
//    cd functions
//    npm run deploy
exports.helloWorld = functions.https.onRequest((request, response) => {
    const users = admin.database().ref("/users");
    users.on('value', (snapshot) => {
        response.json(snapshot.val());
    });
});
//# sourceMappingURL=index.js.map