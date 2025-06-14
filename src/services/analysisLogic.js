// src/services/analysisLogic.js - v2.0
// This version replaces brittle, rule-based logic with dynamic, context-aware AI
// for significantly more accurate and human-like analysis.

import OpenAI from 'openai';


// It's best practice to initialize this once and pass it in or use a singleton pattern.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Calculates a score for domain availability and quality.
 * This function's logic is already quite solid.
 * @param {Array<object>} domainData - Array of domain availability results.
 * @param {string} brandName - The brand name being checked.
 * @returns {number} - A score from 10 to 100.
 */
export function calculateDomainStrength(domainData, brandName) {
    if (!domainData || domainData.length === 0) return 10;

    const comDomain = domainData.find(d => d.domain.toLowerCase() === `${brandName.toLowerCase()}.com`);
    if (comDomain?.available) return 100;

    const premiumTLDs = ['.io', '.ai', '.co', '.app', '.com'];
    const standardTLDs = ['.net', '.org', '.info'];

    const availablePremium = domainData.filter(d => d.available && premiumTLDs.some(tld => d.domain.endsWith(tld))).length;
    if (availablePremium >= 2) return 85;
    if (availablePremium >= 1) return 70;

    const availableStandard = domainData.filter(d => d.available && standardTLDs.some(tld => d.domain.endsWith(tld))).length;
    if (availableStandard >= 1) return 50;

    return 20;
}

/**
 * ENHANCED: Uses AI to analyze Google Search results for competition intensity.
 * @param {Array<object>} googleResults - The top search results.
 * @param {string} brandName - The user's brand name.
 * @returns {Promise<number>} - A score from 10 (high competition) to 100 (low competition).
 */
export async function calculateCompetitionIntensityAI(googleResults, brandName) {
    if (!googleResults || googleResults.length === 0) return 100;

    const topResults = googleResults.slice(0, 5).map(r => ({ title: r.title, snippet: r.snippet, link: r.link }));

    const prompt = `
      You are a Brand Analyst AI. Your task is to determine the market competition for a new brand name based on the top 5 Google search results. A high score means low competition (good), a low score means high competition (bad).

      New Brand Name: "${brandName}"

      Search Results:
      \`\`\`json
      ${JSON.stringify(topResults, null, 2)}
      \`\`\`

      Analyze each result. Is it a direct competitor (another company with a similar name/product), an informational page (Wikipedia, dictionary), or unrelated?
      Based on this, provide a "competition_score" from 10 (multiple direct competitors) to 100 (no competitors, mostly unrelated results).
      Return ONLY a JSON object like: { "reasoning": "Found 2 direct competitors and 1 informational site.", "competition_score": 25 }
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "system", content: "You are a Brand Analyst AI that returns only JSON." }, { role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);
        console.log('[AI Competition Analysis]', result.reasoning);
        return result.competition_score || 50; // Default score on failure
    } catch (error) {
        console.error("AI Competition analysis failed:", error);
        return 50; // Return a neutral score
    }
}

/**
 * ENHANCED: Uses AI to determine SEO difficulty based on the authority of top results.
 * @param {Array<object>} googleResults - The top search results.
 * @returns {Promise<number>} - A score from 10 (very difficult) to 100 (very easy).
 */
export async function calculateSeoDifficultyAI(googleResults) {
    if (!googleResults || googleResults.length === 0) return 100;

    const topResults = googleResults.slice(0, 5).map(r => ({ title: r.title, snippet: r.snippet, link: r.link }));

    const prompt = `
      You are an SEO Analyst AI. Based on the top 5 Google search results, determine the SEO difficulty to rank for this term. A high score means easy SEO, a low score means difficult SEO.
      High-authority sites (major news like Forbes, encyclopedias like Wikipedia, government sites) make it much harder to rank. Low-quality or niche blogs make it easier.

      Search Results:
      \`\`\`json
      ${JSON.stringify(topResults, null, 2)}
      \`\`\`

      Analyze the results. Are they from major, established brands or smaller, niche sites?
      Provide an "seo_difficulty_score" from 10 (extremely difficult, dominated by sites like Wikipedia) to 100 (very easy, dominated by forums/social media).
      Return ONLY a JSON object like: { "reasoning": "The top results are dominated by major news outlets like Forbes and the New York Times.", "seo_difficulty_score": 20 }
    `;
    // NOTE: The ultimate enhancement here would be to run DeepScanService on these URLs and feed THAT data to the AI.

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "system", content: "You are an SEO Analyst AI that returns only JSON." }, { role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);
        console.log('[AI SEO Analysis]', result.reasoning);
        return result.seo_difficulty_score || 50;
    } catch (error) {
        console.error("AI SEO analysis failed:", error);
        return 50;
    }
}


/**
 * ENHANCED: Replaces rigid if/else insights with a single, holistic AI-powered summary.
 * @param {object} scores - An object containing all the calculated scores.
 * @param {string} brandName - The brand name being analyzed.
 * @returns {Promise<string>} - A narrative recommendation.
 */
export async function generateAIReportAndRecommendation(scores, brandName) {
    const { domainStrength, competitionIntensity, seoDifficulty, overallScore } = scores;

    const prompt = `
      You are "Aura," an expert Brand Strategist. Your client is considering the brand name "${brandName}".
      You need to provide a final, synthesized recommendation based on these scores (where 100 is best):
      - Domain Strength: ${domainStrength}/100
      - Competition Intensity: ${competitionIntensity}/100 (high score means LOW competition)
      - SEO Difficulty: ${seoDifficulty}/100 (high score means EASY SEO)
      - Final Overall Score: ${overallScore}/100

      Synthesize these scores into a short, insightful, and actionable summary.
      1. Start with a clear, one-sentence verdict (e.g., "Exceptional Opportunity," "Strong Contender," "Challenging but Viable," or "Not Recommended").
      2. In a new paragraph, explain the "why" behind your verdict by weaving the different scores together. Do not just list the scores. Explain how they interact. For example, if domain strength is low but competition is also low, mention that the branding challenge might be worth it.
      3. Keep the entire response to 2-4 sentences. Be encouraging but realistic.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
        });
        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error("AI Recommendation generation failed:", error);
        return "Analysis complete. Please review the scores manually as the final AI recommendation could not be generated.";
    }
}
