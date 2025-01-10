import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InsightsSection = ({ insights }) => {
  // Parse insights into an array
  const parseInsights = (insightsText) => {
    return insightsText.split('\n').map(insight => 
      insight.startsWith('- ') ? insight.substring(2) : insight
    ).filter(insight => insight.length > 0);
  };

  const insightsList = parseInsights(insights);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {insightsList.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InsightsSection;