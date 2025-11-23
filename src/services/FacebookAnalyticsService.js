// Facebook Graph API service for fetching analytics data
const FACEBOOK_CONFIG = {
  PAGE_ID: '732045003335546', // ID trang Facebook của bạn (từ n8n workflow)
  ACCESS_TOKEN: process.env.REACT_APP_FB_ACCESS_TOKEN || 'YOUR_FB_ACCESS_TOKEN',
  API_VERSION: 'v18.0'
};

class FacebookAnalyticsService {
  constructor() {
    this.baseUrl = `https://graph.facebook.com/${FACEBOOK_CONFIG.API_VERSION}`;
    this.pageId = FACEBOOK_CONFIG.PAGE_ID;
    this.accessToken = FACEBOOK_CONFIG.ACCESS_TOKEN;
  }

  /**
   * Get page insights (analytics data)
   */
  async getPageInsights(period = 'day', since = null, until = null) {
    try {
      const sinceDate = since || this.getDateDaysAgo(7);
      const untilDate = until || new Date().toISOString().split('T')[0];

      const metrics = [
        'page_impressions',           // Lượt hiển thị trang
        'page_reach',                // Lượt tiếp cận
        'page_post_engagements',     // Tương tác bài viết
        'page_fans',                 // Số người theo dõi
        'page_fan_adds',             // Lượt follow mới
        'page_views_total',          // Tổng lượt xem trang
        'page_posts_impressions',    // Lượt hiển thị bài viết
        'page_video_views'           // Lượt xem video
      ];

      const url = `${this.baseUrl}/${this.pageId}/insights`;
      const params = new URLSearchParams({
        metric: metrics.join(','),
        period: period,
        since: sinceDate,
        until: untilDate,
        access_token: this.accessToken
      });

      console.log('🔍 Fetching Facebook Page Insights:', url + '?' + params);

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Facebook API Error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Facebook Insights received:', data);

      return this.processInsightsData(data.data);
    } catch (error) {
      console.error('❌ Failed to fetch Facebook insights:', error);
      throw error;
    }
  }

