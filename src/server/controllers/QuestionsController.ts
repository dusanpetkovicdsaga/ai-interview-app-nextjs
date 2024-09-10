import {
  SCHEMA,
  TErrorResponse,
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
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { apiVerifyRecaptcha } from "../api/apiVerifyRecaptcha";
import { saveSession } from "../queries/saveSession";
import { apiSendSuccessMail } from "../api/apiSendSuccessMail";



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
        result.id = data.resultId;
        return result as { results: TScoreEntity };
      } else {
        throw new Error("invalid id provided");
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async callEvaluateAnswers(
    data: any
  ): Promise<Boolean | TErrorResponse> {
    const { answers, questions, config, user, recaptchaToken } =
      (await SCHEMA.evaluateAnswersSchema.validate(
        data
      )) as TPostEvaluateAnswers;

    const validation = await apiVerifyRecaptcha(recaptchaToken);
    if (validation.success === false) {
      return { error: "Recaptcha validation failed", key: "recaptcha" };
    }

    saveSession(this.db, { answers, questions, config, user });

    // genrate a query baseed on the questions and answers arrays, to concatonate the questions and answers into one array of strings to be sent to the model

    const query = generateAnswersPrompt(
      JSON.stringify(
        questions.map((q, index) => ({ ...q, answer: answers[index].answer }))
      ),
      config
    );

    console.info({
      query,
    });

    const processedAnswers = await processAnswers(query);

    const totalScore =
      processedAnswers.questions.reduce((acc, curr) => acc + curr.score, 0) /
      processedAnswers.questions.length;

    // generate unique id for the result

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const certificateId = `${user.email}-${formattedDate}-${crypto
      .createHash("sha1")
      .update(uuidv4() + formattedDate)
      .digest("hex")}`;

    const score = {
      certificateId: certificateId,
      config,
      user,
      questions: processedAnswers.questions ? processedAnswers.questions : [],
      answers,
      totalScore,
    };

    const result = await saveResults(this.db, score);

    const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME;

    const resultLink = `${HOSTNAME}/results/${result.resultId}`;

    return apiSendSuccessMail(resultLink, user)




  }

  async callGenerateQuestions(
    data: any
  ): Promise<TGetQuestionsResponse | TErrorResponse> {
    const { role, experienceLevel, questionsNum, recaptchaToken } =
      await SCHEMA.questionsQuerySchema.validate(data);

    const validation = await apiVerifyRecaptcha(recaptchaToken);
    if (validation.success === false) {
      return { error: "Recaptcha validation failed", key: "recaptcha" };
    }

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
