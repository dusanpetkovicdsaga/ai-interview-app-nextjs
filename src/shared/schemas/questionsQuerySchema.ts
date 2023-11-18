import * as Yup from "yup";
import {
  experienceLevels,
  interviewQuestionsCount,
  interviewRoles,
} from "../../constants";
import { TExperienceLevelKeys, TInterviewRoleKeys } from "@/shared";

export const questionsQuerySchema = Yup.object().shape({
  role: Yup.string<TInterviewRoleKeys>()
    .oneOf(Object.keys(interviewRoles) as TInterviewRoleKeys[])
    .required(),
  experienceLevel: Yup.string<TExperienceLevelKeys>()
    .oneOf(Object.keys(experienceLevels) as TExperienceLevelKeys[])
    .required(),
  questionsNum: Yup.number().oneOf(interviewQuestionsCount).required(),
});
