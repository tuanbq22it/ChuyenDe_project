// Simple Facebook Analytics Service for demo
class SimpleFacebookAnalyticsService {
  async getPageInsights(period = 'day') {
    // Return mock data for demo
    return {
      overview: {
        totalViews: 15420,
        totalReach: 12350,
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

  async getPostsAnalytics(limit = 10) {
    // Return mock posts data
    return [
      {
        id: '1',
        message: 'Ronaldo không có bàn thắng nào trong 4 trận gần nhất với Al-Nassr',
        createdAt: '2025-11-20T10:30:00+0000',
        permalinkUrl: 'https://facebook.com/example/posts/1',
        insights: {
          impressions: 2340,
          reach: 1890,
          engagement: 287,
          clicks: 45
        },
        engagementRate: '15.2'
      },
      {
        id: '2',
        message: 'Lý do bạn nên thêm măng tây vào thực đơn hàng ngày của mình',
        createdAt: '2025-11-19T14:15:00+0000',
        permalinkUrl: 'https://facebook.com/example/posts/2',
        insights: {
          impressions: 1890,
          reach: 1520,
          engagement: 198,
          clicks: 32
        },
        engagementRate: '13.0'
      }
    ];
  }

  async getPageInfo() {
    return {
      name: 'TT News - Demo Mode',
      fan_count: 5420
    };
  }
}

export default SimpleFacebookAnalyticsService;