import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

const EngagementMetricsChart = ({ data }) => {
  // Parse the metrics from the text
  const parseMetrics = (metricsText) => {
    const metrics = {};
    const postTypes = ['Carousel', 'Reel', 'Static Image'];
    
    postTypes.forEach(type => {
      const typeRegex = new RegExp(`Post Type: ${type}\\n- Avg Likes: (\\d+)\\n- Avg Shares: (\\d+)\\n- Avg Comments: (\\d+)`);
      const match = metricsText.match(typeRegex);
      
      if (match) {
        metrics[type] = {
          likes: parseInt(match[1]),
          shares: parseInt(match[2]),
          comments: parseInt(match[3])
        };
      }
    });
    
    return metrics;
  };

  const metrics = parseMetrics(data);

  // Transform data for the bar chart
  const chartData = Object.entries(metrics).map(([type, values]) => ({
    name: type,
    ...values
  }));

  const colors = {
    likes: "#8884d8",
    comments: "#82ca9d",
    shares: "#ffc658"
  };

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(metrics).map(([postType, values]) => (
          <Card key={postType} className="p-4">
            <h3 className="font-bold text-lg mb-4">{postType}</h3>
            <CardContent className="p-0 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Likes</span>
                <span className="font-medium">{values.likes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Comments</span>
                <span className="font-medium">{values.comments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shares</span>
                <span className="font-medium">{values.shares}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart */}
      <Card className="p-4">
        <h3 className="font-bold text-lg mb-4">Engagement Comparison</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" fill={colors.likes} name="Likes" />
              <Bar dataKey="comments" fill={colors.comments} name="Comments" />
              <Bar dataKey="shares" fill={colors.shares} name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default EngagementMetricsChart;