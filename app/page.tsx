"use client";

import NumberInputCard from "@/components/NumberInputCard";

export default function Home() {
  return (
    <main>
      <NumberInputCard
        exercise={{
          task: "What is the length of the hypotenuse?",
          shapes: [
            { type: "point", id: "A", x: 0, y: 0 },
            { type: "point", id: "B", x: 4, y: 0 },
            { type: "point", id: "C", x: 0, y: 3 },
            { type: "segment", from: "A", to: "B" },
            { type: "segment", from: "A", to: "C" },
            { type: "segment", from: "B", to: "C" },
            { type: "label", text: "4", x: 2, y: -0.4 },
            { type: "label", text: "3", x: -0.4, y: 1.5 },
            { type: "label", text: "?", x: 2.3, y: 1.8 },
          ],
          answer: 5,
        }}
      />
    </main>
  );
}
