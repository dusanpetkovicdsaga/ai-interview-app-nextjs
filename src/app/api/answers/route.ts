import { questionsController } from "@/server/controllers";


export async function POST(request: Request) {
  const body = await request.json()
  const response = await questionsController.callEvaluateAnswers(body);

  return Response.json(response);
}
