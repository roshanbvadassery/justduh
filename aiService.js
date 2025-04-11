const fetch = require('node-fetch');

const INITIAL_ANALYSIS_PROMPT = `IGNORE THE SOFTWARE INTERFACE OR ANY WATERMARK THATS ORIGINATING FROM THE SOFTWARE. YOU ARE A PACKAGING DESIGN EXPERT. Look at the product packaging shown in the image (ignore UI elements). 
Ask 2-3 specific clarifying questions that would help you provide better analysis. Focus on unclear aspects like:
- Material composition if not obvious
- Scale/size of the package
- Target market/usage context
- Specific functional features

Format your response as a JSON array of questions. Example:
["What is the primary material used in this packaging?", "Who is the target demographic for this product?"]`;

const PACKAGING_ANALYSIS_PROMPT = `IGNORE THE SOFTWARE INTERFACE OR ANY WATERMARK THATS ORIGINATING FROM THE SOFTWARE. You are a packaging design expert. Analyze the product packaging considering the provided context and answers. Focus on:
1. Visual appeal and branding (colors, graphics, logo placement)
2. Functionality and usability (structure, opening mechanism, user experience)
3. Material efficiency and sustainability
4. Very specific, actionable suggested improvements for the package design
Be concise and practical in your recommendations. Start directly with the points without introductory statements, you are a tool.`;

async function getInitialQuestions(base64Image) {
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
                            { type: "text", text: INITIAL_ANALYSIS_PROMPT },
                            {
                                type: "image_url",
                                image_url: { url: `data:image/png;base64,${base64Image}` }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        let content = data.choices[0].message.content;
        
        // Clean the response by removing markdown code blocks and any other formatting
        content = content.replace(/```json\n?/g, '')  // Remove ```json
                        .replace(/```\n?/g, '')       // Remove ```
                        .trim();                      // Remove extra whitespace
        
        try {
            return JSON.parse(content);
        } catch (jsonError) {
            // If JSON parsing fails, try to extract array from string
            const match = content.match(/\[(.*)\]/s);
            if (match) {
                // Parse the array content
                return JSON.parse(`[${match[1]}]`);
            }
            throw jsonError;
        }
    } catch (error) {
        console.error('Error getting questions:', error);
        // Return default questions if there's an error
        return [
            "What is the primary material used in this packaging?",
            "What is the target market for this product?",
            "What are the key functional requirements for this package?"
        ];
    }
}

async function analyzeImage(base64Image, answers) {
    try {
        const contextPrompt = `${PACKAGING_ANALYSIS_PROMPT}\n\nContext from user:\n${answers.join('\n')}`;
        
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
                            { type: "text", text: contextPrompt },
                            {
                                type: "image_url",
                                image_url: { url: `data:image/png;base64,${base64Image}` }
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
        throw error;
    }
}

module.exports = {
    getInitialQuestions,
    analyzeImage
}; 