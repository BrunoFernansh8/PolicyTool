const axios = require("axios");

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const analyzeRisk = async (title, riskDescription) => {
  try {
    console.log("Analysing risk with OpenAI:", title, riskDescription);

    const prompt = `
    // Analyze the following security concern:

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
    
    **1. POLICY STATEMENT**  
    Clearly outline the organization's commitment to cloud security in 3-5 sentences.

    **2. PURPOSE OF POLICY**  
    Explain in **detailed paragraphs** why this policy is necessary and how it protects the organization.

    **3. RESPONSIBILITY AND ACCOUNTABILITY**  
    List **explicit roles** responsible for enforcing this policy:
    - **IT Administrators**: Implement and manage cloud security controls.
    - **Security Teams**: Conduct security assessments and respond to incidents.
    - **Employees**: Follow security policies and report security concerns.

    **4. GENERAL REQUIREMENTS FOR CLOUD SECURITY**  
    Provide a **detailed** explanation of security best practices:
    - **Access Control**: Role-Based Access Control (RBAC), Multi-Factor Authentication (MFA).  
    - **Data Protection**: Encrypt data at rest and in transit, regular backups.  
    - **Secure Network Configurations**: VPNs, Firewalls, Intrusion Detection Systems.  
    - **Compliance Standards**: ISO 27001, NIST, CSA CCM compliance.

    **5. IDENTIFIED CYBERSECURITY RISKS AND MITIGATION STRATEGIES**  
    Here are the risk objects from the database (verbatim). Please incorporate them exactly:
    
    ${risks.map((risk, index) => `
    ### **Risk ${index + 1}: ${risk.title}**  
    - **Background Research:** ${risk.backgroundResearch}  
    - **Likelihood:** ${risk.likelihood}  
    - **Consequences:** ${risk.consequences}  
    - **Mitigation Strategies:** ${risk.mitigationStrategies}
    `).join("\n")}

    **6. SUMMARY**  
    Summarize the document professionally.  
    - Reiterate that adherence to this policy is **mandatory**.
    - State that regular reviews will be conducted.  
    - Mention that non-compliance may result in **disciplinary action**.

  Important Instructions when entering the risk details in the policy document:
    - **Ensure the risk data from the database is included verbatim.**
    - **Do not modify, rephrase, or summarize any of the risk details.**
    - **Include all provided fields for each risk.**
    - **Use formatted headings for each section and ensure proper paragraph spacing & structure.**
    - **Keep the text professional & formal.**

    Generate the complete policy document now.

// Here is an of the policy document creation and formatting process.

NOTE: All of the risks information is retrieved from the database, and not re-written by the AI. The AI should only generate the policy document based on the risks provided from the information in the database.

### EXAMPLE:


RESULTS AND OUTPUT AFTER API REQUEST:

     **Policy Document Format**

    SECURITY POLICY FOR GUMSA

GUMSA Cloud Security Policy 
 
a) POLICY STATEMENT:
Gumsa is committed to safeguarding our cloud-based systems and data through robust security measures. 
We recognize the importance of protecting our digital assets, maintaining client confidentiality, and ensuring operational continuity. 
This policy reflects our proactive approach to identifying and mitigating cybersecurity risks.

b) PURPOSE OF POLICY:
 The purpose of this policy is to establish guidelines and procedures for securing our cloud-based systems and data. 
 As Gumsa increasingly leverages cloud services for operational efficiency, this policy is critical in protecting against cyber threats, ensuring data integrity, and maintaining client trust.

c) RESPONSIBILITY AND ACCOUNTABILITY:
- IT Administrators: Tasked with deploying, configuring, and continuously managing cloud security measures to safeguard our systems. 
They ensure that all security controls are properly implemented and maintained, addressing any vulnerabilities proactively.

- Security Teams: Responsible for conducting regular security assessments and audits. 
They monitor systems for potential threats, investigate any security incidents, and coordinate prompt responses to mitigate risks.

- Employees: Expected to adhere strictly to our security policies. 
All staff members must stay informed about best practices, use cloud resources responsibly, and immediately report any suspicious activities or potential security concerns to the relevant security personnel.

d) GENERAL REQUIREMENTS FOR CLOUD SECURITY:
- Access Control: We will implement Role-Based Access Control (RBAC) and Multi-Factor Authentication (MFA) to ensure only authorized individuals have access to our systems and data.  
- Data Protection: All data, both at rest and in transit, will be encrypted. Regular backups will be conducted to prevent data loss.  
- Secure Network Configurations: We will use VPNs, Firewalls, and Intrusion Detection Systems to secure our network.  
- Compliance Standards: We will adhere to ISO 27001, NIST, and CSA CCM standards.

 IDENTIFIED CYBERSECURITY RISKS AND MITIGATION STRATEGIES

 Risk 1: Ransomware Attack
- Background Research: 
Ransomware attacks involve malicious software that encrypts an organization's data and demands a ransom for decryption. 
These attacks have grown increasingly sophisticated, targeting vulnerabilities in remote work environments and backup protocols. 
They pose severe operational and financial risks.
 
- Likelihood: 
The likelihood of a ransomware attack is high due to the prevalence of ransomware-as-a-service and vulnerabilities in remote access solutions.

- Consequences: 
- Financial: Severe financial losses from ransom payments, remediation, and operational downtime. 
- Asset: Loss of access to critical data and potential permanent data loss if backups are inadequate. 
- Client: Erosion of client trust due to potential exposure of sensitive information and service interruptions. 
- System: Disruption of system operations, leading to prolonged downtime and recovery challenges. 
- Infrastructure: Increased pressure on IT infrastructure and potential degradation of overall network performance.
 
- Mitigation Strategies: 
- Financial Risks: Invest in robust endpoint protection and secure cyber insurance, develop clear policies for ransom negotiation and financial contingency planning. 
- Asset Risks: Implement comprehensive backup solutions with offline storage, enforce strict access controls and encryption standards. 
- Client Risks: Develop proactive communication strategies for incident response, ensure client data is segregated and protected. 
- System Risks: Regularly update and patch systems, deploy advanced malware detection and remediation tools. 
- Infrastructure Risks: Conduct regular vulnerability assessments and infrastructure stress tests, design a resilient network architecture with built-in redundancies.

 Risk 2: Insider Threat
- Background Research: 
Insider threats can stem from both malicious intent and negligence among employees or contractors. 
Such threats are particularly dangerous as insiders have trusted access to critical systems and sensitive information, potentially causing significant financial and reputational damage.

- Likelihood: 
The likelihood of insider threats is moderate to high, given the inherent challenges in monitoring and controlling access among trusted personnel.

- Consequences: 
- Financial: Direct financial losses due to fraud, remediation costs, and potential legal liabilities. 
- Asset: Compromise of intellectual property and critical data, undermining competitive advantage. 
- Client: Loss of customer trust and potential regulatory fines due to compromised client data. 
- System: Disruption in system performance and introduction of vulnerabilities. 
- Infrastructure: Erosion of overall security posture, necessitating extensive improvements in internal controls.
 - Mitigation Strategies: - Financial Risks: Implement robust monitoring of privileged user activities, invest in insider threat detection solutions, and establish clear incident response protocols. 
- Asset Risks: Restrict access using least privilege principles, enforce strict data handling policies, and conduct regular audits. 
- Client Risks: Enhance data protection measures and provide ongoing security training for employees, while maintaining transparent client communications. 
- System Risks: Continuously monitor systems for anomalies, enforce multi-factor authentication, and promptly patch vulnerabilities. 
- Infrastructure Risks: Regularly review and update security policies, conduct periodic risk assessments, and invest in advanced SIEM systems.

 Risk 3: Zero-Day Exploit
- Background Research: 
Zero-day exploits target vulnerabilities that are unknown to vendors and the public, leaving systems exposed until a patch is available. 
These exploits can lead to severe breaches as attackers capitalize on the window of opportunity before remediation.
 
- Likelihood: 
The likelihood of a zero-day exploit is moderate due to increasing software complexity and the persistence of legacy systems, despite investments in threat intelligence.
 
- Consequences: 
- Financial: Unexpected costs for emergency patches, remediation, and potential ransom demands. 
- Asset: Unauthorized access to sensitive data and potential irreversible data breaches. 
- Client: Breach of client data security leading to loss of trust and contractual penalties. 
- System: Critical system failures and operational disruptions. 
- Infrastructure: Increased risk of widespread network compromise requiring extensive recovery efforts.

- Mitigation Strategies: 
- Financial Risks: Allocate contingency funds for emergency measures, invest in threat intelligence and zero-day detection tools, secure comprehensive cyber insurance. 
- Asset Risks: Implement rigorous vulnerability management and regular security assessments, enforce strong access controls, and prioritize patch management. 
- Client Risks: Strengthen data encryption protocols and secure client data repositories, and develop rapid breach notification plans. 
- System Risks: Continuously monitor for anomalous behavior, deploy real-time intrusion detection systems, and conduct frequent penetration testing. 
- Infrastructure Risks: Design resilient network architectures with segmentation, regularly update security policies, and engage external security experts.

 Risk 4: Social Engineering Attack
- Background Research: 
Social engineering attacks exploit human psychology to manipulate individuals into divulging confidential information. 
Techniques such as pretexting, baiting, and impersonation bypass technical defenses by targeting the human element directly.

- Likelihood: 
The likelihood of social engineering attacks is high due to the ease with which attackers can craft convincing scenarios and the reliance on digital communication channels.

- Consequences: 
- Financial: Costs related to fraud, investigations, and potential legal actions arising from data breaches. 
- Asset: Compromise of sensitive internal data and intellectual property, causing competitive harm. 
- Client: Damage to client relationships due to loss of trust and potential exposure of personal information. 
- System: Unauthorized system access resulting from compromised credentials. 
- Infrastructure: Disruption of security protocols and increased vulnerability to follow-on attacks.

- Mitigation Strategies: 
- Financial Risks: Invest in regular security awareness training and simulated social engineering exercises, and secure cyber insurance covering such incidents. 
- Asset Risks: Implement strict access controls and enforce multi-factor authentication, and ensure sensitive information is encrypted. 
- Client Risks: Establish robust data handling and privacy policies, and maintain proactive communication with clients regarding security practices. 
- System Risks: Continuously monitor user behavior for anomalies, enforce strong password policies, and deploy endpoint security measures. 
- Infrastructure Risks: Regularly update security protocols, conduct comprehensive risk assessments, and engage external consultants for evaluations.

 Risk 5: Data Leakage
- Background Research: 
Data leakage refers to the unintentional exposure of sensitive information through unsecured channels. 
It can occur through misconfigured cloud storage, unprotected endpoints, or accidental disclosures, leading to significant data breaches and regulatory violations.

- Likelihood: 
The likelihood of data leakage is moderate due to the complexity of modern IT environments and the challenges of consistently enforcing data protection measures.

- Consequences: 
- Financial: Significant remediation costs, regulatory fines, and potential revenue loss from disrupted operations. 
- Asset: Loss or corruption of proprietary data and intellectual property, impacting competitive advantage. 
- Client: Breach of client confidentiality resulting in loss of trust and potential legal liabilities. 
- System: Disruption of IT operations and increased recovery efforts. 
- Infrastructure: Long-term reputational damage and increased costs for upgrading security systems.

- Mitigation Strategies: 
- Financial Risks: Secure comprehensive cyber insurance and allocate funds for incident response, conduct regular financial impact assessments. 
- Asset Risks: Implement strict data classification and access controls, encrypt sensitive data both at rest and in transit, and conduct regular audits of data access logs. 
- Client Risks: Establish stringent data handling and privacy policies, maintain regular communication with clients regarding data security, and perform periodic compliance checks. 
- System Risks: Deploy advanced monitoring and intrusion detection systems, conduct regular vulnerability assessments and penetration testing, and maintain a robust incident response plan. 
- Infrastructure Risks: Invest in modernizing IT infrastructure with enhanced security features, conduct periodic employee security training, and engage third-party experts for audits.

SUMMARY:

Adherence to this policy is mandatory for all employees and contractors of Gumsa. 
Regular reviews and updates will be conducted to ensure the policy remains effective and relevant. 
Non-compliance may result in disciplinary action, up to and including termination of employment. 
We are committed to maintaining a secure and reliable cloud environment for our operations and for the benefit of our clients.


// END OF OUTPUT

END OF EXAMPLE

NOTE: All of the risks information about the 'Identified Cybersecurity Risks and Mitigation Strategies' is retrieved from the database, and not re-written by the AI. The AI should only generate section 5 in the policy document by displaying ALL the information about ALL the risks provided by the user and database.


    `;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",  
        messages: [
          { role: "system", content: "You are an expert cybersecurity policy writer. Write a fully structured and detailed policy document." },
          { role: "user", content: policyPrompt },
        ],
        temperature: 0, 
        max_tokens: 4000, 
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const policyText = response.data.choices[0]?.message?.content || "No policy content generated.";

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