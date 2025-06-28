const admin = require("firebase-admin");

const serviceAccount = require("../../express-app-a357f-firebase-adminsdk-fbsvc-1f0e85e0dc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://express-app-a357f-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const db = admin.database();


module.exports = { db }