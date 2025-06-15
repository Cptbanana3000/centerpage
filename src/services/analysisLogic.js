// src/services/analysisLogic.js - v2.3 (Final Categories)
// This version implements a comprehensive list of 10 industry categories
// for highly specific domain recommendations and AI analysis.

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * ENHANCED: Calculates domain strength based on 10 specific industry categories.
 * @param {Array<object>} domainData - Array of domain availability results.
 * @param {string} brandName - The brand name being checked.
 * @param {string} category - The industry/category of the brand.
 * @returns {number} - A score from 10 to 100.
 */
export function calculateDomainStrength(domainData, brandName, category) {
    if (!domainData || domainData.length === 0) return 10;

    const comDomain = domainData.find(d => d.domain.toLowerCase() === `${brandName.toLowerCase()}.com`);
    if (comDomain?.available) return 100;

    let premiumTLDs = ['.co', '.app'];
    let standardTLDs = ['.net', '.org', '.info'];

    // Adjust TLD recommendations based on the 10 selected categories
    switch (category.toLowerCase()) {
        case 'tech & saas':
            premiumTLDs = ['.io', '.ai', '.tech', '.app', '.co'];
            standardTLDs = ['.so', '.dev', '.net'];
            break;
        case 'e-commerce & retail':
            premiumTLDs = ['.shop', '.store', '.co'];
            standardTLDs = ['.net', '.biz', '.market'];
            break;
        case 'health & wellness':
            premiumTLDs = ['.health', '.care', '.co', '.io'];
            standardTLDs = ['.fit', '.life', '.net'];
            break;
        case 'creative & design':
             premiumTLDs = ['.design', '.art', '.studio', '.io'];
             standardTLDs = ['.co', '.me', '.net'];
             break;
        case 'games & entertainment':
            premiumTLDs = ['.games', '.gg', '.tv', '.live', '.io'];
            standardTLDs = ['.net', '.co', '.stream'];
            break;
        case 'finance & fintech':
            premiumTLDs = ['.finance', '.money', '.io', '.co'];
            standardTLDs = ['.financial', '.cash', '.net'];
            break;
        case 'food & beverage':
            premiumTLDs = ['.food', '.bar', '.rest', '.cafe', '.co'];
            standardTLDs = ['.recipes', '.kitchen', '.net'];
            break;
        case 'travel & hospitality':
            premiumTLDs = ['.travel', '.tours', '.holiday', '.hotel'];
            standardTLDs = ['.co', '.net', '.guide'];
            break;
        case 'education & e-learning':
            premiumTLDs = ['.education', '.school', '.academy', '.io'];
            standardTLDs = ['.courses', '.study', '.net'];
            break;
        case 'professional services':
            premiumTLDs = ['.pro', '.expert', '.consulting', '.legal'];
            standardTLDs = ['.co', '.net', '.biz'];
            break;
        default:
            // General-purpose fallback
            premiumTLDs = ['.io', '.co', '.app'];
            break;
    }

    const availablePremium = domainData.filter(d => d.available && premiumTLDs.some(tld => d.domain.endsWith(tld))).length;
    if (availablePremium >= 2) return 85;
    if (availablePremium >= 1) return 70;

    const availableStandard = domainData.filter(d => d.available && standardTLDs.some(tld => d.domain.endsWith(tld))).length;
    if (availableStandard >= 1) return 50;

    return 20;
}

/**
 * ENHANCED: Uses AI to analyze competition *within a specific category*.
 * @param {Array<object>} googleResults - The top search results.
 * @param {string} brandName - The user's brand name.
 * @param {string} category - The industry/category of the brand.
 * @returns {Promise<number>} - A score from 10 (high competition) to 100 (low competition).
 */
