import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";
import { NumberInputExercise } from "@/lib/schemas";

const openai = new OpenAI();

const tools = [
  zodFunction({
    name: "create_number_input_exercise",
    description: "Show a right triangle where the student calculates a side length and types it in.",
    parameters: NumberInputExercise,
  }),
];

export async function POST(request: Request) {
  const body = await request.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      { role: "system", content: "You are a friendly maths tutor for students aged 13 to 18." },
      { role: "user", content: body.message },
    ],
    tools: tools,
  });

  const message = completion.choices[0].message;
  const toolCall = message.tool_calls?.[0];

  if (!toolCall || toolCall.type !== "function") {
    return Response.json({ reply: message.content });
  }

  const args = JSON.parse(toolCall.function.arguments);
  const exercise = NumberInputExercise.parse(args);

  return Response.json({ reply: message.content, exercise: exercise });
}
