import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';

export const AnalyticsDebug: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });

      const data = await response.json();
      setResult(`${method} ${endpoint}:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics Debug Panel</h3>

        <div className="flex gap-2 mb-4 flex-wrap">
          <Button onClick={() => testEndpoint('/api/analytics')} size="sm">
            Get Analytics
          </Button>
          <Button onClick={() => testEndpoint('/metrics')} size="sm">
            Get Metrics
          </Button>
          <Button
            onClick={() => testEndpoint('/api/analytics/pageview', 'POST', { page: 'test' })}
            size="sm"
          >
            Track Page View
          </Button>
          <Button onClick={() => setResult('')} variant="outline" size="sm">
            Clear
          </Button>
        </div>

        {loading && <p>Loading...</p>}

        {result && (
          <pre className="p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};
