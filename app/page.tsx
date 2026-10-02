"use client";

import { useState } from "react";
import NumberInputCard from "@/components/NumberInputCard";
import type { NumberInputExercise } from "@/lib/schemas";

type Message = {
  text: string | null;
  exercise?: NumberInputExercise;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    setMessages((prev) => [...prev, { text: "You: " + input }]);
    setInput("");

    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();

    const tutorMessage: Message = { text: null, exercise: data.exercise };
    if (data.reply) {
      tutorMessage.text = "Tutor: " + data.reply;
    }
    setMessages((prev) => [...prev, tutorMessage]);
  }

  return (
    <main>
      {messages.map((message, i) => (
        <div key={i}>
          {message.text && <p>{message.text}</p>}
          {message.exercise && <NumberInputCard exercise={message.exercise} />}
        </div>
      ))}
      <input className="border" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </main>
  );
}
