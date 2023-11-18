import admin, { ServiceAccount } from "firebase-admin";

if (!admin.apps.length) {
  try {
  
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
  } catch (error) {
    if (error instanceof Error)
      console.log("Firebase admin initialization error", error.stack);
  }
}
export default admin.firestore();
