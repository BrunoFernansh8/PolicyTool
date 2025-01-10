const { Configuration, OpenAIApi} = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const processConcern = async (concernDescription) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Provide a detailed analysis of the security concern: ${concernDescription}.
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

module.exports = { processConcern};

(async () => {
  try {
    const result = await processConcern("Data breaches in cloud storage environments.");
    console.log("Analysis Result:", result);
  } catch (err) {
    console.error(err.message);
  }
})();
