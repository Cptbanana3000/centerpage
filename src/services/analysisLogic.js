// src/services/analysisLogic.js - v2.4 (Multi-Step AI Fix)
// This version implements a robust, two-step AI chain for the final recommendation
// to prevent logical contradictions and improve reliability.

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

      Analyze each result through the lens of the "${category}" industry and decide the competition **level**:

      - "very_low"   → almost no direct competitors
      - "low"        → few weak competitors
      - "medium"     → some competitors of similar strength
      - "high"       → many strong competitors
      - "very_high"  → market saturated by strong brands

      Respond with **ONLY** a JSON object of the shape:
        { "competition_level": "very_low"|"low"|"medium"|"high"|"very_high", "reasoning": "short explanation" }

      Do NOT include any other keys or text.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "system", content: `You are a Brand Analyst AI specializing in the ${category} industry that returns only JSON.` }, { role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);
        console.log('[AI Competition Analysis]', result.reasoning);

        const levelMap = {
          very_low: 90,
          low: 70,
          medium: 50,
          high: 30,
          very_high: 10,
        };

        return levelMap[result.competition_level] ?? 50;
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

// Deterministic verdict mapping based on overall score
export function mapScoreToVerdict(score) {
  if (score >= 85) return 'Exceptional Opportunity';
  if (score >= 70) return 'Strong Contender';
  if (score >= 55) return 'Moderate Potential';
  if (score >= 40) return 'Challenging but Viable';
  return 'Not Recommended';
}

// buildDeterministicReasoning is defined in this same file below and will be used for fallback reasoning.

/**
 * ROBUST: AI-powered summary using a two-step chain to ensure logical consistency.
 * @param {object} scores - An object containing all the calculated scores.
 * @param {string} brandName - The brand name being analyzed.
 * @param {string} category - The industry/category of the brand.
 * @returns {Promise<string>} - A narrative recommendation.
 */
export async function generateAISummary(scores, brandName, category) {
    const { domainStrength, competitionIntensity, seoDifficulty, overallScore } = scores;

    const verdict = mapScoreToVerdict(overallScore);

    // Step-1: interpret metrics
    const interpretationPrompt = `Analyze the following scores for the brand \"${brandName}\" in the \"${category}\" industry and describe the situation for each metric in one sentence.\n- Domain Strength: ${domainStrength}/100\n- Competition Intensity: ${competitionIntensity}/100 (10 = VERY HIGH competition, 100 = VERY LOW)\n- SEO Difficulty: ${seoDifficulty}/100 (10 = VERY DIFFICULT, 100 = VERY EASY)\nRespond ONLY with JSON:{\n  \"domain\":\"...\",\n  \"competition\":\"...\",\n  \"seo\":\"...\"\n}`;

    let interpreted;
    try {
        const completion1 = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: 'You are a data analyst that returns only JSON.' },
            { role: 'user', content: interpretationPrompt }
          ],
          response_format: { type: 'json_object' }
        });
        interpreted = JSON.parse(completion1.choices[0].message.content);
    } catch (err) {
        console.error('Step-1 interpretation failed:', err);
    }

    // If interpretation failed, fall back to deterministic reasoning
    if (!interpreted) {
        const summaryFallback = buildDeterministicReasoning({ domainStrength, competitionIntensity, seoDifficulty }, brandName, category);
        return { verdict, summary: summaryFallback };
    }

    // Step-2: craft final summary ensuring verdict consistency
    const synthesisPrompt = `You are \"Aura\", an expert Brand Strategist.\nVerdict: ${verdict}\nFacts:\n- ${interpreted.domain}\n- ${interpreted.competition}\n- ${interpreted.seo}\nWrite a concise 2–3 sentence summary that JUSTIFIES the verdict. Do NOT alter the verdict or mention numeric scores. Return ONLY the summary sentence(s).`;

    let summary;
    try {
        const completion2 = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [{ role: 'user', content: synthesisPrompt }]
        });
        summary = completion2.choices[0].message.content.trim();
    } catch (err) {
        console.error('Step-2 synthesis failed:', err);
        summary = buildDeterministicReasoning({ domainStrength, competitionIntensity, seoDifficulty }, brandName, category);
    }

    return { verdict, summary };
}

// rename all usages in other files accordingly or export alias
export { generateAISummary as generateAIReportAndRecommendation };

export function buildDeterministicReasoning({ domainStrength, competitionIntensity, seoDifficulty }, brandName, category) {
  const describe = (score, positive = true) => {
    if (score >= 85) return positive ? 'excellent' : 'very low';
    if (score >= 70) return positive ? 'strong' : 'low';
    if (score >= 55) return positive ? 'moderate' : 'moderate';
    if (score >= 40) return positive ? 'weak' : 'high';
    return positive ? 'poor' : 'very high';
  };

  const domainText = `domain strength is ${describe(domainStrength)} (${domainStrength}/100)`;
  const compText = `competition is ${describe(competitionIntensity, false)} (${competitionIntensity}/100)`;
  const seoText = `SEO difficulty is ${describe(seoDifficulty, false)} (${seoDifficulty}/100)`;

  return `The brand name "${brandName}" in the ${category} industry shows ${domainText}, ${compText}, and ${seoText}.`;
}
