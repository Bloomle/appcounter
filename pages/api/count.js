import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db", "data.json");

export default function handler(req, res) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.status(200).json({ total: data.total });
}
