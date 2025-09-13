import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [proArgument, setProArgument] = useState("");
  const [conArgument, setConArgument] = useState("");
  const [proScore, setProScore] = useState(0);
  const [conScore, setConScore] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateArguments() {
    if (!topic.trim()) { setMessage("Please enter a topic."); return; }

    setMessage("");
    setLoading(true);
    setProArgument(""); setConArgument(""); setProScore(0); setConScore(0);

    try {
      const [proRes, conRes] = await Promise.all([
        fetch("/api/debate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `Write a persuasive argument FOR the topic: '${topic}'.` })
        }),
        fetch("/api/debate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `Write a persuasive argument AGAINST the topic: '${topic}'.` })
        })
      ]);

      const proData = await proRes.json();
      const conData = await conRes.json();

      if (!proRes.ok) throw new Error(proData.error || "Failed to fetch pro argument");
      if (!conRes.ok) throw new Error(conData.error || "Failed to fetch con argument");

      setProArgument(proData.text);
      setConArgument(conData.text);
    } catch (err) {
      setMessage(`Error generating arguments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-900">AI Debate Arena</h1>
        <p className="text-center text-gray-600 mb-8">Enter a topic and let the AI debate begin!</p>

        {message && (
          <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4">
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateArguments()}
            placeholder="e.g., 'The benefits of remote work'"
            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          />
          <button
            onClick={generateArguments}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            {loading ? "Generating..." : "Generate Arguments"}
          </button>
        </div>

        {proArgument && conArgument && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="argument-card bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Argument For</h2>
              <div className="text-gray-700 flex-grow text-justify">{proArgument}</div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setProScore(proScore + 1)}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Stronger
                </button>
                <span className="text-xl font-bold text-green-700">{proScore}</span>
              </div>
            </div>

            <div className="argument-card bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Argument Against</h2>
              <div className="text-gray-700 flex-grow text-justify">{conArgument}</div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setConScore(conScore + 1)}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Stronger
                </button>
                <span className="text-xl font-bold text-red-700">{conScore}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
