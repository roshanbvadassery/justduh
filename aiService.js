const fetch = require('node-fetch');

const PACKAGING_ANALYSIS_PROMPT = `You are a packaging design expert. Focus ONLY on the product packaging design shown in the image (ignore any UI elements or software interface). Analyze the product packaging and provide specific feedback on:
1. Visual appeal and branding (colors, graphics, logo placement)
2. Functionality and usability (structure, opening mechanism, user experience)
3. Material efficiency and sustainability
4. Suggested improvements for the package design
Be concise and practical in your recommendations. Rules: Start directly with the said points no introduction or anything else. Bullet points with heading and content but without the numbers or bullets.`;

async function analyzeImage(base64Image) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: PACKAGING_ANALYSIS_PROMPT
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/png;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing image:', error);
        return 'Error analyzing image: ' + error.message;
    }
}

module.exports = {
    analyzeImage
}; 