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
    const competitorsToSelect = getCompetitorsByThreatLevel(threatLevel);
    const newSelected = new Set(selectedCompetitors);
    competitorsToSelect.forEach(comp => newSelected.add(comp.link));
    setSelectedCompetitors(newSelected);
  };

  const clearAllByThreatLevel = (threatLevel) => {
    const competitorsToClear = getCompetitorsByThreatLevel(threatLevel);
    const newSelected = new Set(selectedCompetitors);
    competitorsToClear.forEach(comp => newSelected.delete(comp.link));
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
        description: 'High-priority competitors posing immediate brand risks.',
        color: 'border-red-200 bg-red-50'
      },
      indirect: {
        title: 'Indirect Competitors', 
        description: 'Same industry competitors useful for market analysis.',
        color: 'border-yellow-200 bg-yellow-50'
      },
      'name-conflict': {
        title: 'Name Conflicts',
        description: 'Different industries, similar names - potential trademark issues.',
        color: 'border-blue-200 bg-blue-50'
      },
      informational: {
        title: 'Informational Content',
        description: 'Wikipedia, news, reviews - not competitors, but useful for research.',
        color: 'border-green-200 bg-green-50'
      },
      discussion: {
        title: 'Forums & Discussions',
        description: 'Reddit, forums, social media - good for intel, not direct threats.',
        color: 'border-purple-200 bg-purple-50'
      },
      unrelated: {
        title: 'Unrelated Results',
        description: 'Low relevance to your brand validation.',
        color: 'border-gray-200 bg-gray-50'
      }
    };
    return info[threatLevel] || info.unrelated;
  };

  const CompetitorCard = ({ competitor }) => {
    const isSelected = selectedCompetitors.has(competitor.link);
    const domain = new URL(competitor.link).hostname;
    
    return (
      <div className={`competitor-card p-4 border rounded-lg transition-all ${
        isSelected ? 'border-blue-300 bg-blue-100/50' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleCompetitorToggle(competitor.link)}
            className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 truncate">{competitor.title}</h4>
              <span className="text-xs text-gray-500 ml-2">{domain}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{competitor.reasoning}</p>
            
            <div className="flex flex-wrap gap-2">
              {competitor.analysis.exactMatch && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  Exact Match
                </span>
              )}
              {competitor.analysis.sameIndustry && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  Same Industry
                </span>
              )}
              {competitor.analysis.nameSimilarity > 70 && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
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
            <h4 className="font-semibold text-gray-900">{info.title}</h4>
            <p className="text-sm text-gray-600">{info.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedCount}/{competitors.length} selected
            </span>
            {selectedCount < competitors.length ? (
              <button
                onClick={() => selectAllByThreatLevel(threatLevel)}
                className="text-xs text-blue-600 hover:underline"
              >
                Select All
              </button>
            ) : (
              <button
                onClick={() => clearAllByThreatLevel(threatLevel)}
                className="text-xs text-gray-500 hover:underline"
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-gray-200 rounded-xl flex flex-col">
        <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Select Competitors for Deep Scan</h3>
            <p className="text-gray-600">
              Our AI has categorized competitors by threat level. Choose which ones to include in your analysis of "{brandName}".
            </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-wrap gap-2 mb-2 p-4 bg-gray-50 rounded-lg">
                <Button
                onClick={selectRecommended}
                className="bg-blue-600 text-white hover:bg-blue-700"
                >
                Select Recommended
                </Button>
                <Button
                onClick={() => selectAllByThreatLevel('direct')}
                className="bg-red-600 text-white hover:bg-red-700"
                >
                Select All Direct Threats
                </Button>
                <Button
                onClick={() => setSelectedCompetitors(new Set())}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                Clear All
                </Button>
            </div>

            <ThreatCategory threatLevel="direct" competitors={directThreats} />
            <ThreatCategory threatLevel="indirect" competitors={indirectCompetitors} />
            
            {(nameConflicts.length > 0 || informationalContent.length > 0 || discussionContent.length > 0 || unrelatedResults.length > 0) && (
            <div className="additional-categories">
                <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-blue-600 hover:underline mb-4 text-sm font-medium"
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
        
        <div className="p-6 border-t border-gray-200 bg-gray-50/50 flex justify-end items-center gap-4">
            <Button variant="ghost" onClick={onCancel} className="text-gray-700 hover:bg-gray-200">
              Cancel
            </Button>
            <Button 
              onClick={() => onProceed(getSelectedCompetitors())}
              disabled={selectedCompetitors.size === 0}
              className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300"
            >
              Proceed with {selectedCompetitors.size} Competitors
            </Button>
        </div>
      </div>
    </div>
  );
} 