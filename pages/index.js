import { useState, useEffect } from "react";

export default function Home() {
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/count")
      .then((res) => res.json())
      .then((data) => setTotal(data.total));
  }, []);

  async function handleVote(count) {
    if (!name.trim()) {
      setError("Bitte gib deinen Namen ein.");
      return;
    }
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, count }),
      });
      const data = await res.json();
      if (data.success) {
        setTotal(data.total);
        setVoted(true);
      } else setError(data.error);
    } catch {
      setError("Etwas ist schiefgelaufen.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700">
      <h1 className="text-3xl font-semibold mb-4 text-blue-500">
        Teilnehmer-Counter
      </h1>

      <div className="w-80 bg-gray-100 rounded p-6 shadow">
        {!voted ? (
          <>
            <input
              type="text"
              placeholder="Vor- und Nachname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <button
              onClick={() => handleVote(1)}
              className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Ich bringe eine Person mit
            </button>
            <button
              onClick={() => handleVote(2)}
              className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Ich bringe zwei Personen mit
            </button>
            <button
              onClick={() => handleVote(3)}
              className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Ich bringe drei Personen mit
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        ) : (
          <p className="text-center text-green-600 font-semibold">
            Danke für deine Anmeldung!
          </p>
        )}
      </div>

      {/* Fortschrittsleiste */}
      <div className="w-80 bg-gray-200 rounded-full h-4 mt-6">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${Math.min((total / 250) * 100, 100)}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-500">{total} Teilnehmer</p>

      <a href="/admin" className="mt-4 text-blue-500 underline text-sm">
        Admin Login
      </a>
    </div>
  );
}
