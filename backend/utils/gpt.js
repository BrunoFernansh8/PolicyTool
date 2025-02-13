const axios = require("axios");

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const analyzeRisk = async (title, riskDescription) => {
  try {
    console.log("Analyzing risk with OpenAI:", title, riskDescription);

    const prompt = `
     ### Analyze the following security concern:

    **Title:** ${title}
    **Description:** ${riskDescription}

    ### Background Research:
    Provide an extensive analysis of the risk and real-life examples.

    ### Likelihood:
    Estimate how likely this risk is to occur.

    ### Consequences:
    List 2-3 major consequences of this risk for:
    - Financial
    - Asset
    - Client
    - System
    - Infrastructure

    ### Mitigation Strategies:
    Suggest actionable steps to mitigate risks for the consequences of:
    - Financial risks
    - Asset Risks
    - Client Risks
    - System Risks
    - Infrastructure Risks
    `;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a cybersecurity expert." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data.choices[0]?.message?.content || "";
    console.log("Generated Text:", generatedText);

    const parsedResponse = {
      backgroundResearch: extractSection("Background Research", generatedText),
      likelihood: extractSection("Likelihood", generatedText),
      consequences: extractSection("Consequences", generatedText),
      mitigationStrategies: extractMitigationStrategies(generatedText),
    };


    console.log("Parsed AI Response:", parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing risk with OpenAI:", error.message || error);
    throw new Error("Failed to analyze the risk using OpenAI.");
  }
};

/**
 * Utility function to extract a section from the AI response.
 */
const extractSection = (section, text) => {
  const regex = new RegExp(`###\\s*${section}:\\s*(.*?)\\n(###|$)`, "s");
  const match = text.match(regex);
  return match?.[1]?.trim() || "Not provided.";
};
const extractMitigationStrategies = (text) => {
  const regex = /###\s*Mitigation Strategies:\s*(.*?)(?=###|$)/s;
  const match = text.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  } else {
    return "Not provided.";
  }
};



module.exports = { analyzeRisk };