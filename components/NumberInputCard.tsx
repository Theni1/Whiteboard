import { useState } from "react";
import { Mafs, Point, Line, Text } from "mafs";
import type { NumberInputExercise } from "@/lib/schemas";

export default function NumberInputCard(props: {
  exercise: NumberInputExercise;
  onCheck: (summary: string) => void;
}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  function check() {
    const correct = Number(input) === props.exercise.answer;
    setResult(correct ? "Correct!" : "Not quite, try again.");
    props.onCheck(
      `[Result] Task: "${props.exercise.task}" (answer ${props.exercise.answer}). ` +
        `Student answered ${input}. ${correct ? "Correct" : "Incorrect"}.`
    );
  }

  function findPoint(id: string) {
    for (const shape of props.exercise.shapes) {
      if (shape.type === "point" && shape.id === id)
        return shape;
    }
  }

  // Code so the view fits the triangle.
  let biggest = 0;
  for (const shape of props.exercise.shapes) {
    if (shape.type === "point") {
      biggest = Math.max(biggest, shape.x, shape.y);
    }
  }
  const size = biggest + 1;

  return (
    <div className="my-3 rounded border border-stone-400 bg-white p-4">
      <p className="mb-3 font-medium">{props.exercise.task}</p>
      <div className="flex justify-center">
        <Mafs width={400} height={400} pan={false} viewBox={{ x: [0, size], y: [0, size] }}>
          {props.exercise.shapes.map((shape, i) => {
            if (shape.type === "point") {
              return <Point key={i} x={shape.x} y={shape.y} />;
            }
            if (shape.type === "segment") {
              const from = findPoint(shape.from);
              const to = findPoint(shape.to);
              if (!from || !to)
                return null;
              return <Line.Segment key={i} point1={[from.x, from.y]} point2={[to.x, to.y]} />;
            }
            if (shape.type === "label") {
              return <Text key={i} x={shape.x} y={shape.y}>{shape.text}</Text>;
            }
            return null;
          })}
        </Mafs>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="w-32 rounded border border-stone-500 px-3 py-2"
          placeholder="Your answer"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="rounded border border-stone-500 px-4" onClick={check}>
          Check
        </button>
      </div>
      <p className={"mt-2 " + (result === "Correct!" ? "text-green-700" : "text-red-700")}>{result}</p>
    </div>
  );
}
