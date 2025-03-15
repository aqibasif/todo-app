import { NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import { Todo } from "../lib/models/Todo";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, price } = await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and Price are required" },
        { status: 400 }
      );
    }

    const newTodo = new Todo({ name, price });
    await newTodo.save();

    return NextResponse.json(
      { message: "Todo added successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", errorObj: error },
      { status: 500 }
    );
  }
}

// New GET handler to fetch all Todos
export async function GET() {
  try {
    console.log("CALLING API");
    await connectDB();
    const todos = await Todo.find();
    console.log("API CALLED", todos);

    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", errorObj: error },
      { status: 500 }
    );
  }
}
