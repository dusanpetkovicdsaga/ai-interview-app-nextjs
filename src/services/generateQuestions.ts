import { BASE_API_URL } from "@/constants/config";
import { TGetQuestionsResponse, TQuestionsQuery } from "@/shared";
import useInterviewStore from "@/store/useInterviewStore";
import { useMutation } from "@tanstack/react-query";

export function generateQuestions(
  data: TQuestionsQuery
): Promise<TGetQuestionsResponse> {
  // makes a post request to the server to generate questions
  return fetch(`${BASE_API_URL}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data: TGetQuestionsResponse) => {
      return data;
    });
}

export function useGenerateQuestionsMutation() {
  const token = useInterviewStore((state) => state.user.recaptchaToken);
  return useMutation<
    TGetQuestionsResponse,
    unknown,
    TQuestionsQuery
  >({
    mutationFn: (data) => generateQuestions({
      ...data,
      recaptchaToken: token!,
    }),
  });
}
