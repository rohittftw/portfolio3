import { apiRequest } from './api';

export interface AnalyticsData {
  uptime_seconds: number;
  http_requests_total: number;
  admin_login_attempts: {
    success: number;
    failure: number;
  };
  page_views: Record<string, number>;
  blog_views: Record<string, { count: number; title: string }>;
  project_views: Record<string, { count: number; name: string }>;
  average_response_time_ms: number;
  active_users: number;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  totalBlogViews: number;
  totalProjectViews: number;
  totalRequests: number;
  loginSuccessRate: number;
  averageResponseTime: number;
  uptime: string;
  mostViewedPages: Array<{ page: string; views: number }>;
  mostPopularBlogs: Array<{ id: string; title: string; views: number }>;
  mostViewedProjects: Array<{ id: string; name: string; views: number }>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private trackingCache = new Set<string>(); // Add cache to prevent duplicates
  private cacheTimeout = 5000; // 5 seconds cache

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Fetch raw analytics data
  async getAnalyticsData(): Promise<AnalyticsData> {
    return apiRequest<AnalyticsData>('/analytics');
  }

  // Get processed analytics summary
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const data = await this.getAnalyticsData();

    const totalPageViews = Object.values(data.page_views).reduce((sum, count) => sum + count, 0);
    const totalBlogViews = Object.values(data.blog_views).reduce((sum, blog) => sum + blog.count, 0);
    const totalProjectViews = Object.values(data.project_views).reduce((sum, project) => sum + project.count, 0);

    const totalLoginAttempts = data.admin_login_attempts.success + data.admin_login_attempts.failure;
    const loginSuccessRate = totalLoginAttempts > 0
      ? (data.admin_login_attempts.success / totalLoginAttempts) * 100
      : 0;

    // Convert uptime to readable format
    const uptimeHours = Math.floor(data.uptime_seconds / 3600);
    const uptimeMinutes = Math.floor((data.uptime_seconds % 3600) / 60);
    const uptime = `${uptimeHours}h ${uptimeMinutes}m`;

    // Get top pages, blogs, and projects
    const mostViewedPages = Object.entries(data.page_views)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const mostPopularBlogs = Object.entries(data.blog_views)
      .map(([id, { count, title }]) => ({ id, title, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const mostViewedProjects = Object.entries(data.project_views)
      .map(([id, { count, name }]) => ({ id, name, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      totalPageViews,
      totalBlogViews,
      totalProjectViews,
      totalRequests: data.http_requests_total,
      loginSuccessRate,
      averageResponseTime: data.average_response_time_ms,
      uptime,
      mostViewedPages,
      mostPopularBlogs,
      mostViewedProjects,
    };
  }

  // Enhanced track page view with deduplication
  async trackPageView(page: string): Promise<void> {
    const cacheKey = `page_${page}_${Date.now().toString().slice(0, -3)}`; // Cache per second

    if (this.trackingCache.has(cacheKey)) {
      console.log(`Skipping duplicate page view for: ${page}`);
      return;
    }

    this.trackingCache.add(cacheKey);

    // Clear cache after timeout
    setTimeout(() => {
      this.trackingCache.delete(cacheKey);
    }, this.cacheTimeout);

    try {
      await apiRequest('/analytics/pageview', {
        method: 'POST',
        body: JSON.stringify({ page }),
      });
      console.log(`Tracked page view: ${page}`);
    } catch (error) {
      console.error('Page view tracking error:', error);
      // Remove from cache if request failed
      this.trackingCache.delete(cacheKey);
    }
  }

  // Enhanced blog view tracking
  async trackBlogView(blogId: string, blogTitle: string): Promise<void> {
    const cacheKey = `blog_${blogId}_${Date.now().toString().slice(0, -3)}`;

    if (this.trackingCache.has(cacheKey)) {
      console.log(`Skipping duplicate blog view for: ${blogId}`);
      return;
    }

    this.trackingCache.add(cacheKey);
    setTimeout(() => this.trackingCache.delete(cacheKey), this.cacheTimeout);

    try {
      await apiRequest('/analytics/blog-view', {
        method: 'POST',
        body: JSON.stringify({ blogId, blogTitle }),
      });
      console.log(`Tracked blog view: ${blogTitle}`);
    } catch (error) {
      console.error('Blog view tracking error:', error);
      this.trackingCache.delete(cacheKey);
    }
  }

  // Enhanced project view tracking
  async trackProjectView(projectId: string, projectName: string): Promise<void> {
    const cacheKey = `project_${projectId}_${Date.now().toString().slice(0, -3)}`;

    if (this.trackingCache.has(cacheKey)) {
      console.log(`Skipping duplicate project view for: ${projectId}`);
      return;
    }

    this.trackingCache.add(cacheKey);
    setTimeout(() => this.trackingCache.delete(cacheKey), this.cacheTimeout);

    try {
      await apiRequest('/analytics/project-view', {
        method: 'POST',
        body: JSON.stringify({ projectId, projectName }),
      });
      console.log(`Tracked project view: ${projectName}`);
    } catch (error) {
      console.error('Project view tracking error:', error);
      this.trackingCache.delete(cacheKey);
    }
  }

  // Utility method to clear cache manually
  clearCache(): void {
    this.trackingCache.clear();
    console.log('Analytics tracking cache cleared');
  }

  // Get cache status for debugging
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.trackingCache.size,
      keys: Array.from(this.trackingCache)
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();
