import * as Yup from "yup";

import { questionsQuerySchema } from "../schemas";

export type TScoreEntity = {
  questions: Array<TQuestionEntity & { score: number }>;
  totalScore: number;
};

export type TPostEvaluateAnswers = {
  questions: Array<TQuestionEntity>;
  answers: Array<TAnswerEntity>;
};

export type TPostEvaluateAnswersResponse = {
  resultId: string;
};

export type TAnswerEntity = {
  questionId: string;
  answer: string;
  timeTaken: number;
};

export type TQuestionEntity = {
  questionText: string;
  id: string;
};

export type TQuestionEntityWithScore = TQuestionEntity & { score: number };

export type TGetQuestions = {
  questions: Array<TQuestionEntity>;
  query: string;
};

export type TGetQuestionsResponse = Array<TQuestionEntity>;

export type TQuestionsQuery = Yup.InferType<typeof questionsQuerySchema>;
