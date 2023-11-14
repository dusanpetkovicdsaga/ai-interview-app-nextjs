import * as admin from "firebase-admin";
// import { collection, doc, setDoc } from "firebase/firestore";

export async function findResultById(
  db: admin.firestore.Firestore,
  id: string
) {
  const querySnapshot = await db
    .collection("results")
    .doc(id)
    .get();
  return querySnapshot.data();
}
