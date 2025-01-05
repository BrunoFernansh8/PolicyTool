const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: 'your-openai-api-key',
});
const openai = new OpenAIApi(configuration);

exports.fetchGPTInsights = async (concern) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Provide a detailed analysis of the security concern: ${concern}.
      Please also provide real world examples from the web about this concern taking place in industry, with 
      a reference to the source. Please also provide the likelihood of this concern
      taking place in general, alongside the potnetial consequences.`,
      max_tokens: 500,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
    throw new Error('Error interacting with GPT API');
  }
};
