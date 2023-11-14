import { apisendQuestion } from "./api/apiSendQuestion";
import { saveQuestions } from "./queries/saveQuestions";

export const generateQuestionsPrompt = (
  questionsNum: string,
  role: string,
  experienceLevel: string
) => {
  return `Can you generate ${questionsNum} interview questions for the role of ${role} with the experience level of ${experienceLevel}?`;
};

export async function sendAndProcessQuestions(
  db: FirebaseFirestore.Firestore,
  question: string
) {
  const { function_call } = await apisendQuestion(question.toString());
  const functionName = function_call?.name;
  const availableFunctions: Record<string, any> = {
    save_questions: saveQuestions,
  }; // only one function in this example, but you can have multiple

  if (function_call && functionName && functionName in availableFunctions) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors

    const functionToCall = availableFunctions[functionName];
    const functionArgs = JSON.parse(function_call.arguments);
    
    await functionToCall(
      db,
      functionArgs.questions,
      question.toString()
    );

    return { questions: functionArgs.questions };
  }
  return { questions: [], functionResponse: null };
}
