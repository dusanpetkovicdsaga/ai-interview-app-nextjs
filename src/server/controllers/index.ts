import db from "../db";
import { QuestionsController } from "./QuestionsController";

export const makeQuestionsController = (db: FirebaseFirestore.Firestore) => {
  return new QuestionsController(db);
};


export const questionsController = makeQuestionsController(db);