const axios = require("axios");

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const analyzeRisk = async (title, riskDescription) => {
  try {
    console.log("Analyzing risk with Hugging Face AI:", title, riskDescription);

    const prompt = `
    ### Analyze the following security concern:

    **Title:** ${title}
    **Description:** ${riskDescription}

    ### Background Research:
    Provide a brief analysis of the risk and real-life examples.

    ### Likelihood:
    Estimate how likely this risk is to occur.

    ### Consequences:
    List 2-3 major consequences of this risk for:
    - Financial
    - Client
    - System
    - Infrastructure

    ### Mitigation Strategies:
    Suggest actionable steps for:
    - User Information
    - Client Relationships
    - Internal Systems
    - Infrastructure Availability

    ### Asset Impacts:
    - **User Information Impact:** 
    - **Client Impact:** 
    - **System Impact:** 
    - **Infrastructure Impact:** 
    `;

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data[0]?.generated_text || "";

    console.log("Raw AI Response:", generatedText);

    // Parsing the AI response using regex
    const parsedResponse = {
      research: generatedText.match(/### Background Research:\s*(.*?)(?=###|$)/s)?.[1]?.trim() || "No research provided.",
      likelihood: generatedText.match(/### Likelihood:\s*(.*?)(?=###|$)/s)?.[1]?.trim() || "Unknown",
      consequences: generatedText.match(/### Consequences:\s*(.*?)(?=###|$)/s)?.[1]?.trim() || "Not specified.",
      mitigationStrategies: {
        userInformation: generatedText.match(/User Information\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No strategy specified.",
        client: generatedText.match(/Client Relationships\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No strategy specified.",
        system: generatedText.match(/Internal Systems\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No strategy specified.",
        infrastructure: generatedText.match(/Infrastructure Availability\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No strategy specified.",
      },
      assetImpact: {
        userInformation: generatedText.match(/User Information Impact\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No impact specified.",
        client: generatedText.match(/Client Impact\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No impact specified.",
        system: generatedText.match(/System Impact\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No impact specified.",
        infrastructure: generatedText.match(/Infrastructure Impact\s*:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "No impact specified.",
      },
    };

    console.log("Parsed AI Response:", parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing risk with AI:", error.message || error);
    throw new Error("Failed to analyze the risk using AI.");
  }
};

module.exports = { analyzeRisk };
