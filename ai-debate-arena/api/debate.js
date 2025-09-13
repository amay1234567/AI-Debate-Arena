import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function debateHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ use a supported model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // alternative: "gemini-1.5-pro"

    const result = await model.generateContent(query);
    const text = result.response.text();

    res.status(200).json({ text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: err.message || "Failed to generate arguments" });
  }
}
