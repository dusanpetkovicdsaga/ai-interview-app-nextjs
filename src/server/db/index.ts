import admin, { ServiceAccount } from "firebase-admin";
import { captureException } from "taglog-nextjs-client";

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
  } catch (error) {
    if (error instanceof Error) {
      captureException("Firebase admin initialization error", error);
    }
  }
}
export default admin.firestore();
