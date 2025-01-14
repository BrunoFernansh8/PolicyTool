const OpenAI = require('openai').default;

const openai = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY,
})
exports.fetchGPTInsights = async (concern) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'text-davinci-003',
      prompt: `Provide a detailed analysis of the security concern: ${concern}.
      Please also provide real world examples from the web about this concern taking place in industry, with 
      a reference to the source. Please also provide the likelihood of this concern
      taking place in general, alongside the potnetial consequences.`,
      max_tokens: 500,
    });
    console.log(response.choices[0].text);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);
      console.error(error.message);
      console.error(error.code);
      console.error(error.type);
    } else {
      console.log(error);
    }
  }
};
