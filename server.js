const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "database.json");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function lerDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function salvarDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Ver estoque
app.get("/api/estoque", (req, res) => {
  const db = lerDB();
  res.json(db.estoque);
});

// Adicionar estoque (admin)
app.post("/api/adicionar", (req, res) => {
  const { lista } = req.body;

  if (!lista) {
    return res.status(400).json({ erro: "Lista vazia" });
  }

  const itens = lista
    .split("\n")
    .map(i => i.trim())
    .filter(i => i.length > 0);

  const db = lerDB();
  db.estoque.push(...itens);
  salvarDB(db);

  res.json({ sucesso: true, adicionados: itens.length });
});

// Comprar (retira 1 item)
app.post("/api/comprar", (req, res) => {
  const db = lerDB();

  if (db.estoque.length === 0) {
    return res.json({ erro: "Sem estoque" });
  }

  const item = db.estoque.shift();
  salvarDB(db);

  res.json({ item });
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
