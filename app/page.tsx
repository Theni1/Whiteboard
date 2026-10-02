"use client";

import { useState } from "react";
import NumberInputCard from "@/components/NumberInputCard";
import CircleCard from "@/components/CircleCard";
import type { NumberInputExercise, CircleExercise } from "@/lib/schemas";

type Message = {
  text: string | null;
  numberExercise?: NumberInputExercise;
  circleExercise?: CircleExercise;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input) return;
    setMessages((prev) => [...prev, { text: "You: " + input }]);
    setInput("");

    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();

    const tutorMessage: Message = { text: null };
    if (data.reply) {
      tutorMessage.text = "Tutor: " + data.reply;
    }
    if (data.tool === "create_number_input_exercise") {
      tutorMessage.numberExercise = data.exercise;
    }
    if (data.tool === "create_circle_exercise") {
      tutorMessage.circleExercise = data.exercise;
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
              {message.text && <p>{message.text}</p>}
              {message.numberExercise && <NumberInputCard exercise={message.numberExercise} />}
              {message.circleExercise && <CircleCard exercise={message.circleExercise} />}
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
