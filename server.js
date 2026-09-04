import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let contacts = [];
let nextId = 1;

app.get("/contacts", (_req, res) => {
  res.json(contacts);
});

app.post("/contacts", (req, res) => {
  const { name, email, phone } = req.body ?? {};

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required." });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Email must contain an @ symbol." });
  }

  const contact = {
    id: nextId++,
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() ?? "",
  };
  contacts.push(contact);
  res.status(201).json(contact);
});

app.delete("/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Contact not found." });
  }
  contacts.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Contacts API running on http://localhost:${PORT}`);
});
