const axios = require('axios');

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const analyzeRisk = async (concern) => {
  try {
    console.log('Analyzing risk using Hugging Face AI:', concern);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { 
        inputs: `Analyze the following security concern and provide a structured response with clear headings:
        **Concern:** ${concern}
        
        **Likelihood:** (Describe the likelihood of this risk occurring)
        
        **Consequences:** (List 2-3 major consequences of this risk)
        
        **Mitigation Strategies:** (Suggest 2-3 actionable steps to mitigate this risk)
        
        Please structure the response with bullet points.`
        
      },
      {
        headers: { 
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text;
    } else {
      return 'AI analysis failed: No valid response from Hugging Face.';
    }
  } catch (error) {
    console.error('Error analyzing risk with Hugging Face:', error.response ? error.response.data : error.message);
    return 'Analysis service is temporarily unavailable. Please try again later.';
  }
};

module.exports = { analyzeRisk };
