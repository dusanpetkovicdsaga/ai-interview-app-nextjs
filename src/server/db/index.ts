import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert('./env__serviceAccountKey.json')
    });
  } catch (error) {
    if(error instanceof Error)
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();