import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from '@/../env__serviceAccountKey.json'

if (!admin.apps.length) {
  try {
    const firebaseConfig = process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : serviceAccount; 
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as ServiceAccount)
    });
  } catch (error) {
    if(error instanceof Error)
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();