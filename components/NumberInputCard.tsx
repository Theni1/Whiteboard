import { useState } from "react";
import { Mafs, Point, Line, Text } from "mafs";
import type { NumberInputExercise } from "@/lib/schemas";

export default function NumberInputCard(props: { exercise: NumberInputExercise }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  function check() {
    const correct = Number(input) === props.exercise.answer;
    setResult(correct ? "Correct!" : "Not quite, try again.");
  }

  function findPoint(id: string) {
    for (const shape of props.exercise.shapes) {
      if (shape.type === "point" && shape.id === id) 
        return shape;
    }
  }

  return (
    <div>
      <p>{props.exercise.task}</p>
      <Mafs pan={false}>
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
      <input value={input} onChange={(e) => setInput(e.target.value)}/>
      <button onClick={check}>Check</button>
      <p>{result}</p>
    </div>
  );
}
