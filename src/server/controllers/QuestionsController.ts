import {
  SCHEMA,
  TGetQuestionsResponse,
  TPostEvaluateAnswers,
  TPostEvaluateAnswersResponse,
  TScoreEntity,
} from "@/shared";
import { generateAnswersPrompt, processAnswers } from "../answers";
import { findQuestionByValue } from "../queries/findQuestionByQuery";
import { findResultById } from "../queries/findResultById";
import { saveResults } from "../queries/saveResults";
import { generateQuestionsPrompt, sendAndProcessQuestions } from "../questions";

export class QuestionsController {
  db: FirebaseFirestore.Firestore;
  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
  }

  async callGetResults(data: any): Promise<{ results: TScoreEntity } | null> {
    try {
      if (!data.resultId) throw new Error("No id provided");

      const result = await findResultById(this.db, data.resultId);

      if (result) {
        return result as { results: TScoreEntity };
      } else {
        throw new Error("invalid id provided");
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async callEvaluateAnswers(data: any): Promise<TPostEvaluateAnswersResponse> {
    const { answers, questions } = (await SCHEMA.evaluateAnswersSchema.validate(
      data
    )) as TPostEvaluateAnswers;

    // genrate a query baseed on the questions and answers arrays, to concatonate the questions and answers into one array of strings to be sent to the model

    const query = generateAnswersPrompt(JSON.stringify({ answers, questions }));

    console.info({
      query,
    });

    const processedAnswers = await processAnswers(query);

    const score = {
      questions: processedAnswers.questions ? processedAnswers.questions : [],
      totalScore:
        processedAnswers.questions.reduce((acc, curr) => acc + curr.score, 0) /
        processedAnswers.questions.length,
    };

    return saveResults(this.db, score);
  }

  async callGenerateQuestions(data: any): Promise<TGetQuestionsResponse> {
    const { role, experienceLevel, questionsNum } =
      await SCHEMA.questionsQuerySchema.validate(data);

    const question = generateQuestionsPrompt(
      questionsNum.toString(),
      role,
      experienceLevel
    );

    const existingQuestion = await findQuestionByValue(this.db, question);

    if (!existingQuestion.empty) {
      const [existingQuestionData] = existingQuestion.docs;

      return existingQuestionData.data().questions;
    }

    const processedQuestions = await sendAndProcessQuestions(this.db, question);

    return processedQuestions.questions as TGetQuestionsResponse;
  }
}
