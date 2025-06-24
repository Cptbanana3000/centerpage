export function categorizeCompetitors(brandName, competitors, category) {
  return competitors.map(competitor => {
    const analysis = analyzeCompetitor(brandName, competitor, category);
    const threatLevel = determineThreatLevel(analysis);
    const reasoning = generateReasoning(analysis, brandName, competitor);
    
    return {
      ...competitor,
      threatLevel,
      reasoning,
      analysis,
      autoSelected: threatLevel === 'direct',
      priority: getPriority(threatLevel)
    };
  }).sort((a, b) => b.priority - a.priority);
}

function analyzeCompetitor(brandName, competitor, category) {
  const brandLower = brandName.toLowerCase();
  const title = competitor.title.toLowerCase();
  const domain = new URL(competitor.link).hostname.toLowerCase();
  const snippet = competitor.snippet?.toLowerCase() || '';
  
  const websiteType = classifyWebsiteType(domain, title, snippet);
  const exactMatch = title.includes(brandLower) || domain.includes(brandLower);
  const sameIndustry = detectIndustryMatch(category, snippet);
  const productSimilarity = detectProductSimilarity(category, snippet, title);
  
  // Only consider as direct competition if it's actually a competing business
  const isActualCompetitor = websiteType === 'business' && (exactMatch || (sameIndustry && productSimilarity > 80));
  
  return {
    exactMatch,
    websiteType,
    nameSimilarity: calculateNameSimilarity(brandName, competitor.title),
    domainSimilarity: calculateDomainSimilarity(brandName, domain),
    sameIndustry,
    productSimilarity,
    brandStrength: estimateBrandStrength(competitor),
    directCompetition: isActualCompetitor
  };
}

function determineThreatLevel(analysis) {
  // Only actual businesses can be threats
  if (analysis.websiteType !== 'business') {
    // Informational content is useful but not a threat
    if (analysis.websiteType === 'informational' && analysis.exactMatch) return 'informational';
    if (analysis.websiteType === 'discussion' && analysis.exactMatch) return 'discussion';
    return 'unrelated';
  }
  
  // For actual businesses, determine threat level
  if (analysis.directCompetition) return 'direct';
  if (analysis.sameIndustry && analysis.productSimilarity > 60) return 'indirect';
  if (analysis.nameSimilarity > 70) return 'name-conflict';
  return 'unrelated';
}

function classifyWebsiteType(domain, title, snippet) {
  // Wikipedia and encyclopedic sites
  if (domain.includes('wikipedia') || domain.includes('wikimedia') || 
      domain.includes('britannica') || domain.includes('fandom') ||
      title.includes('wikipedia') || title.includes('wiki')) {
    return 'informational';
  }
  
  // News and media sites
  if (domain.includes('news') || domain.includes('times') || domain.includes('post') ||
      domain.includes('reuters') || domain.includes('bloomberg') || domain.includes('forbes') ||
      domain.includes('techcrunch') || domain.includes('cnn') || domain.includes('bbc') ||
      title.includes('news') || snippet.includes('reported') || snippet.includes('breaking')) {
    return 'informational';
  }
  
  // Discussion forums and social platforms
  if (domain.includes('reddit') || domain.includes('forum') || domain.includes('discussion') ||
      domain.includes('stackexchange') || domain.includes('stackoverflow') || 
      domain.includes('quora') || domain.includes('medium') || domain.includes('linkedin') ||
      domain.includes('facebook') || domain.includes('twitter') || domain.includes('instagram') ||
      title.includes('reddit') || title.includes('forum') || snippet.includes('discussion')) {
    return 'discussion';
  }
  
  // Review and listing sites
  if (domain.includes('review') || domain.includes('rating') || domain.includes('yelp') ||
      domain.includes('trustpilot') || domain.includes('glassdoor') || domain.includes('indeed') ||
      domain.includes('capterra') || domain.includes('g2') || domain.includes('productreview') ||
      title.includes('review') || snippet.includes('review') || snippet.includes('rating')) {
    return 'informational';
  }
  
  // App stores and marketplaces
  if (domain.includes('play.google') || domain.includes('apps.apple') || 
      domain.includes('amazon') || domain.includes('ebay') || domain.includes('etsy') ||
      domain.includes('marketplace') || title.includes('app store') || title.includes('play store')) {
    return 'informational';
  }
  
  // Academic and educational
  if (domain.includes('.edu') || domain.includes('university') || domain.includes('academic') ||
      domain.includes('research') || domain.includes('scholar') || 
      title.includes('university') || title.includes('research') || snippet.includes('study')) {
    return 'informational';
  }
  
  // Government sites
  if (domain.includes('.gov') || domain.includes('government') || 
      title.includes('government') || snippet.includes('official')) {
    return 'informational';
  }
  
  // Documentation and help sites
  if (domain.includes('docs.') || domain.includes('help.') || domain.includes('support.') ||
      domain.includes('documentation') || title.includes('documentation') || 
      title.includes('help') || snippet.includes('documentation')) {
    return 'informational';
  }
  
  // Default to business if none of the above patterns match
  return 'business';
}

