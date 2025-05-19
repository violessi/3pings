const admin = require("firebase-admin");
const path = require("path");

let serviceAccount;

// Allow for using Heroku config variables for the json
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
} else {
  serviceAccount = require(path.resolve(
    __dirname,
    "../../serviceAccountKey.json"
  ));
}

if (!serviceAccount) {
  throw new Error("Service account not found");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
