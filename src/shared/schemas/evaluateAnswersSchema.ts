import * as Yup from "yup";
import { questionEntitySchema } from "./questionsSchema";

export const answerEntitySchema = Yup.object()
  .shape({
    questionId: Yup.string().required(),
    answer: Yup.string().required(),
    timeTaken: Yup.number().required(),
  })
  .required();

export const evaluateAnswersSchema = Yup.object()
  .shape({
    user: Yup.object({
      email: Yup.string().email().required(),
    }).required(),
    answers: Yup.array().of(answerEntitySchema).required(),
    questions: Yup.array().of(questionEntitySchema).required(),
    config: Yup.object({
      role: Yup.string().required(),
      experienceLevel: Yup.string().required(),
      questionsNum: Yup.number().required(),
      timeLimitPerQuestion: Yup.number().required(),
      sendResultsToEmail: Yup.boolean().required(),
    }).required(),
  })
  .defined();

export const evaluatedAnswersSchema = Yup.object({
  questions: Yup.array()
    .of(
      questionEntitySchema.concat(
        Yup.object().shape({
          score: Yup.number().min(0).max(10).required(),
          reason: Yup.string().required(),
        })
      )
    )
    .required(),
});

export const evaluatedAnswersResponse = evaluatedAnswersSchema
  .concat(Yup.object({ totalScore: Yup.number().min(0).max(10).required() }))
  .defined();
