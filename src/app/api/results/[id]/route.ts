import { makeQuestionsController } from "@/server/controllers";
import { NextRequest } from "next/server";

import db from "@/server/db";

const questionsController = makeQuestionsController(db);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const resultId = params.id; 
  const response = await questionsController.callGetResults({
    resultId,
  });

  Response.json(response);
}
