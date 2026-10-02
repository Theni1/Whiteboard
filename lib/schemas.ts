import { z } from "zod";

export const Point = z.object({
  type: z.literal("point"),
  id: z.string(),
  x: z.number(),
  y: z.number(),
});

export const Segment = z.object({
  type: z.literal("segment"),
  from: z.string(),
  to: z.string(),
});

export const Label = z.object({
  type: z.literal("label"),
  text: z.string(),
  x: z.number(),
  y: z.number(),
});

export const Shape = z.discriminatedUnion("type", [Point, Segment, Label]);

export const NumberInputExercise = z.object({
  task: z.string(),
  shapes: z.array(Shape),
  answer: z.number(),
});

export const CircleExercise = z.object({
  task: z.string(),
  center: z.object({ x: z.number(), y: z.number() }),
  radius: z.number(),
});

export const LineExercise = z.object({
  task: z.string(),
  slope: z.number(),
  intercept: z.number(),
});

export type Point = z.infer<typeof Point>;
export type Segment = z.infer<typeof Segment>;
export type Label = z.infer<typeof Label>;
export type Shape = z.infer<typeof Shape>;
export type NumberInputExercise = z.infer<typeof NumberInputExercise>;
export type CircleExercise = z.infer<typeof CircleExercise>;
export type LineExercise = z.infer<typeof LineExercise>;
