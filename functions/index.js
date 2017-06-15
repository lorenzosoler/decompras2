var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendNotification = functions.database.ref('/lists/{listId}/users/{userId}').onWrite(event => {
  const listId = event.params.listId;
  const userId = event.params.userId;
  console.log('id de la lista: ' + listId + '. id del usuario agregado: ' + userId);
  // If un-follow we exit the function.
  if (!event.data.val()) {
    return console.log('User ', userId, 'un-followed user', listId);
  }

  // Get the follower profile.
  admin.auth().getUser(userId).then((userAdded) => {
        console.log('Usuario agregado a la lista: ' + userAdded.displayName);
        var message = { 
            app_id: "8e4f03e5-8ffb-4fb8-9dd8-7136c5156202",
            contents: {"en": "Mensaje de prueba desde functions cloud"},
            filters: [
                {"field": "tag", "key": "email", "relation": "=", "value": userAdded.email}
            ]
        };

        console.log('app id onesignal: ' + message.app_id);

        sendNotification(message);
  });
});

var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic NzgyYmQ1NjktNTMwNS00MWRmLWExMTYtNjEyYWU2OTA5OGUy"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};
