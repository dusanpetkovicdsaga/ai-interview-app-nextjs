
import * as admin from "firebase-admin";
import { SCHEMA } from "@/shared";


export async function saveQuestions(
    db: admin.firestore.Firestore,
    questions: Array<{ question: string; id: string }>,
    query: string
  ) {
    console.info(questions, { structuredData: true });
  
    return new Promise(async (resolve, reject) => {
      const newQuestionRecord = {
        query,
        questions,
      };
  
      try {
        await SCHEMA.getQuestionsSchema.validate(newQuestionRecord);
        db.collection("questions")
          .add({
            query,
            questions,
          })
          .then((docRef) => {
            console.info("Document written with ID: ", docRef.id, {
              structuredData: true,
            });
            resolve(docRef.id);
          });
      } catch (e) {
        reject(e);
      }
    });
  }
  