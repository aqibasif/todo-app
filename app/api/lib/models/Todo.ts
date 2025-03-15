import { Schema, model, models } from "mongoose";

const TodoSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Todo = models.Todo || model("Todo", TodoSchema);
