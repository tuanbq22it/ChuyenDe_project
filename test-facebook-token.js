// Test Facebook Token
const pageId = '732045003335546';

// Thay YOUR_TOKEN_HERE bằng token thật từ Facebook Developers
const accessToken = 'EAAfPYE7egL8BPjiBiZCgxRYBXMMNWo0AfUevZC59GZBZA61I2siW5bqE5yDnIFZCfa3WrVnfmsCRDkZByEsxMxXSUPZBPEL6q3Up2ZAGVzngAX640PCpztCNAhBt6KmZBzkcMwm1F45DIZA88UFNO2exrr5ZCDPlPrFtzSUCbmX5S93fYD6SDs6DSQPJ8cMadTMVdnKgbUv';

async function testFacebookAPI() {
  try {
    console.log('🔍 Testing Facebook API...');
    
    // Test 1: Page Info
    const pageUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=name,likes,followers_count&access_token=${accessToken}`;
    console.log('📄 Testing Page Info...');
    
    const pageResponse = await fetch(pageUrl);
    const pageData = await pageResponse.json();
    
    if (pageData.error) {
      console.error('❌ Page Info Error:', pageData.error);
    } else {
      console.log('✅ Page Info Success:', pageData);
    }
    
    // Test 2: Insights
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const until = new Date();
    
    const insightsUrl = `https://graph.facebook.com/v18.0/${pageId}/insights?metric=page_impressions,page_reach&period=day&since=${since.toISOString().split('T')[0]}&until=${until.toISOString().split('T')[0]}&access_token=${accessToken}`;
    console.log('📊 Testing Insights...');
    
    const insightsResponse = await fetch(insightsUrl);
    const insightsData = await insightsResponse.json();
    
    if (insightsData.error) {
      console.error('❌ Insights Error:', insightsData.error);
    } else {
      console.log('✅ Insights Success:', insightsData);
    }
    
    // Test 3: Posts
    const postsUrl = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=message,likes.summary(true),comments.summary(true),shares&limit=5&access_token=${accessToken}`;
    console.log('📝 Testing Posts...');
    
    const postsResponse = await fetch(postsUrl);
    const postsData = await postsResponse.json();
    
    if (postsData.error) {
      console.error('❌ Posts Error:', postsData.error);
    } else {
      console.log('✅ Posts Success:', postsData);
    }
    
  } catch (error) {
    console.error('💥 Test Error:', error);
  }
}

// Run test
testFacebookAPI();