export async function calculateCompetitionIntensityAI(googleResults, brandName, category) {
    if (!googleResults || googleResults.length === 0) return 100;

    const topResults = googleResults.slice(0, 5).map(r => ({ title: r.title, snippet: r.snippet, link: r.link }));

    const prompt = `
      You are a Brand Analyst AI specializing in the "${category}" industry. Your task is to determine the market competition for a new brand name based on the top 5 Google search results. A high score means low competition (good), a low score means high competition (bad).

      New Brand Name: "${brandName}"
      Brand Category: "${category}"

      Search Results:
      \`\`\`json
      ${JSON.stringify(topResults, null, 2)}
      \`\`\`

      Analyze each result through the lens of the "${category}" industry. Is the result a direct competitor, an informational page, or unrelated?
      Based on this, provide a "competition_score" from 10 (multiple direct competitors in the same category) to 100 (no competitors).
      Return ONLY a JSON object like: { "reasoning": "Found one direct competitor in the ${category} space.", "competition_score": 40 }
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "system", content: `You are a Brand Analyst AI specializing in the ${category} industry that returns only JSON.` }, { role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);
        console.log('[AI Competition Analysis]', result.reasoning);
        return result.competition_score || 50;
    } catch (error) {
        console.error("AI Competition analysis failed:", error);
        return 50;
    }
}

/**
 * ENHANCED: Uses AI to determine SEO difficulty *within a specific category*.
 * @param {Array<object>} googleResults - The top search results.
 * @param {string} category - The industry/category of the brand.
 * @returns {Promise<number>} - A score from 10 (very difficult) to 100 (very easy).
 */
export async function calculateSeoDifficultyAI(googleResults, category) {
    if (!googleResults || googleResults.length === 0) return 100;

    const topResults = googleResults.slice(0, 5).map(r => ({ title: r.title, snippet: r.snippet, link: r.link }));

    const prompt = `
      You are an SEO Analyst AI. Based on the top 5 Google search results, determine the SEO difficulty to rank for this term within the "${category}" industry. A high score means easy SEO, a low score means difficult SEO.
      Are the top results dominated by major, high-authority players in the "${category}" space, or are they smaller, niche sites?

      Search Results:
      \`\`\`json
      ${JSON.stringify(topResults, null, 2)}
      \`\`\`

      Provide an "seo_difficulty_score" from 10 (extremely difficult) to 100 (very easy).
      Return ONLY a JSON object like: { "reasoning": "The top results are all major players in the ${category} industry.", "seo_difficulty_score": 15 }
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "system", content: `You are an SEO Analyst AI specializing in the ${category} industry that returns only JSON.` }, { role: "user", content: prompt }],
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
 * ENHANCED: AI-powered summary that now includes category context and weighting.
 * @param {object} scores - An object containing all the calculated scores.
 * @param {string} brandName - The brand name being analyzed.
 * @param {string} category - The industry/category of the brand.
 * @returns {Promise<string>} - A narrative recommendation.
 */
export async function generateAIReportAndRecommendation(scores, brandName, category) {
    const { domainStrength, competitionIntensity, seoDifficulty, overallScore } = scores;

    const prompt = `
      You are "Aura," an expert Brand Strategist. Your client is considering the brand name "${brandName}" for their new project in the **"${category}"** industry.
      You need to provide a final, synthesized recommendation based on these scores (where 100 is best):
      - Domain Strength: ${domainStrength}/100
      - Competition Intensity: ${competitionIntensity}/100 (high score means LOW competition in the ${category} space)
      - SEO Difficulty: ${seoDifficulty}/100 (high score means EASY SEO in the ${category} space)
      - Final Overall Score: ${overallScore}/100

      Synthesize these scores into a short, insightful, and actionable summary.
      1. Start with a clear, one-sentence verdict (e.g., "Exceptional Opportunity," "Strong Contender," "Challenging but Viable," or "Not Recommended").
      2. In a new paragraph, explain the "why" behind your verdict, applying industry-specific weighting. For the "${category}" industry, certain factors are more critical. For example:
        - For "Tech & SaaS", brand name clarity is paramount (Competition Intensity is key).
        - For "E-commerce & Retail", the ".com" domain availability is critical (Domain Strength is key).
        - For "Games & Entertainment", existing community presence can make SEO very hard (SEO Difficulty is key).
      3. Weave the scores together to justify your reasoning. Keep the entire response to 2-4 sentences.
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
