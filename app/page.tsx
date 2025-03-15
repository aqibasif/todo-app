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
      setMessage("Todo added successfully!");
      setName("");
      setPrice("");
      fetchTodos(); // Update table after adding a new Todo
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
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

      {message && <p className='text-green-500'>{message}</p>}

      {/* Todo Table */}
      <table className='border-collapse border border-gray-300 w-2/3 mt-4'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border bg-gray-600 text-left border-gray-300 p-2'>
              Item
            </th>
            <th className='border bg-gray-600 text-left border-gray-300 p-2'>
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo._id}>
              <td className='border border-gray-300 p-2'>{todo.name}</td>
              <td className='border border-gray-300 p-2'>${todo.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
