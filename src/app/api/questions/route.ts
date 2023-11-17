import { makeQuestionsController } from "@/server/controllers";

import db from "@/server/db";

const questionsController = makeQuestionsController(db);

export async function POST(request: Request) {
  const res = await request.json()
  const response = await questionsController.callGenerateQuestions(res);

  return Response.json(response);
}
