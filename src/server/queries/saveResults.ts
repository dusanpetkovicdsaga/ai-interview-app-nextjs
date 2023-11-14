import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { SCHEMA, TPostEvaluateAnswersResponse, TScoreEntity } from "shared";

export async function saveResults(
  db: admin.firestore.Firestore,
  results: TScoreEntity
): Promise<TPostEvaluateAnswersResponse> {
  logger.info(results, { structuredData: true });

  return new Promise(async (resolve, reject) => {
    const newResultsRecord = {
      results,
    };

    try {
      await SCHEMA.evaluatedAnswersResponse.validate(results);
      db.collection("results")
        .add(newResultsRecord)
        .then((docRef) => {
          logger.info("Document written with ID: ", docRef.id, {
            structuredData: true,
          });
          resolve({ resultId: docRef.id });
        });
    } catch (e) {
      reject(e);
    }
  });
}
