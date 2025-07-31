"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = exports.portfolioMetrics = void 0;
// Simple in-memory metrics storage
class PortfolioMetrics {
    constructor() {
        this.startTime = Date.now();
        // Metrics storage
        this.httpRequestsTotal = 0;
        this.adminLoginAttempts = { success: 0, failure: 0 };
        this.pageViews = new Map();
        this.blogViews = new Map();
        this.projectViews = new Map();
        this.responseTimes = [];
        this.activeUsers = 0;
    }
    static getInstance() {
        if (!PortfolioMetrics.instance) {
            PortfolioMetrics.instance = new PortfolioMetrics();
        }
        return PortfolioMetrics.instance;
    }
    // HTTP Request tracking
    incrementHttpRequests(method, route, statusCode) {
        this.httpRequestsTotal++;
    }
    // Login attempt tracking
    recordLoginAttempt(success) {
        if (success) {
            this.adminLoginAttempts.success++;
        }
        else {
            this.adminLoginAttempts.failure++;
        }
    }
    // Page view tracking
    recordPageView(page) {
        const current = this.pageViews.get(page) || 0;
        this.pageViews.set(page, current + 1);
    }
    // Blog view tracking
    recordBlogView(blogId, title) {
        const current = this.blogViews.get(blogId) || { count: 0, title };
        this.blogViews.set(blogId, { count: current.count + 1, title });
    }
    // Project view tracking
    recordProjectView(projectId, name) {
        const current = this.projectViews.get(projectId) || { count: 0, name };
        this.projectViews.set(projectId, { count: current.count + 1, name });
    }
    // Response time tracking
    recordResponseTime(time) {
        this.responseTimes.push(time);
        // Keep only last 1000 response times
        if (this.responseTimes.length > 1000) {
            this.responseTimes.shift();
        }
    }
    // Get all metrics in a format suitable for export
    getMetrics() {
        const avgResponseTime = this.responseTimes.length > 0
            ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
            : 0;
        return {
            uptime_seconds: Math.floor((Date.now() - this.startTime) / 1000),
            http_requests_total: this.httpRequestsTotal,
            admin_login_attempts: this.adminLoginAttempts,
            page_views: Object.fromEntries(this.pageViews),
            blog_views: Object.fromEntries(this.blogViews),
            project_views: Object.fromEntries(this.projectViews),
            average_response_time_ms: Math.round(avgResponseTime),
            active_users: this.activeUsers,
            timestamp: new Date().toISOString()
        };
    }
    // Get metrics in Prometheus format (optional)
    getPrometheusFormat() {
        const metrics = this.getMetrics();
        let output = '';
        output += `# HELP portfolio_http_requests_total Total HTTP requests\n`;
        output += `# TYPE portfolio_http_requests_total counter\n`;
        output += `portfolio_http_requests_total ${metrics.http_requests_total}\n\n`;
        output += `# HELP portfolio_admin_login_success_total Successful admin logins\n`;
        output += `# TYPE portfolio_admin_login_success_total counter\n`;
        output += `portfolio_admin_login_success_total ${metrics.admin_login_attempts.success}\n\n`;
        output += `# HELP portfolio_admin_login_failure_total Failed admin logins\n`;
        output += `# TYPE portfolio_admin_login_failure_total counter\n`;
        output += `portfolio_admin_login_failure_total ${metrics.admin_login_attempts.failure}\n\n`;
        return output;
    }
}
// Export singleton instance
exports.portfolioMetrics = PortfolioMetrics.getInstance();
// Simple middleware that works with Express 5
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    // Use the 'finish' event instead of overriding res.end
    res.on('finish', () => {
        var _a;
        const duration = Date.now() - start;
        const route = ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path;
        exports.portfolioMetrics.incrementHttpRequests(req.method, route, res.statusCode);
        exports.portfolioMetrics.recordResponseTime(duration);
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
