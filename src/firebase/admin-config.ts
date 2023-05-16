import * as dotenv from "dotenv";
import firebase from "firebase-admin";
import credentials from "./credentials.json";

dotenv.config();

const firebaseAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(credentials as firebase.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export default firebaseAdmin;
