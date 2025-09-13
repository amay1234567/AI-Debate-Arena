import express from "express";
import dotenv from "dotenv";
import debateHandler from "./api/debate.js"; // 👈 make sure debate.js uses `export default`

dotenv.config();

const app = express();
app.use(express.json());

// Mount debate route
app.post("/api/debate", debateHandler); // no need to wrap in arrow function

// Serve static frontend
app.use(express.static("public"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
