import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function login() {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = await res.json();
    if (res.ok) setData(result);
    else setError(result.error);
  }

  async function reset() {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "reset" }),
    });
    setData({ total: 0, votes: [] });
  }

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 rounded"
        />
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4 text-blue-500">Admin Dashboard</h1>
      <p className="mb-2">Gesamt: {data.total}</p>
      <button
        onClick={reset}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4"
      >
        Reset
      </button>
      <ul>
        {data.votes.map((v, i) => (
          <li key={i}>
            {v.name} (+{v.count}) — {new Date(v.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
