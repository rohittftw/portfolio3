import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  BarChart3,
  Users,
  FileText,
  Folder,
  TrendingUp,
  Eye,
  MessageSquare,
  Plus,
  Settings,
  Activity,
  Clock,
  ExternalLink
} from "lucide-react";
import { generateTestAnalyticsData } from "../../utils/generateTestData"

import { LogoutButton } from "../../components/ui/LogoutButton";
import { adminAuth } from "../../lib/api";
import { analyticsService } from "../../lib/analyticsApi";
import { AnalyticsTab } from "./AnalyticsTab";

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  action: string;
  item: string;
  time: string;
  type: 'project' | 'blog' | 'user' | 'system';
}

export const AdminDashboard = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'manage'>('overview');
   const navigate = useNavigate();
   const currentAdmin = adminAuth.getCurrentAdmin();

   const [quickStats, setQuickStats] = useState({
     totalViews: 0,
     totalBlogs: 0,
     totalProjects: 0,
     engagementRate: 0
   });

   // Move fetchQuickStats OUTSIDE of useEffect so it can be called from anywhere
   const fetchQuickStats = async () => {
     try {
       const analytics = await analyticsService.getAnalyticsSummary();
       setQuickStats({
         totalViews: analytics.totalPageViews,
         totalBlogs: analytics.totalBlogViews,
         totalProjects: analytics.totalProjectViews,
         engagementRate: Math.round((analytics.totalBlogViews + analytics.totalProjectViews) / analytics.totalPageViews * 100) || 0
       });
     } catch (error) {
       console.error('Failed to fetch quick stats:', error);
     }
   };

   useEffect(() => {
     if (activeTab === 'overview') {
       fetchQuickStats();
     }
   }, [activeTab]);

   // Navigation handlers
   const handleNewProject = () => navigate('/admin/projects/new');
   const handleNewBlog = () => navigate('/admin/blogs/new');
   const handleViewPortfolio = () => navigate('/');
   const handleViewAnalytics = () => setActiveTab('analytics');
   const handleManageProjects = () => navigate('/admin/projects');
   const handleManageBlogs = () => navigate('/admin/blogs');
   const handleViewAllActivity = () => {
     alert('Activity log feature coming soon!');
   };

   // Handle generate test data
   const handleGenerateTestData = async () => {
     try {
       await generateTestAnalyticsData();
       // Now we can call fetchQuickStats because it's defined at component level
       await fetchQuickStats();
       alert('Test data generated successfully!');
     } catch (error) {
       console.error('Error generating test data:', error);
       alert('Failed to generate test data');
     }
   };

   const metrics: DashboardMetric[] = [
     {
       title: "Total Page Views",
       value: quickStats.totalViews.toLocaleString(),
       change: "+0 today",
       trend: 'up',
       icon: <Eye className="w-6 h-6" />
     },
     {
       title: "Blog Views",
       value: quickStats.totalBlogs.toLocaleString(),
       change: "+0 today",
       trend: 'up',
       icon: <FileText className="w-6 h-6" />
     },
     {
       title: "Project Views",
       value: quickStats.totalProjects.toLocaleString(),
       change: "+0 today",
       trend: 'up',
       icon: <Folder className="w-6 h-6" />
     },
     {
       title: "Engagement Rate",
       value: `${quickStats.engagementRate}%`,
       change: "Based on interactions",
       trend: 'up',
       icon: <TrendingUp className="w-6 h-6" />
     }
   ];


  const recentActivity: RecentActivity[] = [
    { id: '1', action: 'Published new blog', item: 'React Server Components Guide', time: '2 hours ago', type: 'blog' },
    { id: '2', action: 'Updated project', item: 'E-commerce Dashboard', time: '5 hours ago', type: 'project' },
    { id: '3', action: 'New project created', item: 'AI Chat Application', time: '1 day ago', type: 'project' },
    { id: '4', action: 'Blog draft saved', item: 'TypeScript Best Practices', time: '2 days ago', type: 'blog' },
    { id: '5', action: 'Project deployed', item: 'Weather App', time: '3 days ago', type: 'project' }
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'project': return <Folder className="w-4 h-4" />;
      case 'blog': return <FileText className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 w-fit border border-[#dfdeda]">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'manage', label: 'Manage', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className={`${activeTab === tab.id ? 'bg-[#3b3a39] text-white' : 'text-[#6e6d6b]'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="rounded-xl border-[#dfdeda] shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-[#f4f2ee] rounded-lg">
                      {metric.icon}
                    </div>
                    <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                      {metric.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#3b3a39] mb-1">
                      {metric.value}
                    </h3>
                    <p className="text-sm text-[#6e6d6b]">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="rounded-xl border-[#dfdeda] shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#3b3a39]">Recent Activity</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewAllActivity}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#f4f2ee] transition-colors">
                        <div className="p-2 bg-white rounded-lg border border-[#dfdeda]">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#3b3a39]">
                            {activity.action}
                          </p>
                          <p className="text-sm text-[#6e6d6b]">{activity.item}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#6e6d6b]">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className="rounded-xl border-[#dfdeda] shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-[#3b3a39] mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-[#3b3a39] hover:bg-[#2d2c2b]"
                      onClick={handleNewProject}
                    >
                      <Plus className="w-4 h-4" />
                      New Project
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleNewBlog}
                    >
                      <FileText className="w-4 h-4" />
                      Write Blog Post
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleViewPortfolio}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Portfolio
                    </Button>


                    <Button
                                         variant="outline"
                                         className="w-full justify-start"
                                         onClick={handleViewAnalytics}
                                       >
                                         <BarChart3 className="w-4 h-4" />
                                         Analytics Report
                                       </Button>
                                       <Button
                                         variant="outline"
                                         className="w-full justify-start"
                                         onClick={handleGenerateTestData}
                                       >
                                         <Activity className="w-4 h-4" />
                                         Generate Test Data
                                       </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && <AnalyticsTab />


      }

      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-xl border-[#dfdeda] shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#3b3a39] mb-4">Content Management</h2>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleManageProjects}
                  >
                    <Folder className="w-4 h-4" />
                    Manage Projects
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleManageBlogs}
                  >
                    <FileText className="w-4 h-4" />
                    Manage Blogs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4" />
                    Comments & Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
                    <LogoutButton />
            <Card className="rounded-xl border-[#dfdeda] shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#3b3a39] mb-4">System Settings</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4" />
                    Site Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4" />
                    User Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4" />
                    Activity Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      )}
    </div>
  );
};
