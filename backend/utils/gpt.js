const OpenAI = require('openai').default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeRisk = async (concern) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'text-davinci-003',
      prompt: `Provide a detailed analysis of the security concern: ${concern}.
      Please also provide real-world examples from the web about this concern taking place in the industry, with 
      a reference to the source. Please also provide the likelihood of this concern
      taking place in general, alongside the potential consequences.`,
      max_tokens: 500,
    });

    // Extract the generated text from the response
    const analysis = response.choices[0].text;

    // Return the analysis for further use
    return analysis;
  } catch (error) {
    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
    } else {
      console.error('Unexpected Error:', error);
    }
    throw new Error('Failed to analyze the concern using OpenAI.');
  }
};

module.exports = {analyzeRisk};
