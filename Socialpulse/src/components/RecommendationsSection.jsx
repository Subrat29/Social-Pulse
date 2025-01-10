import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecommendationsSection = ({ recommendations }) => {
  // Parse recommendations into an array
  const parseRecommendations = (recommendationsText) => {
    return recommendationsText.split('\n').map(recommendation => 
      recommendation.startsWith('- ') ? recommendation.substring(2) : recommendation
    ).filter(recommendation => recommendation.length > 0);
  };

  const recommendationsList = parseRecommendations(recommendations);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {recommendationsList.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationsSection;