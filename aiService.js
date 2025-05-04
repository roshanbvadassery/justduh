const fetch = require('node-fetch');

const INITIAL_ANALYSIS_PROMPT = `You are a startup pitch deck expert with deep knowledge of what sophisticated investors look for (using YC's high standards as benchmark). Look at this specific pitch deck slide shown in the image.

Ask 2-3 questions that would help you provide more impactful improvement suggestions. Focus on understanding:
- The intended message/goal of this slide
- The target audience's key concerns
- What supporting data/evidence exists
- What was intentionally left out and why

Questions should be specific and ideally answerable briefly. For example:
- "Do you have NPS data from customers?"
- "Is there MRR data available?"
- "Have you done cohort analysis?"

IMPORTANT: Only ask for information that is NOT already visible on the slide. Your questions should address gaps that, when filled, would directly improve the slide's effectiveness.

Format your response as a JSON array of questions. Example:
["Do you have customer churn numbers?", "Are there any A/B test results?"]`;

const PITCH_DECK_ANALYSIS_PROMPT = `You are a pitch deck expert with deep knowledge of what sophisticated investors look for. Analyze this specific slide considering the provided context and answers. Focus on:
1. Clarity and effectiveness of the slide's message (Is it compelling and easy to understand?)
2. Relevance and impact of the information presented
3. Visual presentation and data organization
4. Specific, actionable improvements to strengthen this particular slide
Be direct and practical in your feedback, focusing on what matters to investors.`;

async function getInitialQuestions(base64Image) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
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
        const contextPrompt = `${PITCH_DECK_ANALYSIS_PROMPT}\n\nContext from user:\n${answers.join('\n')}`;
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
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