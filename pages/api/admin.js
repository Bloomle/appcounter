import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db", "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
 const password =
  req.method === "GET" ? req.query.password : req.body?.password;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }

  let data = readData();

  // 🟢 GET → Daten abrufen
  if (req.method === "GET") {
    return res.status(200).json(data);
  }

  // 🔴 DELETE → Eine Stimme löschen
  if (req.method === "DELETE") {
    const { name } = req.body;
    const vote = data.votes.find((v) => v.name === name);
    if (!vote) return res.status(404).json({ error: "Vote not found" });

    data.total -= vote.count;
    data.votes = data.votes.filter((v) => v.name !== name);
    writeData(data);

    return res.status(200).json({ success: true, data });
  }

  // ✏️ PUT → Stimme bearbeiten
  if (req.method === "PUT") {
    const { oldName, newName, newCount } = req.body;
    const vote = data.votes.find((v) => v.name === oldName);
    if (!vote) return res.status(404).json({ error: "Vote not found" });

    // Counter neu berechnen
    data.total = data.total - vote.count + parseInt(newCount);

    vote.name = newName;
    vote.count = parseInt(newCount);
    vote.date = new Date().toISOString();

    writeData(data);

    return res.status(200).json({ success: true, data });
  }

  // 🔄 POST (Reset)
  if (req.method === "POST" && req.body.action === "reset") {
    data.total = 0;
    data.votes = [];
    writeData(data);
    return res.status(200).json({ message: "Data reset" });
  }

  res.status(405).end();
}
