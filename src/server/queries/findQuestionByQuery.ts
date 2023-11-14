import * as admin from "firebase-admin";

export async function findQuestionByValue(
  db: admin.firestore.Firestore,
  value: string
): Promise<FirebaseFirestore.QuerySnapshot> {
  const querySnapshot = await db
    .collection("questions")
    .where("query", "==", value)
    .get();
  return querySnapshot;
}
