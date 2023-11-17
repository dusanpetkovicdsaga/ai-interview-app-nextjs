import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from './env__serviceAccountKey.json'

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount)
    });
  } catch (error) {
    if(error instanceof Error)
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();