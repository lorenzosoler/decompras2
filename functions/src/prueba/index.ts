import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
// Create and Deploy Cloud Function with TypeScript using script that is
// defined in functions/package.json:
//    cd functions
//    npm run deploy

export const helloWorld = functions.https.onRequest((request, response) => {
 const users = admin.database().ref("/users")
 users.on('value', (snapshot) => {
    response.json(snapshot.val())
 })
});