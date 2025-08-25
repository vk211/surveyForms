import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Rate limiting middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});

// JWT auth middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(limiter);

const mongoUrl = "mongodb://localhost:27017/";

const usersDbName = "usersdb";
const formsDbName = "userformsdb";
let usersDb: any;
let formsDb: any;

MongoClient.connect(mongoUrl)
  .then((client) => {
    usersDb = client.db(usersDbName);
    formsDb = client.db(formsDbName);
    console.log("✅ Connected to MongoDB (usersdb, userformsdb)");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.get("/", (_req, res) => {
  res.send("Survey backend is running 🚀");
});

// Handle survey response submissions

// User signup
app.post("/api/signup", async (req, res) => {
  try {
    if (!usersDb) return res.status(500).json({ message: "Database not connected" });
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const existing = await usersDb.collection("users").findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersDb.collection("users").insertOne({ email, password: hashedPassword });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// User signin
app.post("/api/signin", async (req, res) => {
  try {
    if (!usersDb) return res.status(500).json({ message: "Database not connected" });
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const user = await usersDb.collection("users").findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    // Issue JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ message: "Signin successful", token });
  } catch (err) {
    res.status(500).json({ message: "Signin failed" });
  }
});

// Save user form (JWT protected)
app.post("/api/userform", authenticateToken, async (req: any, res: any) => {
  try {
    if (!formsDb || !usersDb) return res.status(500).json({ message: "Database not connected" });
    const { name, age, email } = req.body;
    if (!name || !age || !email) return res.status(400).json({ message: "All fields required" });
    // Email in token must match email in form
    if (req.user.email !== email) return res.status(403).json({ message: "Token/email mismatch" });
    const user = await usersDb.collection("users").findOne({ email });
    if (!user) return res.status(403).json({ message: "Email not registered" });
    const result = await formsDb.collection("userforms").insertOne({ name, age, email });
    res.status(201).json({ message: "Form saved", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Failed to save form" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
