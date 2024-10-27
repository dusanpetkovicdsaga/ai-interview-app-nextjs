import db from "../db";
import { QuestionsController } from "./QuestionsController";
import { taglogInit, captureInfo } from "taglog-nextjs-client";

if (process.env.TAGLOG_ACCESS_KEY) {
  console.log("Initializing taglog");
  taglogInit({
    accessKey: process.env.TAGLOG_ACCESS_KEY,
    defaultChannel: "test-requests",
    options: { captureConsole: true },
  });
  captureInfo("Hello from server");
}

export const makeQuestionsController = (db: FirebaseFirestore.Firestore) => {
  return new QuestionsController(db);
};

export const questionsController = makeQuestionsController(db);
