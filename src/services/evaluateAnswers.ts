import { BASE_API_URL } from "@/constants/config";
import {
  TPostEvaluateAnswers,
  TPostEvaluateAnswersResponse,
} from "@/shared";
import { useMutation } from "@tanstack/react-query";

export function evaluateAnswers(
  data: TPostEvaluateAnswers
): Promise<TPostEvaluateAnswersResponse> {
  // makes a post request to the server to generate questions
  return fetch(`${BASE_API_URL}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data: TPostEvaluateAnswersResponse) => {
      return data;
    });
}

export function useEvaluateAnswersMutation() {
  return useMutation<
    TPostEvaluateAnswersResponse,
    unknown,
    TPostEvaluateAnswers
  >({
    mutationFn: (data) => evaluateAnswers(data),
  });
}
