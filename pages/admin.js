import { useState, useEffect } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCount, setEditCount] = useState("");

  // 🔑 Login & Daten laden
async function login() {
  const res = await fetch(`/api/admin?password=${password}`);
  if (res.ok) {
    const result = await res.json();
    setData(result);
    setError("");
  } else {
    const result = await res.json();
    setError(result.error);
  }
}


  async function reload() {
    const res = await fetch(`/api/admin?password=${password}`);
    const result = await res.json();
    setData(result);
  }

  async function reset() {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "reset" }),
    });
    reload();
  }

  // 🗑️ Stimme löschen
  async function deleteVote(name) {
    await fetch("/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, name }),
    });
    reload();
  }

  // ✏️ Stimme bearbeiten
  async function saveEdit() {
    await fetch("/api/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        oldName: editing,
        newName: editName,
        newCount: editCount,
      }),
    });
    setEditing(null);
    reload();
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
    {/* 🔙 Zurück-Button */}
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl text-blue-500">Admin Dashboard</h1>
      <button
        onClick={() => (window.location.href = "/")}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
      >
        ← Zurück zur Hauptseite
      </button>
    </div>

    <p className="mb-2 font-semibold">Gesamt: {data.total}</p>

    <button
      onClick={reset}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-6"
    >
      Alles zurücksetzen
    </button>

      <p className="mb-2 font-semibold">Gesamt: {data.total}</p>

      <button
        onClick={reset}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-6"
      >
        Alles zurücksetzen
      </button>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Personen</th>
            <th className="p-2 text-left">Datum</th>
            <th className="p-2 text-left">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {data.votes.map((v, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">
                {editing === v.name ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border rounded p-1"
                  />
                ) : (
                  v.name
                )}
              </td>
              <td className="p-2">
                {editing === v.name ? (
                  <input
                    type="number"
                    value={editCount}
                    onChange={(e) => setEditCount(e.target.value)}
                    className="border rounded p-1 w-16"
                  />
                ) : (
                  v.count
                )}
              </td>
              <td className="p-2">
                {new Date(v.date).toLocaleString("de-DE")}
              </td>
              <td className="p-2 flex gap-2">
                {editing === v.name ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Abbrechen
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(v.name);
                        setEditName(v.name);
                        setEditCount(v.count);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => deleteVote(v.name)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Löschen
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
