const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "doacoes_db",
    password: "ph2910",
    port: 5432
});

app.get("/", (req, res) => {
    res.send("API rodando 🚀");
});


app.get("/campanhas", async(req, res) => {
    try {
        const result = await pool.query("SELECT * FROM campanhas ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar campanhas");
    }
});


app.post("/doar", async(req, res) => {
    const { id, valor, usuario } = req.body;

    try {

        const user = await pool.query(
            "SELECT id FROM usuarios WHERE email = $1", [usuario]
        );

        const usuario_id = user.rows.length > 0 ? user.rows[0].id : null;

        await pool.query(
            "UPDATE campanhas SET arrecadado = arrecadado + $1 WHERE id = $2", [valor, id]
        );

        await pool.query(
            "INSERT INTO doacoes (usuario_id, campanha_id, valor) VALUES ($1, $2, $3)", [usuario_id, id, valor]
        );

        const result = await pool.query(
            "SELECT * FROM campanhas WHERE id = $1", [id]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao doar");
    }
});

app.post("/register", async(req, res) => {
    const { email, senha } = req.body;

    try {
        const existe = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1", [email]
        );

        if (existe.rows.length > 0) {
            return res.json({ success: false, message: "Usuário já existe" });
        }

        await pool.query(
            "INSERT INTO usuarios (email, senha) VALUES ($1, $2)", [email, senha]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro no cadastro");
    }
});


app.post("/login", async(req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1 AND senha = $2", [email, senha]
        );

        if (result.rows.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro no login");
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000 ");
});