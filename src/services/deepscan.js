// Enhanced Deep Scan Service - v2.8 (AI-Powered Detection)
// Removed the unreliable Renifler API and reverted to a robust,
// AI-driven technology detection module. This is the most stable free option.

// --- Core Dependencies ---
import OpenAI from 'openai';
import puppeteer from 'puppeteer';
import * as  cheerio from 'cheerio';
import { getDomain } from 'tldts';

class DeepScanService {
  /**
   * Initializes the service with necessary API keys.
   * @param {string} openaiApiKey - Your OpenAI API key.
   */
  constructor(openaiApiKey) {
    this.openai = new OpenAI({
      apiKey: openaiApiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Performs a comprehensive analysis of a single competitor URL.
   * @param {string} competitorUrl - The URL of the competitor's website.
   * @param {string} userBrandName - The user's brand name for context in the AI analysis.
   * @returns {Promise<object>} - An object containing the scan results.
   */
  async performDeepScan(competitorUrl, userBrandName) {
    try {
      console.log(`🔍 Starting Enhanced Deep Scan for: ${competitorUrl}`);
      const analyzedData = await this.analyzeWebsite(competitorUrl);
      const analysis = await this.generateAIAnalysis(analyzedData, userBrandName);
      
      return {
        success: true,
        competitorUrl: competitorUrl,
        analyzedData: analyzedData,
        analysis: analysis,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`[DeepScanService] Top-level error for ${competitorUrl}:`, error.message);
      return {
        success: false,
        error: error.message,
        competitorUrl: competitorUrl
      };
    }
  }

  /**
   * Analyzes a website using Puppeteer to render JavaScript, capture metrics, and extract data.
   * @param {string} url - The URL to analyze.
   * @returns {Promise<object>} - A detailed object of website data.
   */
  async analyzeWebsite(url) {
    if (!/^(https?:\/\/)/i.test(url)) {
      url = 'https://' + url;
    }
    
    console.log(`📡 Launching headless browser to analyze: ${url}`);
    let browser;
    try {
      browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
      const finalUrl = page.url();
      const htmlContent = await page.content();
      const $ = cheerio.load(htmlContent);

      // --- AI-Powered Technology Stack Detection ---
      const techClues = this.extractTechClues($);
      const technologies = await this.detectTechnologiesAI(techClues, finalUrl);
      
      const performanceMetrics = await page.evaluate(() => {
        const paintTimings = performance.getEntriesByType('paint');
        const fcp = paintTimings.find(entry => entry.name === 'first-contentful-paint')?.startTime;
        const navTiming = performance.getEntriesByType("navigation")[0];
        
        return {
          firstContentfulPaint: fcp ? `${fcp.toFixed(0)} ms` : 'N/A',
          domLoadTime: navTiming ? `${(navTiming.domContentLoadedEventEnd - navTiming.startTime).toFixed(0)} ms` : 'N/A',
          pageLoadTime: navTiming ? `${(navTiming.loadEventEnd - navTiming.startTime).toFixed(0)} ms` : 'N/A',
        };
      });

      const analyzedData = {
        url: finalUrl,
        title: $('title').text().trim() || 'No title found',
        metaDescription: $('meta[name="description"]').attr('content')?.trim() || 'No meta description found',
        h1: $('h1').first().text().trim() || 'No H1 found',
        h2Count: $('h2').length,
        h3Count: $('h3').length,
        wordCount: this.estimateWordCount($('body').text()),
        internalLinks: this.countLinks($, finalUrl, true),
        externalLinks: this.countLinks($, finalUrl, false),
        images: $('img').length,
        imagesWithAlt: $('img[alt][alt!=""]').length,
        schemaMarkup: $('script[type="application/ld+json"]').length > 0,
        canonicalUrl: $('link[rel="canonical"]').attr('href') || null,
        metaRobots: $('meta[name="robots"]').attr('content') || null,
        performance: performanceMetrics,
        technologyStack: technologies,
      };

      console.log(`✅ Analysis complete for ${finalUrl}`);
      return analyzedData;

    } catch (error) {
      console.error(`[AnalyzeWebsite] Failed for ${url}:`, error.message);
      throw new Error(`Failed to analyze ${url}: ${error.message}`);
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Extracts clues from the HTML for the AI to analyze.
   * @param {cheerio.CheerioAPI} $ - The Cheerio instance.
   * @returns {object} - An object containing arrays of script sources and link hrefs.
   */
  extractTechClues($) {
    const scripts = [];
    $('script[src]').each((_, el) => {
      scripts.push($(el).attr('src'));
    });

    const links = [];
    $('link[href]').each((_, el) => {
      links.push($(el).attr('href'));
    });
    
    const generator = $('meta[name="generator"]').attr('content');

    return { scripts, links, generator };
  }

  /**
   * Uses AI to detect technologies based on HTML clues.
   * @param {object} techClues - The clues extracted from the page.
   * @param {string} url - The URL being analyzed, for context.
   * @returns {Promise<Array<string>>} - An array of detected technology names.
   */
  async detectTechnologiesAI(techClues, url) {
    console.log(`🤖 Detecting technologies with AI for: ${url}`);
    const prompt = `
      You are a web technology expert. Based on the following list of JavaScript files, CSS files, and generator tags from the website ${url}, identify the key technologies being used.

      Clues:
      \`\`\`json
      ${JSON.stringify(techClues, null, 2)}
      \`\`\`

      Focus on identifying major frameworks (e.g., React, Vue), platforms (e.g., Shopify, WordPress, Webflow), and important analytics or marketing tools (e.g., Google Analytics, Hotjar, HubSpot).

      Return your answer ONLY as a JSON array of strings.
      Example: { "technologies": ["React", "Shopify", "Google Analytics", "Hotjar"] }
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "system", content: "You are a web technology expert that returns only JSON." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content);
      const techArray = result.technologies || result.tech || (Array.isArray(result) ? result : []);
      
      if (Array.isArray(techArray)) {
         console.log(`[AI Tech Detection] Detected: ${techArray.join(', ') || 'None'}`);
         return techArray;
      }
      
      console.warn('[AI Tech Detection] AI returned unexpected format.');
      return [];
    } catch (error) {
      console.error("[AI Tech Detection] Failed:", error.message);
      return [];
    }
  }

  /**
   * Generates a sophisticated AI analysis for a single competitor's data.
   */
  async generateAIAnalysis(analyzedData, userBrandName) {
    console.log(`🧠 Generating AI insights for ${analyzedData.url}...`);
    const domain = new URL(analyzedData.url).hostname;

    const prompt = `
      You are "Aura," an expert-level SEO and Digital Marketing Strategist. Your analysis is brutally honest, data-driven, and focused on providing a decisive competitive edge.
      **Your Client's Brand Name:** "${userBrandName}"
      **Competitor Being Analyzed:** "${domain}"
      **Raw Data:**
      \`\`\`json
      ${JSON.stringify(analyzedData, null, 2)}
      \`\`\`
      **Task:** Generate a DEEP SCAN ANALYSIS report based *only* on the raw data.
      **Report Structure:** 1. ## Executive Summary, 2. ## Technical SEO & Performance, 3. ## Content Strategy Analysis, 4. ## Competitive Vulnerabilities & Opportunities, 5. ## Actionable Battle Plan.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "system", content: "You are Aura, an expert SEO and digital marketing strategist." }, { role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.4,
      });

      console.log('✅ AI analysis completed.');
      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('[AIAnalysis] OpenAI API call failed:', error.message);
      throw new Error(`Failed to generate AI analysis: ${error.message}`);
    }
  }
  
  // --- Multi-scan and Helper Functions (no changes needed below this line) ---
  
  async performMultipleDeepScan(competitorUrls, brandName) {
    console.log(`🚀 Starting multi-competitor deep scan for: ${brandName}`);
    try {
      const uniqueCompetitors = this.deduplicateByDomain(competitorUrls);
      console.log(`🎯 Analyzing ${uniqueCompetitors.length} unique competitors...`);
      const urlsToProcess = uniqueCompetitors.slice(0, 5);

      const analysisPromises = urlsToProcess.map(url => this.analyzeWebsite(url));
      const settledResults = await Promise.allSettled(analysisPromises);
      
      const successfulAnalyses = [];
      settledResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulAnalyses.push(result.value);
        } else {
          console.error(`❌ Analysis failed for ${urlsToProcess[index]}:`, result.reason.message);
        }
      });
      
      if (successfulAnalyses.length === 0) {
        throw new Error('No competitor data could be analyzed.');
      }
      
      console.log(`✅ Successfully analyzed ${successfulAnalyses.length} competitors.`);
      console.log(`🤖 Generating strategic AI comparison...`);
      const comparativeAnalysis = await this.generateComparativeAIReport(successfulAnalyses, brandName);

      return {
        success: true,
        data: {
          brandName: brandName,
          competitorsAnalyzed: successfulAnalyses,
          comparativeAnalysis: comparativeAnalysis,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Multi-competitor deep scan failed:', error);
      return { success: false, error: error.message };
    }
  }

  async generateComparativeAIReport(competitorsData, userBrandName) {
    const prompt = `
      You are "Aura," a Chief Marketing Strategist. Briefing your client, "${userBrandName}", on the competitive landscape.
      **Competitors' Data:** \`\`\`json ${JSON.stringify(competitorsData, null, 2)} \`\`\`
      **Task:** Synthesize this data into a high-level STRATEGIC BATTLE PLAN.
      **Structure:** 1. ## Market Overview, 2. ## Competitor Tier List (Top Threat, Primary Target), 3. ## The Decisive Advantage, 4. ## Immediate Quick Wins (Next 30 Days).`;

    try {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "system", content: "You are Aura, a Chief Marketing Strategist." }, { role: "user", content: prompt }],
            max_tokens: 2000,
            temperature: 0.5,
        });
        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('[AIComparativeReport] OpenAI API call failed:', error.message);
        throw new Error('Failed to generate comparative AI report.');
    }
  }

  estimateWordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  countLinks($, baseUrl, internal = true) {
    const domain = new URL(baseUrl).hostname;
    let count = 0;
    $('a[href]').each((_, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;
      try {
        const linkUrl = new URL(href, baseUrl);
        if (internal && linkUrl.hostname.includes(domain)) count++;
        if (!internal && !linkUrl.hostname.includes(domain)) count++;
      } catch (e) { /* Ignore invalid URLs */ }
    });
    return count;
  }

  deduplicateByDomain(urls) {
    const domainMap = new Map();
    urls.forEach(url => {
      try {
        const cleanUrl = !/^(https?:\/\/)/i.test(url) ? `https://${url}` : url;
        const hostname = new URL(cleanUrl).hostname;
        const rootDomain = getDomain(hostname) || hostname;
        if (!domainMap.has(rootDomain)) domainMap.set(rootDomain, cleanUrl);
      } catch (error) {
        console.warn(`Skipping invalid URL for deduplication: ${url}`);
      }
    });
    return Array.from(domainMap.values());
  }
}

export default DeepScanService;
