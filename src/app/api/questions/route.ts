import { makeQuestionsController } from "@/server/controllers";

import db from "@/server/db";

const questionsController = makeQuestionsController(db);

export async function POST(request: Request) {
  const response = await questionsController.callGenerateQuestions(request.body);

  Response.json(response);
}
