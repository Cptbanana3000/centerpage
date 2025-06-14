import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  increment 
} from 'firebase/firestore';

class DatabaseService {
  constructor() {
    this.analysisCollection = 'brand_analyses';
    this.analyticsCollection = 'usage_analytics';
    this.cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  }

  // Generate cache key for brand analysis
  generateCacheKey(brandName) {
    return brandName.toLowerCase().trim();
  }

  // Check if cached result exists and is still valid
  async getCachedAnalysis(brandName) {
    try {
      const cacheKey = this.generateCacheKey(brandName);
      const docRef = doc(db, this.analysisCollection, cacheKey);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const now = Date.now();
        const cacheTime = data.timestamp?.toMillis() || 0;

        // Check if cache is still valid (within 7 days)
        if (now - cacheTime < this.cacheExpiry) {
          console.log(`Cache hit for brand: ${brandName}`);
          
          // Update hit count for analytics
          await this.updateAnalytics('cache_hit', brandName);
          
          return {
            ...data.analysis,
            cached: true,
            cacheTime: data.timestamp
          };
        } else {
          console.log(`Cache expired for brand: ${brandName}`);
        }
      } else {
        console.log(`No cache found for brand: ${brandName}`);
      }

      return null;
    } catch (error) {
      console.error('Error getting cached analysis:', error);
      return null;
    }
  }

  // Store analysis result in cache
  async cacheAnalysis(brandName, analysisResult) {
    try {
      const cacheKey = this.generateCacheKey(brandName);
      const docRef = doc(db, this.analysisCollection, cacheKey);

      const cacheData = {
        brandName: brandName,
        analysis: analysisResult,
        timestamp: serverTimestamp(),
        hitCount: 1
      };

      await setDoc(docRef, cacheData);
      console.log(`Cached analysis for brand: ${brandName}`);

      // Track cache store for analytics
      await this.updateAnalytics('analysis_cached', brandName);

      return true;
    } catch (error) {
      console.error('Error caching analysis:', error);
      return false;
    }
  }

  // Update usage analytics
  async updateAnalytics(action, brandName = null, additionalData = {}) {
    try {
      const analyticsData = {
        action: action,
        brandName: brandName,
        timestamp: serverTimestamp(),
        ...additionalData
      };

      await addDoc(collection(db, this.analyticsCollection), analyticsData);
      console.log(`Analytics tracked: ${action} for ${brandName || 'system'}`);

      return true;
    } catch (error) {
      console.error('Error updating analytics:', error);
      return false;
    }
  }

  // Get popular brand searches
  async getPopularBrands(limitCount = 10) {
    try {
      const q = query(
        collection(db, this.analysisCollection),
        orderBy('hitCount', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const popularBrands = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        popularBrands.push({
          brandName: data.brandName,
          hitCount: data.hitCount,
          lastAccessed: data.timestamp
        });
      });

      return popularBrands;
    } catch (error) {
      console.error('Error getting popular brands:', error);
      return [];
    }
  }

  // Get usage statistics
  async getUsageStats() {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const q = query(
        collection(db, this.analyticsCollection),
        where('timestamp', '>=', last24Hours),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const stats = {
        totalAnalyses: 0,
        cacheHits: 0,
        newAnalyses: 0,
        uniqueBrands: new Set()
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.action === 'cache_hit') {
          stats.cacheHits++;
        } else if (data.action === 'analysis_cached') {
          stats.newAnalyses++;
        }
        
        if (data.brandName) {
          stats.uniqueBrands.add(data.brandName);
        }
      });

      stats.totalAnalyses = stats.cacheHits + stats.newAnalyses;
      stats.uniqueBrands = stats.uniqueBrands.size;

      return stats;
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {
        totalAnalyses: 0,
        cacheHits: 0,
        newAnalyses: 0,
        uniqueBrands: 0
      };
    }
  }

  // Update hit count for existing cached analysis
  async updateHitCount(brandName) {
    try {
      const cacheKey = this.generateCacheKey(brandName);
      const docRef = doc(db, this.analysisCollection, cacheKey);
      
      await setDoc(docRef, {
        hitCount: increment(1),
        lastAccessed: serverTimestamp()
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error updating hit count:', error);
      return false;
    }
  }

  // Enhanced Deep Scan analytics with detailed metrics
  async trackDeepScanAnalytics(action, brandName, additionalData = {}) {
    try {
      const deepScanData = {
        action: action,
        brandName: brandName,
        timestamp: serverTimestamp(),
        feature: 'deep_scan',
        ...additionalData
      };

      await addDoc(collection(db, this.analyticsCollection), deepScanData);
      console.log(`Deep Scan analytics tracked: ${action} for ${brandName}`);

      return true;
    } catch (error) {
      console.error('Error tracking Deep Scan analytics:', error);
      return false;
    }
  }

  // Track feature-specific usage patterns
  async trackFeatureUsage(feature, action, brandName = null, metadata = {}) {
    try {
      const featureData = {
        feature: feature, // 'domain_analysis', 'competition_check', 'social_media_scan', 'deep_scan'
        action: action,   // 'initiated', 'completed', 'failed', 'cached'
        brandName: brandName,
        timestamp: serverTimestamp(),
        metadata: metadata // Additional context like score, competitor count, etc.
      };

      await addDoc(collection(db, this.analyticsCollection), featureData);
      console.log(`Feature usage tracked: ${feature} - ${action}`);

      return true;
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      return false;
    }
  }

  // Get feature-specific analytics
  async getFeatureAnalytics(feature, timeRangeHours = 24) {
    try {
      const now = new Date();
      const timeRange = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);

      const q = query(
        collection(db, this.analyticsCollection),
        where('feature', '==', feature),
        where('timestamp', '>=', timeRange),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const analytics = {
        totalUsage: 0,
        successRate: 0,
        popularBrands: {},
        actions: {}
      };

      let successCount = 0;
      let totalCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalCount++;
        
        // Track action types
        analytics.actions[data.action] = (analytics.actions[data.action] || 0) + 1;
        
        // Calculate success rate
        if (data.action === 'completed') {
          successCount++;
        }
        
        // Track popular brands for this feature
        if (data.brandName) {
          analytics.popularBrands[data.brandName] = (analytics.popularBrands[data.brandName] || 0) + 1;
        }
      });

      analytics.totalUsage = totalCount;
      analytics.successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

      return analytics;
    } catch (error) {
      console.error('Error getting feature analytics:', error);
      return {
        totalUsage: 0,
        successRate: 0,
        popularBrands: {},
        actions: {}
      };
    }
  }

  // Get comprehensive dashboard analytics
  async getDashboardAnalytics(timeRangeHours = 24) {
    try {
      const now = new Date();
      const timeRange = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);

      const q = query(
        collection(db, this.analyticsCollection),
        where('timestamp', '>=', timeRange),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const analytics = {
        totalAnalyses: 0,
        cacheHitRate: 0,
        featureBreakdown: {
          brand_analysis: 0,
          deep_scan: 0,
          domain_check: 0,
          social_scan: 0
        },
        topBrands: {},
        scoreDistribution: {
          excellent: 0,    // 80+
          strong: 0,       // 60-79
          caution: 0,      // 40-59
          notRecommended: 0 // <40
        },
        hourlyActivity: new Array(24).fill(0)
      };

      let cacheHits = 0;
      let totalRequests = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalRequests++;

        // Cache hit rate calculation
        if (data.action === 'cache_hit') {
          cacheHits++;
        }

        // Feature breakdown
        if (data.feature) {
          analytics.featureBreakdown[data.feature] = (analytics.featureBreakdown[data.feature] || 0) + 1;
        }

        // Brand popularity
        if (data.brandName) {
          analytics.topBrands[data.brandName] = (analytics.topBrands[data.brandName] || 0) + 1;
        }

        // Score distribution (if available in metadata)
        if (data.metadata && data.metadata.overallScore) {
          const score = data.metadata.overallScore;
          if (score >= 80) analytics.scoreDistribution.excellent++;
          else if (score >= 60) analytics.scoreDistribution.strong++;
          else if (score >= 40) analytics.scoreDistribution.caution++;
          else analytics.scoreDistribution.notRecommended++;
        }

        // Hourly activity
        if (data.timestamp && data.timestamp.toDate) {
          const hour = data.timestamp.toDate().getHours();
          analytics.hourlyActivity[hour]++;
        }
      });

      analytics.totalAnalyses = totalRequests;
      analytics.cacheHitRate = totalRequests > 0 ? Math.round((cacheHits / totalRequests) * 100) : 0;

      // Sort top brands
      analytics.topBrands = Object.entries(analytics.topBrands)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .reduce((obj, [brand, count]) => ({ ...obj, [brand]: count }), {});

      return analytics;
    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      return {
        totalAnalyses: 0,
        cacheHitRate: 0,
        featureBreakdown: {},
        topBrands: {},
        scoreDistribution: {},
        hourlyActivity: new Array(24).fill(0)
      };
    }
  }
}

const databaseService = new DatabaseService();
export default databaseService;
