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

const generatePolicyContent = async (risks, organization) => {
  try {
    const policyPrompt = `
    You are a **cybersecurity policy expert**. Your task is to generate a **FULLY DETAILED Cloud Security Policy** for **${organization}**.
    
    ### **Policy Document Format**
    
    **1. Policy Statement**  
    Clearly outline the organization's commitment to cloud security in 3-5 sentences.

    **2. Purpose of Policy**  
    Explain in **detailed paragraphs** why this policy is necessary and how it protects the organization.

    **3. Responsibility and Accountability**  
    List **explicit roles** responsible for enforcing this policy:
    - **IT Administrators**: Implement and manage cloud security controls.
    - **Security Teams**: Conduct security assessments and respond to incidents.
    - **Employees**: Follow security policies and report security concerns.

    **4. General Requirements for Cloud Security**  
    Provide a **detailed** explanation of security best practices:
    - **Access Control**: Role-Based Access Control (RBAC), Multi-Factor Authentication (MFA).  
    - **Data Protection**: Encrypt data at rest and in transit, regular backups.  
    - **Secure Network Configurations**: VPNs, Firewalls, Intrusion Detection Systems.  
    - **Compliance Standards**: ISO 27001, NIST, CSA CCM compliance.

    **5. Identified Cybersecurity Risks and Mitigation Strategies**  
     **This section MUST contain ALL the identified risks with complete details.** Do NOT summarize or remove any details. Each risk must have:  
      - **Background Research**
      - **Likelihood**
      - **Consequences**
      - **Mitigation Strategies**
    
    ${risks.map((risk, index) => `
    ### **Risk ${index + 1}: ${risk.title}**  
    - **Background Research:** ${risk.backgroundResearch}  
    - **Likelihood:** ${risk.likelihood}  
    - **Consequences:** ${risk.consequences}  
    - **Mitigation Strategies:** ${risk.mitigationStrategies}
    `).join("\n")}

    **6. Summary**  
    Summarize the document professionally.  
    - Reiterate that adherence to this policy is **mandatory**.
    - State that regular reviews will be conducted.  
    - Mention that non-compliance may result in **disciplinary action**.

    **Important Instructions for AI:**  
    - **DO NOT SUMMARIZE RISKS**.  
    - **Ensure ALL SECTIONS ARE INCLUDED**.  
    - **Use FORMATTED HEADINGS for each section**.  
    - **Ensure proper paragraph spacing & structure**.  
    - **Keep text professional & formal.**  
    `;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",  // Using GPT-4 Turbo for efficiency
        messages: [
          { role: "system", content: "You are an expert cybersecurity policy writer. Write a fully structured and detailed policy document." },
          { role: "user", content: policyPrompt },
        ],
        temperature: 0, // Ensures strict adherence to structure
        max_tokens: 6000, // Increased to prevent truncation
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Ensure full output
    const policyText = response.data.choices[0]?.message?.content || "No policy content generated.";

    // Structuring Output for Readability
    const sections = policyText.split(/\n(?=\#\#)/).map((section) => {
      const parts = section.split("**");
      if (parts.length < 3) return null;
      
      return {
        title: parts[1].trim(),
        content: parts.slice(2).join("").trim(),
      };
    }).filter(Boolean);

    return sections;
  } catch (error) {
    console.error("Error generating policy content:", error.message || error);
    throw new Error("Failed to generate policy content.");
  }
};



module.exports = { analyzeRisk, generatePolicyContent };