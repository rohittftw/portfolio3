export const generateTestAnalyticsData = async () => {
  const baseUrl = 'http://localhost:3000/api/analytics';

  try {
    // Simulate page views
    const pages = ['home', 'projects', 'blog', 'resume'];
    const viewCounts = [50, 30, 25, 15]; // Different view counts for different pages

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const count = viewCounts[i];

      // Generate multiple page views
      for (let j = 0; j < count; j++) {
        await fetch(`${baseUrl}/pageview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page })
        });

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    // Simulate blog views
    const blogs = [
      { id: 'react-hooks', title: 'Understanding React Hooks' },
      { id: 'nodejs-api', title: 'Building REST APIs with Node.js' },
      { id: 'typescript-guide', title: 'TypeScript Best Practices' }
    ];

    for (const blog of blogs) {
      const viewCount = Math.floor(Math.random() * 20) + 5; // 5-25 views
      for (let i = 0; i < viewCount; i++) {
        await fetch(`${baseUrl}/blog-view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blogId: blog.id, blogTitle: blog.title })
        });
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }

    console.log('Test analytics data generated successfully!');
  } catch (error) {
    console.error('Error generating test data:', error);
  }
};
