import * as admin from "firebase-admin";
import { SCHEMA, TPostEvaluateAnswers } from "@/shared";

export async function saveSession(
  db: admin.firestore.Firestore,
  results: Partial<TPostEvaluateAnswers>
): Promise<{ saveId: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      await SCHEMA.evaluateAnswersSchema.validate(results);
      db.collection("sessions")
        .add(results)
        .then((docRef) => {
          console.info("Document written with ID: ", docRef.id, {
            structuredData: true,
          });
          resolve({ saveId: docRef.id });
        });
    } catch (e) {
      reject(e);
    }
  });
}
