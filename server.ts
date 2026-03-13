import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("health.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT DEFAULT 'default_user',
    age INTEGER,
    gender TEXT,
    height REAL,
    weight REAL,
    bloodPressureSystolic INTEGER,
    bloodPressureDiastolic INTEGER,
    bloodSugar REAL,
    heartRate INTEGER,
    sleepHours REAL,
    isSmoking INTEGER,
    exerciseFrequency TEXT,
    symptoms TEXT,
    predictionData TEXT,
    recommendations TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rating INTEGER,
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const reviewCountResult = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
if (reviewCountResult && reviewCountResult.count === 0) {
  const insert = db.prepare('INSERT INTO reviews (name, rating, comment) VALUES (@name, @rating, @comment)');
  const insertMany = db.transaction((reviews) => {
    for (const review of reviews) insert.run(review);
  });

  insertMany([
    { name: 'John Doe', rating: 5, comment: 'This is a great app!' },
    { name: 'Jane Smith', rating: 4, comment: 'I really like the new features.' },
    { name: 'Peter Jones', rating: 5, comment: 'Wow, amazing!' },
  ]);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/records", (req, res) => {
    const {
      age, gender, height, weight,
      bloodPressureSystolic, bloodPressureDiastolic,
      bloodSugar, heartRate, sleepHours,
      isSmoking, exerciseFrequency, symptoms,
      predictionData, recommendations
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO health_records (
        age, gender, height, weight,
        bloodPressureSystolic, bloodPressureDiastolic,
        bloodSugar, heartRate, sleepHours,
        isSmoking, exerciseFrequency, symptoms,
        predictionData, recommendations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      age, gender, height, weight,
      bloodPressureSystolic, bloodPressureDiastolic,
      bloodSugar, heartRate, sleepHours,
      isSmoking ? 1 : 0, exerciseFrequency, symptoms,
      JSON.stringify(predictionData), recommendations
    );

    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/records", (req, res) => {
    const records = db.prepare("SELECT * FROM health_records ORDER BY createdAt DESC").all();
    res.json(records.map(r => ({
      ...r,
      predictionData: JSON.parse(r.predictionData as string),
      isSmoking: !!r.isSmoking
    })));
  });

  app.post("/api/reviews", (req, res) => {
    const { name, rating, comment } = req.body;
    const stmt = db.prepare("INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)");
    const result = stmt.run(name, rating, comment);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/reviews", (req, res) => {
    const reviews = db.prepare("SELECT * FROM reviews ORDER BY createdAt DESC").all();
    res.json(reviews);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
