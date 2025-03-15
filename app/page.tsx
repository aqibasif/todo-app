"use client";

import { useState, useEffect, FormEvent } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [todos, setTodos] = useState<
    { _id: string; name: string; price: number }[]
  >([]);

  // Fetch all Todos
  const fetchTodos = async () => {
    const response = await fetch("/api/todo");
    const data = await response.json();
    if (response.ok) {
      setTodos(data.todos);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price) {
      setMessage("Both fields are required!");
      return;
    }

    const response = await fetch("/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price) }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Entry added successfully!");
      setName("");
      setPrice("");

      setTimeout(() => setMessage(""), 2000);
      fetchTodos(); // Update table after adding a new Todo
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div
      className='flex flex-col items-center justify-center min-h-screen space-y-4'
      style={{
        backgroundImage:
          "radial-gradient(circle 715px at 23.4% -21.8%,#294590 .2%,#02112a 100.2%)",
      }}
    >
      <h1 className='text-2xl font-bold'>Grocery App</h1>

      <form
        onSubmit={addTodo}
        className='flex flex-col items-stretch space-y-2'
      >
        <input
          type='text'
          placeholder='Name'
          className='border p-2 rounded'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type='number'
          placeholder='Price'
          className='border p-2 rounded'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'
        >
          Add Entry
        </button>
      </form>

      {message && (
        <p
          className={`text-${
            message?.includes("successfully") ? "green" : "red"
          }-500`}
        >
          {message}
        </p>
      )}

      {/* Todo Table */}
      <table className='border-collapse border border-gray-300 w-2/3 mt-4'>
        <thead>
          <tr className='bg-gray-200'>
            {["Item", "Price"].map((title) => (
              <th
                key={title}
                className='border bg-gray-600 text-left border-gray-300 p-2'
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo._id}>
              <td className='border border-gray-300 p-2'>{todo.name}</td>
              <td className='border border-gray-300 p-2'>
                Rs: {todo.price?.toLocaleString()}
              </td>
            </tr>
          ))}
          <tr>
            <td className='bg-gray-800 border border-gray-300 p-2'>Total</td>
            <td className='bg-gray-800 border border-gray-300 p-2'>
              Rs:{" "}
              {todos
                .reduce((acc, todo) => acc + todo.price, 0)
                ?.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