function generateReasoning(analysis, brandName, competitor) {
  // First check website type
  if (analysis.websiteType === 'informational') {
    if (analysis.exactMatch) {
      return `Wikipedia/informational page about ${brandName} - useful for research but not a competitor`;
    }
    return `Informational content - not a direct threat`;
  }
  
  if (analysis.websiteType === 'discussion') {
    if (analysis.exactMatch) {
      return `Forum/discussion about ${brandName} - useful intel but not a competitor`;
    }
    return `Discussion platform - not a direct threat`;
  }
  
  // Only for business websites
  if (analysis.exactMatch) {
    return `Exact brand match - high customer confusion risk`;
  }
  if (analysis.directCompetition) {
    return `Same industry with similar product offering`;
  }
  if (analysis.sameIndustry) {
    return `Similar product in same industry - useful for feature analysis`;
  }
  if (analysis.nameSimilarity > 70) {
    return `Similar name in different industry - potential trademark concern`;
  }
  return `Low relevance to ${brandName} brand validation`;
}

function calculateNameSimilarity(name1, name2) {
  const words1 = name1.toLowerCase().split(/\s+/);
  const words2 = name2.toLowerCase().split(/\s+/);
  
  let maxSimilarity = 0;
  words1.forEach(word1 => {
    words2.forEach(word2 => {
      const similarity = getLevenshteinSimilarity(word1, word2);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });
  });
  
  return maxSimilarity;
}

function calculateDomainSimilarity(brandName, domain) {
  const cleanDomain = domain.replace(/^www\./, '').split('.')[0];
  return getLevenshteinSimilarity(brandName.toLowerCase(), cleanDomain);
}

function detectIndustryMatch(category, snippet) {
  const categoryKeywords = getCategoryKeywords(category);
  const snippetWords = snippet.split(/\s+/);
  
  return categoryKeywords.some(keyword => 
    snippetWords.some(word => word.includes(keyword))
  );
}

function detectProductSimilarity(category, snippet, title) {
  const productIndicators = getProductIndicators(category);
  const text = `${snippet} ${title}`.toLowerCase();
  
  const matches = productIndicators.filter(indicator => text.includes(indicator));
  return (matches.length / productIndicators.length) * 100;
}

function isDirectCompetitor(brandName, competitor, category) {
  const brandLower = brandName.toLowerCase();
  const title = competitor.title.toLowerCase();
  const domain = new URL(competitor.link).hostname.toLowerCase();
  const snippet = competitor.snippet?.toLowerCase() || '';
  
  const exactMatch = title.includes(brandLower) || domain.includes(brandLower);
  const sameIndustry = detectIndustryMatch(category, snippet);
  const productSimilarity = detectProductSimilarity(category, snippet, title);
  
  return exactMatch || (sameIndustry && productSimilarity > 80);
}

function estimateBrandStrength(competitor) {
  const domain = new URL(competitor.link).hostname;
  
  let strength = 0;
  if (domain.endsWith('.com')) strength += 30;
  if (!domain.includes('-') && !domain.includes('_')) strength += 20;
  if (domain.split('.')[0].length < 10) strength += 20;
  if (competitor.title.split(' ').length <= 2) strength += 30;
  
  return strength;
}

function getPriority(threatLevel) {
  const priorities = {
    'direct': 100,
    'indirect': 70,
    'name-conflict': 40,
    'informational': 30,
    'discussion': 20,
    'unrelated': 10
  };
  return priorities[threatLevel] || 0;
}

function getCategoryKeywords(category) {
  const keywords = {
    'tech & saas': ['software', 'saas', 'platform', 'app', 'tech', 'api'],
    'e-commerce & retail': ['store', 'shop', 'retail', 'buy', 'sell', 'commerce'],
    'health & wellness': ['health', 'wellness', 'medical', 'fitness', 'care'],
    'creative & design': ['design', 'creative', 'art', 'studio', 'agency'],
    'games & entertainment': ['game', 'gaming', 'entertainment', 'media', 'content'],
    'finance & fintech': ['finance', 'banking', 'payment', 'money', 'fintech'],
    'food & beverage': ['food', 'restaurant', 'beverage', 'recipe', 'cooking'],
    'travel & hospitality': ['travel', 'hotel', 'booking', 'tourism', 'hospitality'],
    'education & e-learning': ['education', 'learning', 'course', 'training', 'school'],
    'professional services': ['consulting', 'service', 'professional', 'business', 'agency']
  };
  
  return keywords[category.toLowerCase()] || ['business', 'service'];
}

function getProductIndicators(category) {
  const indicators = {
    'tech & saas': ['dashboard', 'analytics', 'integration', 'automation'],
    'e-commerce & retail': ['checkout', 'cart', 'inventory', 'shipping'],
    'health & wellness': ['treatment', 'therapy', 'supplement', 'exercise'],
    'creative & design': ['portfolio', 'creative', 'branding', 'visual'],
    'games & entertainment': ['multiplayer', 'streaming', 'content', 'media'],
    'finance & fintech': ['payment', 'transaction', 'investment', 'banking'],
    'food & beverage': ['menu', 'recipe', 'ingredient', 'cooking'],
    'travel & hospitality': ['booking', 'reservation', 'accommodation', 'trip'],
    'education & e-learning': ['course', 'lesson', 'curriculum', 'certification'],
    'professional services': ['consultation', 'expertise', 'solution', 'strategy']
  };
  
  return indicators[category.toLowerCase()] || ['service', 'solution'];
}

function getLevenshteinSimilarity(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  const distance = matrix[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 100 : ((maxLength - distance) / maxLength) * 100;
} 