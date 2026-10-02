"use client";

import { useState } from "react";
import NumberInputCard from "@/components/NumberInputCard";
import CircleCard from "@/components/CircleCard";
import LineCard from "@/components/LineCard";
import type { NumberInputExercise, CircleExercise, LineExercise } from "@/lib/schemas";

type Message = {
  role: "student" | "tutor";
  text: string | null;
  numberExercise?: NumberInputExercise;
  circleExercise?: CircleExercise;
  lineExercise?: LineExercise;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  function send() {
    if (!input) return;
    setMessages((prev) => [...prev, { role: "student", text: input }]);
    setInput("");
    ask(input);
  }

  async function ask(text: string) {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();

    const tutorMessage: Message = { role: "tutor", text: data.reply };
    if (data.tool === "create_number_input_exercise") {
      tutorMessage.numberExercise = data.exercise;
    }
    if (data.tool === "create_circle_exercise") {
      tutorMessage.circleExercise = data.exercise;
    }
    if (data.tool === "create_line_exercise") {
      tutorMessage.lineExercise = data.exercise;
    }
    setMessages((prev) => [...prev, tutorMessage]);
  }

  return (
    <main className="h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex h-full max-w-2xl flex-col px-4">
        <h1 className="border-b border-stone-400 py-4 text-center text-2xl font-medium">Whiteboard</h1>
        <div className="flex-1 overflow-y-auto py-4">
          {messages.map((message, i) => (
            <div key={i}>
              {message.text && message.role === "student" && (
                <p className="my-3 ml-auto w-fit max-w-[80%] rounded bg-stone-200 px-3 py-2">{message.text}</p>
              )}
              {message.text && message.role === "tutor" && (
                <p className="my-3 max-w-[80%] border-l-2 border-stone-400 pl-3">{message.text}</p>
              )}
              {message.numberExercise && <NumberInputCard exercise={message.numberExercise} onCheck={ask} />}
              {message.circleExercise && <CircleCard exercise={message.circleExercise} onCheck={ask} />}
              {message.lineExercise && <LineCard exercise={message.lineExercise} onCheck={ask} />}
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-stone-400 pt-4 pb-10">
          <input
            className="flex-1 rounded border border-stone-500 bg-white px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="rounded border border-stone-500 bg-white px-4" onClick={send}>
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
