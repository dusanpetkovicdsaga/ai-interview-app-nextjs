import db from "../db";
import { taglogInit, captureInfo } from "taglog-nextjs-client";

import { QuestionsController } from "./QuestionsController";

if (process.env.TAGLOG_ACCESS_KEY) {
  console.log("Initializing taglog");
  taglogInit({
    accessKey: process.env.TAGLOG_ACCESS_KEY,
    defaultChannel: "test-requests",
  });
}

export const makeQuestionsController = (db: FirebaseFirestore.Firestore) => {
  return new QuestionsController(db);
};

export const questionsController = makeQuestionsController(db);
