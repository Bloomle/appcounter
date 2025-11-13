import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db", "data.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, count } = req.body;

    if (!name || !count) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (data.votes.find((v) => v.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ error: "You already voted." });
    }

    data.votes.push({ name, count, date: new Date().toISOString() });
    data.total += count;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ success: true, total: data.total });
  } else {
    res.status(405).end();
  }
}
