import OpenAi from "openai";

export async function apiAnswerQuestions(query: string) {
  const openai = new OpenAi({ apiKey: process.env.OPEN_AI_ACCESS_TOKEN });

  // Step 1: send the conversation and available functions to GPT
  const functions = [
    {
      name: "process_answers",
      description: `You will be provideded with json object of questions and answers, |
        Task 1: score the answers. The score should range from 0 to 10, with 10 being very good and 0 being very bad. 
        Task 2: provide reasons for each score in a separate array.`,
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
                score: { type: "number" },
                reason: { type: "string" },
              },
              required: ["questionText", "id", "score", "reason"],
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
        content: `You will be provideded with json object of questions and answers,
      Task 1: score the answers. The score should range from 0 to 10, with 10 being very good and 0 being very bad. 
      Task 2: provide reasons for each score in a separate array.`,
      },
      {
        role: "user",
        content: query,
      },
    ],
    model: "gpt-4o-mini",
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
