import * as Yup from "yup";
import { questionEntitySchema } from "./questionsSchema";

export const answerEntitySchema = Yup.object()
  .shape({
    questionId: Yup.string().required(),
    answer: Yup.string().required(),
    timeTaken: Yup.number().required(),
  })
  .required();

export const evaluateAnswersSchema = Yup.object().shape({
  answers: Yup.array().of(answerEntitySchema).required(),
  questions: Yup.array().of(questionEntitySchema).required(),
}).defined();

export const evaluatedAnswersSchema = Yup.object({
  questions: Yup.array()
    .of(
      questionEntitySchema.concat(
        Yup.object().shape({
          score: Yup.number().min(0).max(10).required(),
        })
      )
    )
    .required(),
});

export const evaluatedAnswersResponse = evaluatedAnswersSchema.concat(
  Yup.object({ totalScore: Yup.number().min(0).max(10).required() })
).defined();
