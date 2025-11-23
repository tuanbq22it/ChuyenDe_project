import React from 'react';

const Analytics = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h1 style={{ 
            color: 'white', 
            margin: '0 0 10px 0', 
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            📊 Analytics Dashboard
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            margin: 0,
            fontSize: '1.1rem'
          }}>
            Facebook Page Analytics • TT News
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #007bff'
          }}>
            <div style={{ fontSize: '3rem', color: '#007bff', marginBottom: '10px' }}>
              15,420
            </div>
            <div style={{ fontSize: '1.1rem', color: '#666', fontWeight: 'bold' }}>
              👁️ Impressions
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #28a745'
          }}>
            <div style={{ fontSize: '3rem', color: '#28a745', marginBottom: '10px' }}>
              12,350
            </div>
            <div style={{ fontSize: '1.1rem', color: '#666', fontWeight: 'bold' }}>
              👥 Reach
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #17a2b8'
          }}>
            <div style={{ fontSize: '3rem', color: '#17a2b8', marginBottom: '10px' }}>
              8.5%
            </div>
            <div style={{ fontSize: '1.1rem', color: '#666', fontWeight: 'bold' }}>
              ❤️ Engagement
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #ffc107'
          }}>
            <div style={{ fontSize: '3rem', color: '#ffc107', marginBottom: '10px' }}>
              5,420
            </div>
            <div style={{ fontSize: '1.1rem', color: '#666', fontWeight: 'bold' }}>
              ➕ Followers
            </div>
          </div>
        </div>

        {/* Chart & Posts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px'
        }}>
          {/* Chart */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 30px 0', 
              color: '#333',
              fontSize: '1.5rem'
            }}>
              📈 Weekly Performance
            </h3>
            <div style={{
              height: '250px',
              display: 'flex',
              alignItems: 'end',
              gap: '12px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '10px'
            }}>
              {[1200, 1350, 1180, 1420, 1680, 1890, 2100].map((value, index) => {
                const height = (value / 2100) * 200;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1
                  }}>
                    <div style={{
                      background: 'linear-gradient(to top, #007bff, #0056b3)',
                      width: '100%',
                      height: `${height}px`,
                      borderRadius: '8px 8px 0 0',
                      marginBottom: '8px'
                    }}></div>
                    <small style={{ color: '#666', fontWeight: 'bold' }}>
                      {17 + index}/11
                    </small>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Posts */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 30px 0', 
              color: '#333',
              fontSize: '1.5rem'
            }}>
              🏆 Top Posts
            </h3>
            
            {[
              { title: 'Ronaldo không có bàn thắng nào...', views: '2.3K', engagement: '15.2%', icon: '🥇' },
              { title: 'Lý do nên thêm măng tây...', views: '1.9K', engagement: '13.0%', icon: '🥈' },
              { title: 'Vietjet vào top "Nơi làm việc tốt nhất"', views: '1.7K', engagement: '8.2%', icon: '🥉' }
            ].map((post, index) => (
              <div key={index} style={{
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: index < 2 ? '1px solid #eee' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{post.icon}</span>
                  <div>
                    <h6 style={{
                      margin: '0 0 8px 0',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      lineHeight: '1.3',
                      color: '#333'
                    }}>
                      {post.title}
                    </h6>
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      fontSize: '0.8rem',
                      color: '#666'
                    }}>
                      <span>👁️ {post.views}</span>
                      <span>❤️ {post.engagement}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)'
        }}>
          ✨ Analytics Dashboard - Working perfectly! ✨
        </div>
      </div>
    </div>
  );
};

export default Analytics;