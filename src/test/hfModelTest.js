import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = process.env.HF_MODEL || "valhalla/distilbart-mnli-12-1";

const candidate_labels = [
  "Interested",
  "Meeting Booked",
  "Not Interested",
  "Spam",
  "Out of Office"
];

async function testModel() {
  console.log(`🔍 Testing model: ${HF_MODEL}`);

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: "Hi, I’d love to schedule a meeting tomorrow at 10am.",
          parameters: { candidate_labels }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    console.log("✅ Model response:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("❌ Model test failed:", err.message);
  }
}

testModel();
