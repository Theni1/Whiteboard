import { useState } from "react";
import { Mafs, Coordinates, Circle, useMovablePoint } from "mafs";
import type { CircleExercise } from "@/lib/schemas";

export default function CircleCard(props: {
  exercise: CircleExercise;
  onCheck: (summary: string) => void;
}) {
  const center = useMovablePoint([0, 0]);
  const edge = useMovablePoint([2, 0]);

  const dx = edge.x - center.x;
  const dy = edge.y - center.y;
  const radius = Math.sqrt(dx * dx + dy * dy);

  const [result, setResult] = useState("");

  function check() {
    const correct =
      Math.round(center.x) === props.exercise.center.x &&
      Math.round(center.y) === props.exercise.center.y &&
      Math.abs(radius - props.exercise.radius) < 0.2;
    setResult(correct ? "Correct!" : "Not quite, try again.");
    if (!correct) {
      props.onCheck(
        `[Result] Task: "${props.exercise.task}". ` +
          `Student drew center (${center.x.toFixed(1)}, ${center.y.toFixed(1)}), radius ${radius.toFixed(1)}.`
      );
    }
  }

  return (
    <div className="my-3 rounded border border-stone-400 bg-white p-4">
      <p className="mb-3 font-medium">{props.exercise.task}</p>
      <div className="flex justify-center">
        <Mafs width={400} height={400} pan={false} viewBox={{ x: [-6, 6], y: [-6, 6] }}>
          <Coordinates.Cartesian />
          <Circle center={center.point} radius={radius} />
          {center.element}
          {edge.element}
        </Mafs>
      </div>
      <p className="mt-3 text-stone-600">
        Center ({center.x.toFixed(1)}, {center.y.toFixed(1)}), radius {radius.toFixed(1)}
      </p>
      <button className="mt-3 rounded border border-stone-500 px-4 py-2" onClick={check}>
        Check
      </button>
      <p className={"mt-2 " + (result === "Correct!" ? "text-green-700" : "text-red-700")}>{result}</p>
    </div>
  );
}
