import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db", "data.json");

export default function handler(req, res) {
  const { password, action } = req.body || {};

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (req.method === "POST" && action === "reset") {
    data.total = 0;
    data.votes = [];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(200).json({ message: "Data reset" });
  }

  res.status(200).json(data);
}
