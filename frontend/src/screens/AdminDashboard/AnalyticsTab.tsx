import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  TrendingUp,
  Users,
  Eye,
  Activity,
  Clock,
  Shield,
  Server,
  RefreshCw,
  BarChart3,
  FileText,
  Folder,
} from "lucide-react";
import { analyticsService, AnalyticsSummary } from "../../lib/analyticsApi";

export const AnalyticsTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const data = await analyticsService.getAnalyticsSummary();
      setAnalytics(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAnalytics();
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-[#6e6d6b]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="rounded-xl border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#3b3a39]">Analytics Dashboard</h2>
          {lastUpdated && (
            <p className="text-sm text-[#6e6d6b] mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6d6b]">Total Page Views</p>
                <p className="text-2xl font-bold text-[#3b3a39]">
                  {analytics.totalPageViews.toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-[#6e6d6b]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6d6b]">Blog Views</p>
                <p className="text-2xl font-bold text-[#3b3a39]">
                  {analytics.totalBlogViews.toLocaleString()}
                </p>
              </div>
              <FileText className="w-8 h-8 text-[#6e6d6b]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6d6b]">Project Views</p>
                <p className="text-2xl font-bold text-[#3b3a39]">
                  {analytics.totalProjectViews.toLocaleString()}
                </p>
              </div>
              <Folder className="w-8 h-8 text-[#6e6d6b]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6d6b]">Total Requests</p>
                <p className="text-2xl font-bold text-[#3b3a39]">
                  {analytics.totalRequests.toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-[#6e6d6b]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#3b3a39]">Performance</h3>
              <Clock className="w-6 h-6 text-[#6e6d6b]" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[#6e6d6b]">Avg Response Time</p>
                <p className="text-xl font-bold text-[#3b3a39]">
                  {analytics.averageResponseTime}ms
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6e6d6b]">System Uptime</p>
                <p className="text-xl font-bold text-[#3b3a39]">
                  {analytics.uptime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#3b3a39]">Security</h3>
              <Shield className="w-6 h-6 text-[#6e6d6b]" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[#6e6d6b]">Login Success Rate</p>
                <p className="text-xl font-bold text-green-600">
                  {analytics.loginSuccessRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#3b3a39]">System Health</h3>
              <Server className="w-6 h-6 text-[#6e6d6b]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-[#6e6d6b]">Server Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-[#6e6d6b]">Database Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Pages */}
        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#3b3a39] mb-4">
              Most Viewed Pages
            </h3>
            <div className="space-y-3">
              {analytics.mostViewedPages.length > 0 ? (
                analytics.mostViewedPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-[#6e6d6b] capitalize">
                      {page.page}
                    </span>
                    <span className="text-sm font-medium text-[#3b3a39]">
                      {page.views.toLocaleString()} views
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6e6d6b]">No page view data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Content */}
        <Card className="rounded-xl border-[#dfdeda] shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#3b3a39] mb-4">
              Popular Content
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-[#6e6d6b] mb-2">Top Blogs</h4>
                {analytics.mostPopularBlogs.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.mostPopularBlogs.slice(0, 3).map((blog, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs text-[#6e6d6b] truncate max-w-[200px]">
                          {blog.title}
                        </span>
                        <span className="text-xs font-medium text-[#3b3a39]">
                          {blog.views}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6e6d6b]">No blog data available</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-[#6e6d6b] mb-2">Top Projects</h4>
                {analytics.mostViewedProjects.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.mostViewedProjects.slice(0, 3).map((project, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs text-[#6e6d6b] truncate max-w-[200px]">
                          {project.name}
                        </span>
                        <span className="text-xs font-medium text-[#3b3a39]">
                          {project.views}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6e6d6b]">No project data available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
