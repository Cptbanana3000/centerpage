// Request tracker to prevent duplicate API calls and double charging
class RequestTracker {
  constructor() {
    this.requestMap = new Map();
    this.activeAnalysisMap = new Map(); // Track active analyses to prevent concurrent processing
  }

  isRecentDuplicateRequest(userId, brandName, category, windowMs = 5000) {
    const requestKey = `${userId}_${brandName}_${category}`;
    const now = Date.now();
    
    if (this.requestMap.has(requestKey)) {
      const lastRequestTime = this.requestMap.get(requestKey);
      if (now - lastRequestTime < windowMs) {
        console.log(`Duplicate request detected for ${requestKey} within ${windowMs}ms`);
        return true;
      }
    }
    
    this.requestMap.set(requestKey, now);
    
    // Clean up old entries periodically
    if (this.requestMap.size > 1000) {
      for (const [key, timestamp] of this.requestMap.entries()) {
        if (now - timestamp > windowMs * 2) {
          this.requestMap.delete(key);
        }
      }
    }
    
    return false;
  }

  clearRequest(userId, brandName, category) {
    const requestKey = `${userId}_${brandName}_${category}`;
    this.requestMap.delete(requestKey);
  }

  // Check if an analysis is currently in progress for this brand/category
  isAnalysisInProgress(brandName, category) {
    const analysisKey = `${brandName}_${category}`;
    return this.activeAnalysisMap.has(analysisKey);
  }

  // Start tracking an analysis
  startAnalysis(brandName, category) {
    const analysisKey = `${brandName}_${category}`;
    this.activeAnalysisMap.set(analysisKey, Date.now());
  }

  // End tracking an analysis
  endAnalysis(brandName, category) {
    const analysisKey = `${brandName}_${category}`;
    this.activeAnalysisMap.delete(analysisKey);
  }
}

const requestTracker = new RequestTracker();
export default requestTracker; 