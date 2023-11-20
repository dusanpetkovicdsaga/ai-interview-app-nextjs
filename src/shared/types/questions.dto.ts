import * as Yup from "yup";

import { questionsQuerySchema } from "../schemas";
import { Config, User } from "@/store/useInterviewStore";

export type TScoreEntity = {
  certificateId: string;
  user: User;
  config: Config;
  questions: Array<TQuestionEntity & { score: number, reason: string }>;
  answers: Array<TAnswerEntity>;
  totalScore: number;
};

export type TPostEvaluateAnswers = {
  user: User;
  questions: Array<TQuestionEntity>;
  answers: Array<TAnswerEntity>;
  config: Config;
  recaptchaToken: string;
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

export type TQuestionEntityWithScore = TQuestionEntity & { score: number, reason: string };

export type TGetQuestions = {
  questions: Array<TQuestionEntity>;
  query: string;
};

export type TErrorResponse = {
  error: string;
  key: string;
}

export type TGetQuestionsResponse = Array<TQuestionEntity>;

export type TQuestionsQuery = Yup.InferType<typeof questionsQuerySchema>;
