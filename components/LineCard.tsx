import { useState } from "react";
import { Mafs, Coordinates, Line, useMovablePoint } from "mafs";
import type { LineExercise } from "@/lib/schemas";

export default function LineCard(props: {
  exercise: LineExercise;
  onCheck: (summary: string) => void;
}) {
  const a = useMovablePoint([-2, -1]);
  const b = useMovablePoint([2, 1]);

  const slope = (b.y - a.y) / (b.x - a.x);
  const intercept = a.y - slope * a.x;

  const [result, setResult] = useState("");

  function check() {
    const correct =
      Math.abs(slope - props.exercise.slope) < 0.2 &&
      Math.abs(intercept - props.exercise.intercept) < 0.2;
    setResult(correct ? "Correct!" : "Not quite, try again.");
    if (!correct) {
      props.onCheck(
        `[Result] Task: "${props.exercise.task}". ` +
          `Student drew y = ${slope.toFixed(1)}x + ${intercept.toFixed(1)}.`
      );
    }
  }

  return (
    <div className="my-3 rounded border border-stone-400 bg-white p-4">
      <p className="mb-3 font-medium">{props.exercise.task}</p>
      <div className="flex justify-center">
        <Mafs width={400} height={400} pan={false} viewBox={{ x: [-6, 6], y: [-6, 6] }}>
          <Coordinates.Cartesian />
          <Line.ThroughPoints point1={a.point} point2={b.point} />
          {a.element}
          {b.element}
        </Mafs>
      </div>
      <p className="mt-3 text-stone-600">
        y = {slope.toFixed(1)}x + {intercept.toFixed(1)}
      </p>
      <button className="mt-3 rounded border border-stone-500 px-4 py-2" onClick={check}>
        Check
      </button>
      <p className={"mt-2 " + (result === "Correct!" ? "text-green-700" : "text-red-700")}>{result}</p>
    </div>
  );
}
