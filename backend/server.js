const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer")

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Multer setup (store files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // change to your mysql user
  password: "root", // change to your mysql password
  database: "school_db", // change to your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

// ================= CRUD ================= //

// CREATE school (with optional image upload)
app.post("/schools", upload.single("image"), (req, res) => {
  const { name, address, city, state, contact, email } = req.body;
  const image = req.file ? req.file.buffer : null; // store raw image as blob

  const sql =
    "INSERT INTO schools (name, address, city, state, contact, email, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, address, city, state, contact, email, image],
    (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      res.send({ message: "School added", id: result.insertId });
    }
  );
});

//GET image by id
app.get("/schools/:id/image", (req, res) => {
  const sql = "SELECT image FROM schools WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0 || !result[0].image) return res.status(404).send({ message: "Image not found" });

    res.setHeader("Content-Type", "image/jpeg"); // assuming JPG
    res.send(result[0].image);
  });
});


// READ all schools
app.get("/schools", (req, res) => {
  const sql = "SELECT id, name, address, city, state, contact, email FROM schools";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);

    // Add imageUrl field dynamically
    const schoolsWithImageUrl = results.map(s => ({
      ...s,
      imageUrl: `http://localhost:3000/schools/${s.id}/image`
    }));

    res.send(schoolsWithImageUrl);
  });
});

// READ single school by id
app.get("/schools/:id", (req, res) => {
  const sql = "SELECT * FROM schools WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0)
      return res.status(404).send({ message: "School not found" });
    res.send(result[0]);
  });
});

// UPDATE school
app.put("/schools/:id", (req, res) => {
  const { name, address, city, state, contact, email } = req.body;
  const sql =
    "UPDATE schools SET name=?, address=?, city=?, state=?, contact=?, email=? WHERE id=?";
  db.query(
    sql,
    [name, address, city, state, contact, email, req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0)
        return res.status(404).send({ message: "School not found" });
      res.send({ message: "School updated" });
    }
  );
});

// DELETE school
app.delete("/schools/:id", (req, res) => {
  const sql = "DELETE FROM schools WHERE id=?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "School not found" });
    res.send({ message: "School deleted" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
