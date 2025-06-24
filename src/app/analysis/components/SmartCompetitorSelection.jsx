'use client';

import { useState, useEffect } from 'react';
import { categorizeCompetitors } from '@/utils/competitorCategorizer';
import { Button } from '@/components/ui/button';

export default function SmartCompetitorSelection({ 
  competitors, 
  brandName, 
  category,
  onProceed, 
  onCancel 
}) {
  const [categorizedCompetitors, setCategorizedCompetitors] = useState([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState(new Set());
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const categorized = categorizeCompetitors(brandName, competitors, category);
    setCategorizedCompetitors(categorized);
    
    // Auto-select direct threats
    const autoSelected = new Set(
      categorized
        .filter(comp => comp.autoSelected)
        .map(comp => comp.link)
    );
    setSelectedCompetitors(autoSelected);
  }, [competitors, brandName, category]);

  const handleCompetitorToggle = (competitorLink) => {
    const newSelected = new Set(selectedCompetitors);
    if (newSelected.has(competitorLink)) {
      newSelected.delete(competitorLink);
    } else {
      newSelected.add(competitorLink);
    }
    setSelectedCompetitors(newSelected);
  };

  const getCompetitorsByThreatLevel = (threatLevel) => {
    return categorizedCompetitors.filter(comp => comp.threatLevel === threatLevel);
  };

  const selectAllByThreatLevel = (threatLevel) => {
    const competitors = getCompetitorsByThreatLevel(threatLevel);
    const newSelected = new Set(selectedCompetitors);
    competitors.forEach(comp => newSelected.add(comp.link));
    setSelectedCompetitors(newSelected);
  };

  const clearAllByThreatLevel = (threatLevel) => {
    const competitors = getCompetitorsByThreatLevel(threatLevel);
    const newSelected = new Set(selectedCompetitors);
    competitors.forEach(comp => newSelected.delete(comp.link));
    setSelectedCompetitors(newSelected);
  };

  const selectRecommended = () => {
    const recommended = categorizedCompetitors.filter(comp => 
      comp.threatLevel === 'direct' || 
      (comp.threatLevel === 'indirect' && comp.analysis.productSimilarity > 70)
    );
    setSelectedCompetitors(new Set(recommended.map(comp => comp.link)));
  };

  const getSelectedCompetitors = () => {
    return categorizedCompetitors.filter(comp => selectedCompetitors.has(comp.link));
  };

  const getThreatLevelInfo = (threatLevel) => {
    const info = {
      direct: {
        title: 'Direct Business Threats',
        description: 'High-priority competitors that pose immediate brand risks',
        color: 'border-red-500/30 bg-red-500/10'
      },
      indirect: {
        title: 'Indirect Competitors', 
        description: 'Same industry competitors useful for market analysis',
        color: 'border-yellow-500/30 bg-yellow-500/10'
      },
      'name-conflict': {
        title: 'Name Conflicts',
        description: 'Different industries but similar names - trademark considerations',
        color: 'border-blue-500/30 bg-blue-500/10'
      },
      informational: {
        title: 'Informational Content',
        description: 'Wikipedia, news, reviews - useful for research but not competitors',
        color: 'border-green-500/30 bg-green-500/10'
      },
      discussion: {
        title: 'Forums & Discussions',
        description: 'Reddit, forums, social media - useful intel but not threats',
        color: 'border-purple-500/30 bg-purple-500/10'
      },
      unrelated: {
        title: 'Unrelated Results',
        description: 'Low relevance to your brand validation',
        color: 'border-gray-500/30 bg-gray-500/10'
      }
    };
    return info[threatLevel] || info.unrelated;
  };

  const CompetitorCard = ({ competitor }) => {
    const isSelected = selectedCompetitors.has(competitor.link);
    const domain = new URL(competitor.link).hostname;
    
    return (
      <div className={`competitor-card p-4 border rounded-lg transition-all ${
        isSelected ? 'border-[#64ffda]/50 bg-[#64ffda]/10' : 'border-white/10 bg-white/5'
      }`}>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleCompetitorToggle(competitor.link)}
            className="mt-1 w-4 h-4 text-[#64ffda] bg-gray-900 border-gray-600 rounded focus:ring-[#64ffda] focus:ring-2"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white truncate">{competitor.title}</h4>
              <span className="text-xs text-gray-400 ml-2">{domain}</span>
            </div>
            
            <p className="text-sm text-gray-300 mb-2">{competitor.reasoning}</p>
            
            <div className="flex flex-wrap gap-2">
              {competitor.analysis.exactMatch && (
                <span className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded">
                  Exact Match
                </span>
              )}
              {competitor.analysis.sameIndustry && (
                <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                  Same Industry
                </span>
              )}
              {competitor.analysis.nameSimilarity > 70 && (
                <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded">
                  Similar Name
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ThreatCategory = ({ threatLevel, competitors }) => {
    if (competitors.length === 0) return null;
    
    const info = getThreatLevelInfo(threatLevel);
    const selectedCount = competitors.filter(comp => selectedCompetitors.has(comp.link)).length;
    
    return (
      <div className={`threat-category border rounded-lg p-4 ${info.color}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-white">{info.title}</h4>
            <p className="text-sm text-gray-300">{info.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {selectedCount}/{competitors.length} selected
            </span>
            {selectedCount < competitors.length ? (
              <button
                onClick={() => selectAllByThreatLevel(threatLevel)}
                className="text-xs text-[#64ffda] hover:underline"
              >
                Select All
              </button>
            ) : (
              <button
                onClick={() => clearAllByThreatLevel(threatLevel)}
                className="text-xs text-gray-400 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {competitors.map((competitor, index) => (
            <CompetitorCard key={competitor.link || index} competitor={competitor} />
          ))}
        </div>
      </div>
    );
  };

  const directThreats = getCompetitorsByThreatLevel('direct');
  const indirectCompetitors = getCompetitorsByThreatLevel('indirect');
  const nameConflicts = getCompetitorsByThreatLevel('name-conflict');
  const informationalContent = getCompetitorsByThreatLevel('informational');
  const discussionContent = getCompetitorsByThreatLevel('discussion');
  const unrelatedResults = getCompetitorsByThreatLevel('unrelated');

  return (
    <div className="smart-competitor-selection bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Select Competitors to Analyze</h3>
        <p className="text-gray-300">
          Choose which competitors to include in your deep scan analysis for "{brandName}".
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white/5 rounded-lg">
        <Button
          onClick={selectRecommended}
          className="bg-[#64ffda]/20 border border-[#64ffda]/50 text-[#64ffda] hover:bg-[#64ffda]/30"
        >
          Select Recommended
        </Button>
        <Button
          onClick={() => selectAllByThreatLevel('direct')}
          className="bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30"
        >
          Select All Direct Threats
        </Button>
        <Button
          onClick={() => setSelectedCompetitors(new Set())}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <ThreatCategory threatLevel="direct" competitors={directThreats} />
        <ThreatCategory threatLevel="indirect" competitors={indirectCompetitors} />
        
        {(nameConflicts.length > 0 || informationalContent.length > 0 || discussionContent.length > 0 || unrelatedResults.length > 0) && (
          <div className="additional-categories">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-[#64ffda] hover:underline mb-4"
            >
              {showAllCategories ? 'Hide' : 'Show'} Additional Categories ({nameConflicts.length + informationalContent.length + discussionContent.length + unrelatedResults.length})
            </button>
            
            {showAllCategories && (
              <div className="space-y-4">
                <ThreatCategory threatLevel="name-conflict" competitors={nameConflicts} />
                <ThreatCategory threatLevel="informational" competitors={informationalContent} />
                <ThreatCategory threatLevel="discussion" competitors={discussionContent} />
                <ThreatCategory threatLevel="unrelated" competitors={unrelatedResults} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-white">
            Selected: {selectedCompetitors.size} competitors
          </span>
          <span className="text-[#64ffda]">
            Cost: {selectedCompetitors.size} deep scan credit{selectedCompetitors.size !== 1 ? 's' : ''}
          </span>
        </div>
        
        {selectedCompetitors.size > 0 && (
          <div className="text-sm text-gray-300">
            Analyzing: {getSelectedCompetitors().map(comp => new URL(comp.link).hostname).join(', ')}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => onProceed(getSelectedCompetitors())}
          disabled={selectedCompetitors.size === 0}
          className="flex-1 bg-[#64ffda]/20 border border-[#64ffda]/50 text-[#64ffda] hover:bg-[#64ffda]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Selected Competitors ({selectedCompetitors.size})
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
} 