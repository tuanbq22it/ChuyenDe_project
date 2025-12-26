class FacebookService {
  constructor() {
    // Sử dụng token từ .env file (Hỗ trợ cả Vite và CRA)
    this.accessToken = import.meta.env.VITE_FACEBOOK_PAGE_ACCESS_TOKEN || import.meta.env.REACT_APP_FACEBOOK_PAGE_ACCESS_TOKEN || 'EAAG3zhLcvjABO9AWgnqpFCZAnqTv5vCyDB8JjWHD7TjZAoELDlQwOLT5vZBGyrJjjulGS1yzgppriPEZApojSam0SYOfMIdMlCYmfYAZCXO7L5rOlE1xDlCrRRyYJ3Zp1wJmGfX6IZCLZByGgFNkiZCT0oQ2cfRzlVQ6NYaEf7vZCnnEmBKZA0wwZCJgGGSSle3nfZBgkZD';
    this.pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID || import.meta.env.REACT_APP_FACEBOOK_PAGE_ID || '732045003335546';
    this.analyticsMode = import.meta.env.VITE_ANALYTICS_MODE || import.meta.env.REACT_APP_ANALYTICS_MODE || 'production';

    console.log('🔧 FacebookService initialized:', {
      pageId: this.pageId,
      hasToken: !!this.accessToken,
      tokenPreview: this.accessToken ? `${this.accessToken.substring(0, 10)}...` : 'NO_TOKEN',
      mode: this.analyticsMode
    });
  }

  async getPageInsights() {
    try {
      // Vì insights API có vấn đề với metrics cũ, tạm thời tính từ posts data
      console.log('📊 Getting insights from posts data...');

      const posts = await this.getTopPosts();
      let totalEngagement = 0;
      let totalReach = 0;

      posts.forEach(post => {
        totalEngagement += post.engagement;
        totalReach += post.likes + post.comments + post.shares; // Estimate reach
      });

      const pageInfo = await this.getPageInfo();

      return {
        impressions: totalReach * 3, // Estimate impressions
        reach: totalReach,
        engagement: totalEngagement,
        followers: pageInfo.followers_count || 2,
        dailyData: this.generateDailyData(posts)
      };


    } catch (error) {
      console.error('💥 Facebook Analytics Error:', error.message);
      console.warn('🔄 Using fallback data instead of real Facebook data');

      // Trả về dữ liệu mẫu nếu API lỗi
      return this.getFallbackData();
    }
  }

  async getPageInfo() {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.pageId}?fields=name,followers_count,likes&access_token=${this.accessToken}`;

      console.log('🔗 Facebook Page Info Request:', {
        url: url.replace(this.accessToken, 'TOKEN_HIDDEN'),
        pageId: this.pageId
      });

      const response = await fetch(url);

      console.log('📡 Page Info Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Page Info Error:', errorText);
        throw new Error(`Page Info Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Page Info Success:', data);

      if (data.error) {
        console.error('❌ Page Info API Error:', data.error);
        throw new Error(`Page Info Error: ${data.error.message}`);
      }

      return data;
    } catch (error) {
      console.error('💥 Page Info Error:', error.message);
      console.warn('🔄 Using fallback page info');
      return {
        name: 'TT News',
        followers_count: 5420,
        likes: 5200
      };
    }
  }

  async getTopPosts() {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.pageId}/posts?fields=message,created_time,likes.summary(true),comments.summary(true),shares&limit=10&access_token=${this.accessToken}`;

      console.log('🔗 Facebook Posts Request:', {
        url: url.replace(this.accessToken, 'TOKEN_HIDDEN'),
        pageId: this.pageId
      });

      const response = await fetch(url);

      console.log('📡 Posts Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Posts Error:', errorText);
        throw new Error(`Posts Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Posts Success:', data);

      if (data.error) {
        console.error('❌ Posts API Error:', data.error);
        throw new Error(`Posts Error: ${data.error.message}`);
      }

      if (!data.data || data.data.length === 0) {
        console.warn('⚠️ No posts data returned');
        throw new Error('No posts available');
      }

      // Xử lý và sắp xếp posts theo engagement
      const processedPosts = data.data.map(post => {
        const likes = post.likes?.summary?.total_count || 0;
        const comments = post.comments?.summary?.total_count || 0;
        const shares = post.shares?.count || 0;
        const engagement = likes + comments + shares;

        return {
          id: post.id,
          message: post.message || 'No message',
          title: this.truncateMessage(post.message || 'Bài viết không có tiêu đề'),
          likes,
          comments,
          shares,
          engagement,
          created_time: post.created_time
        };
      });

      console.log('📊 Processed Posts:', processedPosts);

      // Sắp xếp theo engagement và lấy top 3
      const topPosts = processedPosts
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 3);

      console.log('🏆 Top Posts:', topPosts);

      return topPosts;

    } catch (error) {
      console.error('💥 Posts Error:', error.message);
      console.warn('🔄 Using fallback posts data');
      return this.getFallbackPosts();
    }
  }

  processInsightsData(insightsData) {
    const result = {
      impressions: 0,
      reach: 0,
      engagement: 0,
      followers: 0,
      dailyData: []
    };

    insightsData.forEach(insight => {
      const metric = insight.name;
      const values = insight.values;

      switch (metric) {
        case 'page_impressions':
          result.impressions = values.reduce((sum, day) => sum + (day.value || 0), 0);
          break;
        case 'page_impressions_unique':
          result.reach = values.reduce((sum, day) => sum + (day.value || 0), 0);
          break;
        case 'page_post_engagements':
          result.engagement = values.reduce((sum, day) => sum + (day.value || 0), 0);
          break;
        case 'page_fan_adds':
          result.followers = values.reduce((sum, day) => sum + (day.value || 0), 0);
          break;
      }

      // Lưu dữ liệu hàng ngày để vẽ chart
      if (metric === 'page_impressions') {
        result.dailyData = values.map(day => ({
          date: day.end_time,
          value: day.value || 0
        }));
      }
    });

    return result;
  }

  truncateMessage(message, maxLength = 50) {
    if (!message) return 'Bài viết không có tiêu đề';
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  }

  getFallbackData() {
    return {
      impressions: 15420,
      reach: 12350,
      engagement: 1050,
      followers: 145,
      dailyData: [
        { date: '2024-11-18', value: 1200 },
        { date: '2024-11-19', value: 1350 },
        { date: '2024-11-20', value: 1180 },
        { date: '2024-11-21', value: 1420 },
        { date: '2024-11-22', value: 1680 },
        { date: '2024-11-23', value: 1890 },
        { date: '2024-11-24', value: 2100 }
      ]
    };
  }

  generateDailyData(posts) {
    // Generate daily data từ posts
    const dailyData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Tính impressions estimate cho từng ngày
      const postsOnThisDay = posts.filter(post => {
        const postDate = new Date(post.created_time);
        return postDate.toDateString() === date.toDateString();
      });

      let value = postsOnThisDay.reduce((sum, post) => sum + (post.engagement * 3), 0) || (100 + Math.random() * 200);

      dailyData.push({
        date: date.toISOString(),
        value: Math.round(value)
      });
    }

    return dailyData;
  }

  getFallbackPosts() {
    return [
      {
        title: 'Ronaldo không có bàn thắng nào...',
        engagement: 340,
        likes: 230,
        comments: 45,
        shares: 65
      },
      {
        title: 'Lý do nên thêm măng tây...',
        engagement: 285,
        likes: 198,
        comments: 32,
        shares: 55
      },
      {
        title: 'Vietjet vào top "Nơi làm việc tốt nhất"',
        engagement: 220,
        likes: 145,
        comments: 28,
        shares: 47
      }
    ];
  }

  calculateEngagementRate(engagement, reach) {
    if (reach === 0) return 0;
    return ((engagement / reach) * 100).toFixed(1);
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
  async getPostById(postId) {
    try {
      const url = `https://graph.facebook.com/v18.0/${postId}?fields=message,created_time&access_token=${this.accessToken}`;
      const response = await fetch(url);

      if (!response.ok) {
        let errorMessage = 'Failed to fetch post';
        try {
          const errorData = await response.json();
          console.error('❌ Facebook API Error for Post:', postId, errorData);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          console.error('❌ Failed to parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return {
        id: data.id,
        title: this.truncateMessage(data.message),
        message: data.message,
        createdAt: data.created_time
      };
    } catch (error) {
      console.error('Error fetching post:', error.message);
      return null;
    }
  }
}

export default FacebookService;