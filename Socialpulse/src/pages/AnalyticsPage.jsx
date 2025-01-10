import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import PostTypeSelector from '@/components/PostTypeSelector';
import EngagementMetricsChart from '@/components/EngagementMetricsChart';
import InsightsSection from '@/components/InsightsSection';
import RecommendationsSection from '@/components/RecommendationsSection';

export default function AnalyticsPage() {
  const [postType, setPostType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [parsedMetrics, setParsedMetrics] = useState(null);
  const [parsedInsights, setParsedInsights] = useState('');
  const [parsedRecommendations, setParsedRecommendations] = useState('');
  const { toast } = useToast();

  const fetchData = async (selectedType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://socialpulse-backend-pyrp.onrender.com/api/run-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputValue: selectedType,
          inputType: "chat",
          outputType: "chat",
          stream: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setApiData(data);
      toast({
        title: "Data Updated",
        description: `Showing metrics for ${selectedType}`,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostTypeChange = (selectedType) => {
    setPostType(selectedType);
    fetchData(selectedType);
  };

  // Extract sections from the text with improved parsing
  useEffect(() => {
    if (apiData?.output) {
      try {
        const parsedOutput = JSON.parse(apiData.output);
        const text = parsedOutput[1]?.results?.message?.text;

        if (text) {
          // Updated regex patterns to better match the API response format
          const insightsPattern = /INSIGHTS:\n((?:- .*\n?)*)/;
          const recommendationsPattern = /RECOMMENDED ACTIONS:\n((?:- .*\n?)*)/;
          const metricsPattern = /METRICS:\n([\s\S]*?)(?:\n\n|$)/;

          const insightsMatch = text.match(insightsPattern);
          const recommendationsMatch = text.match(recommendationsPattern);
          const metricsMatch = text.match(metricsPattern);

          // console.log("Recommendations Match:", recommendationsMatch);

          setParsedInsights(insightsMatch ? insightsMatch[1].trim() : '');
          setParsedRecommendations(recommendationsMatch ? recommendationsMatch[1].trim() : '');
          setParsedMetrics(metricsMatch ? metricsMatch[1].trim() : '');
        }
      } catch (error) {
        console.error("Error parsing apiData.output: ", error.message);
      }
    }
  }, [apiData]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">SocialPulse Analytics</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Post Type</CardTitle>
        </CardHeader>
        <CardContent>
          <PostTypeSelector onSelectPostType={handlePostTypeChange} />
          {loading && <Loader2 className="h-8 w-8 animate-spin mx-auto mt-4" />}
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-8 bg-red-100">
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {parsedMetrics && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <EngagementMetricsChart data={parsedMetrics} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {parsedInsights && <InsightsSection insights={parsedInsights} />}
        {parsedRecommendations && <RecommendationsSection recommendations={parsedRecommendations} />}
      </div>
    </div>
  );
}