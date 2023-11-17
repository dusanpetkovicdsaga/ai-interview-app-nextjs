import { SCHEMA, TQuestionEntityWithScore } from "@/shared";
import { apiAnswerQuestions } from "./api/apiAnswerQuestions";

export const generateAnswersPrompt = (answers: string) => {
  return [
    "Can you take the following list of questions and answers in JSON format, and validate the answers for each question matching by id, and return the score for each question, the score being from 0 - 10, 10 being a correct answer, and 0 being an invalid or wrong answer. Make sure to be rigourus, as a wrong answer should not be given a score of 10, but rather 0. ",
    answers,
  ].join(" --- ");
};

export async function processAnswers(
  query: string
): Promise<{ questions: Array<TQuestionEntityWithScore> }> {
  try {
    const { function_call } = await apiAnswerQuestions(query.toString());

    if (function_call?.name && function_call.arguments) {
      const data = JSON.parse(function_call.arguments);

      console.info(
        {
          data,
        },
        { structuredData: true }
      );

      const { questions } = (await SCHEMA.evaluatedAnswersSchema.validate(
        data
      )) as { questions: Array<TQuestionEntityWithScore> };

      return { questions };
    } else {
      throw new Error("No function call returned");
    }
  } catch (error) {
    return { questions: [] };
  }
}
