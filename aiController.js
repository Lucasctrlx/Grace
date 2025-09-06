const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: message }
            ],
            temperature: 0.7,
        });

        res.json({ response: completion.data.choices[0].message.content });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};