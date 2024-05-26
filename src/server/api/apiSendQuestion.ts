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
    messages: [
      {
        role: "system",
        content:
          "You will be provided the job role, seniority level, your task is to generate a number of questions for a technical IT interview and return a result valid JSON object.",
      },
      {
        role: "user",
        content: question,
      },
    ],
    model: "gpt-3.5-turbo",
    functions,
    function_call: "auto",
    temperature: 0.5,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(completion.choices, { structuredData: true });
  const responseMessage = completion.choices[0].message;

  return {
    message: responseMessage.content,
    function_call: responseMessage.function_call,
    role: responseMessage.role,
  };
}
