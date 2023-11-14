import { questionsController } from "@/server/controllers";


export async function POST(request: Request) {
  const response = await questionsController.callEvaluateAnswers(request.body);

  Response.json(response);
}