  /**
   * Get posts data with engagement metrics
   */
  async getPostsAnalytics(limit = 25) {
    try {
      const fields = [
        'id',
        'message',
        'created_time',
        'type',
        'status_type',
        'permalink_url',
        'full_picture',
        'insights.metric(post_impressions,post_reach,post_engaged_users,post_video_views,post_clicks)'
      ];

      const url = `${this.baseUrl}/${this.pageId}/posts`;
      const params = new URLSearchParams({
        fields: fields.join(','),
        limit: limit,
        access_token: this.accessToken
      });

      console.log('🔍 Fetching Facebook Posts:', url + '?' + params);

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Facebook API Error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Facebook Posts received:', data.data?.length, 'posts');

      return this.processPostsData(data.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch Facebook posts:', error);
      throw error;
    }
  }

  /**
   * Get page basic info
   */
  async getPageInfo() {
    try {
      const fields = [
        'id',
        'name', 
        'fan_count',
        'followers_count',
        'talking_about_count',
        'were_here_count',
        'category',
        'website'
      ];

      const url = `${this.baseUrl}/${this.pageId}`;
      const params = new URLSearchParams({
        fields: fields.join(','),
        access_token: this.accessToken
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Facebook API Error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Facebook Page Info:', data);

      return data;
    } catch (error) {
      console.error('❌ Failed to fetch Facebook page info:', error);
      throw error;
    }
  }

  /**
   * Process insights data into usable format
   */
  processInsightsData(insights) {
    const processed = {
      overview: {
        totalViews: 0,
        totalReach: 0,
        totalEngagement: 0,
        totalFollowers: 0,
        newFollowers: 0
      },
      chartData: [],
      dailyStats: {}
    };

    insights.forEach(insight => {
      const { name, values } = insight;
      
      // Process different metrics
      switch (name) {
        case 'page_views_total':
        case 'page_impressions':
          processed.overview.totalViews += this.sumValues(values);
          break;
        case 'page_reach':
          processed.overview.totalReach += this.sumValues(values);
          break;
        case 'page_post_engagements':
          processed.overview.totalEngagement += this.sumValues(values);
          break;
        case 'page_fans':
          processed.overview.totalFollowers = this.getLatestValue(values);
          break;
        case 'page_fan_adds':
          processed.overview.newFollowers += this.sumValues(values);
          break;
      }

      // Build chart data
      if (values && values.length > 0) {
        values.forEach(value => {
          const date = value.end_time.split('T')[0];
          if (!processed.dailyStats[date]) {
            processed.dailyStats[date] = {};
          }
          processed.dailyStats[date][name] = value.value;
        });
      }
    });

    // Convert dailyStats to chartData array
    processed.chartData = Object.keys(processed.dailyStats)
      .sort()
      .map(date => ({
        date,
        views: processed.dailyStats[date]['page_impressions'] || 0,
        reach: processed.dailyStats[date]['page_reach'] || 0,
        engagement: processed.dailyStats[date]['page_post_engagements'] || 0
      }));

    return processed;
  }

  /**
   * Process posts data into usable format
   */
  processPostsData(posts) {
    return posts.map(post => {
      let insights = {
        impressions: 0,
        reach: 0,
        engagement: 0,
        clicks: 0
      };

      // Extract insights data if available
      if (post.insights && post.insights.data) {
        post.insights.data.forEach(insight => {
          const value = insight.values?.[0]?.value || 0;
          switch (insight.name) {
            case 'post_impressions':
              insights.impressions = value;
              break;
            case 'post_reach':
              insights.reach = value;
              break;
            case 'post_engaged_users':
              insights.engagement = value;
              break;
            case 'post_clicks':
              insights.clicks = value;
              break;
          }
        });
      }

      return {
        id: post.id,
        message: post.message || 'Bài viết không có text',
        createdAt: post.created_time,
        type: post.type,
        statusType: post.status_type,
        permalinkUrl: post.permalink_url,
        image: post.full_picture,
        insights: insights,
        engagementRate: insights.reach > 0 ? ((insights.engagement / insights.reach) * 100).toFixed(1) : 0
      };
    });
  }

  // Helper methods
  sumValues(values) {
    return values.reduce((sum, item) => sum + (item.value || 0), 0);
  }

  getLatestValue(values) {
    return values.length > 0 ? values[values.length - 1].value || 0 : 0;
  }

  getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
}

// Mock service for demo mode
class MockFacebookAnalyticsService {
  async getPageInsights(period = 'day', since = null, until = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      overview: {
        totalViews: 15420,
        totalReach: 12350,
        totalEngagement: 1847,
        totalFollowers: 5420,
        newFollowers: 127
      },
      chartData: [
        { date: '2025-11-17', views: 1200, reach: 980, engagement: 145 },
        { date: '2025-11-18', views: 1350, reach: 1120, engagement: 167 },
        { date: '2025-11-19', views: 1180, reach: 950, engagement: 123 },
        { date: '2025-11-20', views: 1420, reach: 1200, engagement: 189 },
        { date: '2025-11-21', views: 1680, reach: 1350, engagement: 245 },
        { date: '2025-11-22', views: 1890, reach: 1580, engagement: 287 },
        { date: '2025-11-23', views: 2100, reach: 1750, engagement: 321 }
      ]
    };
  }

  async getPostsAnalytics(limit = 25) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '732045003335546_123456789',
        message: 'Ronaldo không có bàn thắng nào trong 4 trận gần nhất 🏆⚽',
        createdAt: '2025-11-20T10:30:00+0000',
        type: 'photo',
        permalinkUrl: 'https://facebook.com/732045003335546/posts/123456789',
        insights: {
          impressions: 2340,
          reach: 1890,
          engagement: 287,
          clicks: 45
        },
        engagementRate: 15.2
      },
      {
        id: '732045003335546_123456790',
        message: 'Lý do nên thêm măng tây vào thực đơn hàng ngày 🥗',
        createdAt: '2025-11-19T14:15:00+0000',
        type: 'photo', 
        permalinkUrl: 'https://facebook.com/732045003335546/posts/123456790',
        insights: {
          impressions: 1890,
          reach: 1520,
          engagement: 198,
          clicks: 32
        },
        engagementRate: 13.0
      }
    ];
  }

  async getPageInfo() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: '732045003335546',
      name: 'TT News - Tin tức tự động',
      fan_count: 5420,
      followers_count: 5580,
      talking_about_count: 245,
      category: 'Media/News Company'
    };
  }
}

// Factory function to get appropriate service
export const getFacebookAnalyticsService = () => {
  const isDemoMode = !FACEBOOK_CONFIG.ACCESS_TOKEN || 
                    FACEBOOK_CONFIG.ACCESS_TOKEN === 'YOUR_FB_ACCESS_TOKEN' ||
                    window.location.hostname === 'localhost';
  
  if (isDemoMode) {
    console.log('🔄 Using Mock Facebook Analytics Service (Demo Mode)');
    return new MockFacebookAnalyticsService();
  } else {
    console.log('🌐 Using Real Facebook Analytics Service');
    return new FacebookAnalyticsService();
  }
};

// Export both the service factory and classes
export { FacebookAnalyticsService, MockFacebookAnalyticsService };
export default createFacebookAnalyticsService;