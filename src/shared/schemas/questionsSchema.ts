import * as Yup from "yup";

export const questionEntitySchema = Yup.object().shape({
  questionText: Yup.string().required(),
  id: Yup.string().required(),
}).required();

export const getQuestionsSchema = Yup.object().shape({
  query: Yup.string().required(),
  questions: Yup.array().of(questionEntitySchema).required(),
});
