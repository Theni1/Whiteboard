import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";
import { NumberInputExercise, CircleExercise } from "@/lib/schemas";

const openai = new OpenAI();

const SYSTEM_PROMPT = `You're a maths tutor that shows students interactive exercises on a whiteboard.
When the student asks for practice, call a tool. Otherwise reply in one or two plain sentences, no markdown or LaTeX.
For triangles, pick legs a and b from a Pythagorean triple (3-4-5 or 6-8-10) and place the points exactly at (1, 1), (1 + a, 1) and (1, 1 + b).
Label every side with its length or "?", placing the labels exactly at (1 + a/2, 0.3), (0.3, 1 + b/2) and (1.6 + a/2, 1.6 + b/2).
For circles, use a whole-number center (not the origin) and radius, keep the whole circle between -5 and 5, and state both in the task.`;

const tools = [
  zodFunction({
    name: "create_number_input_exercise",
    description: "Show a right triangle where the student calculates a side length and types it in.",
    parameters: NumberInputExercise,
  }),
  zodFunction({
    name: "create_circle_exercise",
    description: "Show a grid where the student drags a center and an edge point to draw a given circle.",
    parameters: CircleExercise,
  }),
];

export async function POST(request: Request) {
  const body = await request.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: body.message },
    ],
    tools: tools,
  });

  const message = completion.choices[0].message;
  const toolCall = message.tool_calls?.[0];

  if (!toolCall || toolCall.type !== "function") {
    return Response.json({ reply: message.content });
  }

  const tool = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);

  if (tool === "create_circle_exercise") {
    const exercise = CircleExercise.parse(args);
    return Response.json({ reply: message.content, tool: tool, exercise: exercise });
  }

  const exercise = NumberInputExercise.parse(args);
  return Response.json({ reply: message.content, tool: tool, exercise: exercise });
}
