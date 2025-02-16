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

// Create policy content using OpenAI
const generatePolicyContent = async (risks, organization) => {
  const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const prompt = `
    Generate a comprehensive cybersecurity policy for the organization: ${organization}.

    Use the following risks and their respective details to guide the policy:

    ${risks.map((risk, index) => `
      ${index + 1}. Risk Title: ${risk.title}
      Background Research: ${risk.backgroundResearch || "No research available."} \n
      Likelihood: ${risk.likelihood || "Unknown"} \n
      Consequences: ${risk.consequences || "Not specified."} \n
      Mitigation Strategies: ${risk.mitigationStrategies || "No strategies provided."} \n
    `).join("\n")}

    The policy must include the following sections:
    1. **Introduction**: A general statement of purpose regarding cybersecurity and the importance of risk mitigation.
    2. **Risk Details and Analysis**: Summarize each risk, including its likelihood, consequences, and related background research.
    3. **Mitigation Strategies**: For each risk, outline actionable and specific mitigation steps. Include guidance on user information security, client relationships, system reliability, and infrastructure protection.
    4. **Policy Guidelines**: Establish organizational practices and principles for addressing cybersecurity risks.

    Ensure the policy is written in a formal and professional tone, and structured for easy readability with headings and bullet points.
  `;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a cybersecurity policy expert." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0]?.message?.content || "No policy content generated.";
  } catch (error) {
    console.error("Error generating policy content:", error.message || error);
    throw new Error("Failed to generate policy content.");
  }
};



module.exports = { analyzeRisk, generatePolicyContent };