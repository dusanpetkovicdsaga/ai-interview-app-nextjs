import OpenAi from "openai";

export async function apisendQuestion(question: string) {
  const openai = new OpenAi({ apiKey: process.env.OPEN_AI_ACCESS_TOKEN });

  // Step 1: send the conversation and available functions to GPT
  const functions = [
    {
      name: "save_questions",
      description:
        "Create a list of questions for a tech interview for a given role and seniority level.",
      parameters: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionText: {
                  type: "string",
                },
                id: {
                  type: "string",
                },
              },
              required: ["questionText", "id"],
            },
          },
        },
        required: ["questions"],
      },
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: question }],
    model: "gpt-3.5-turbo",
    functions,
    function_call: "auto",
  });

  console.info(completion.choices, { structuredData: true });
  const responseMessage = completion.choices[0].message;

  return {
    message: responseMessage.content,
    function_call: responseMessage.function_call,
    role: responseMessage.role,
  };
}
