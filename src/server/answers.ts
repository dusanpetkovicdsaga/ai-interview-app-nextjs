import { SCHEMA, TQuestionEntityWithScore } from "@/shared";
import { apiAnswerQuestions } from "./api/apiAnswerQuestions";
import { Config } from "@/store/useInterviewStore";

export const generateAnswersPrompt = (answers: string, config: Config) => {
  return [
    `Can you score the provided answers for each given question in the provided JSON. The score should range from 0 to 10, with 10 being a correct answer and 0 being an invalid or wrong answer. Provide an array of reasons matching each question that was answered. Please ensure that the scoring is rigorous. Use the following as criteria experience level: ${config.experienceLevel}, role: ${config.role}, time limit per question: ${config.timeLimitPerQuestion} min. Just answer with a JSON response.`,
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
      )) as {
        questions: Array<TQuestionEntityWithScore>;
      };

      return { questions };
    } else {
      throw new Error("No function call returned");
    }
  } catch (error) {
    return { questions: []};
  }
}
