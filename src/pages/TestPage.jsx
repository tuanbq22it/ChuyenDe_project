import React from 'react';

const TestPage = () => {
  return (
    <div style={{padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh'}}>
      <h1 style={{color: '#333', textAlign: 'center'}}>🚀 Admin Panel Test</h1>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '20px auto'
      }}>
        <h2>✅ React App is Working!</h2>
        <p>Nếu bạn thấy trang này, React app đã hoạt động bình thường.</p>
        <p><strong>Thời gian:</strong> {new Date().toLocaleString()}</p>
        
        <div style={{marginTop: '20px'}}>
          <h3>🔧 Debugging Info:</h3>
          <ul>
            <li>React Version: {React.version}</li>
            <li>Node Environment: {process.env.NODE_ENV || 'development'}</li>
            <li>Current URL: {window.location.href}</li>
          </ul>
        </div>

        <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px'}}>
          <strong>📝 Next Steps:</strong>
          <ol>
            <li>Đi tới <a href="/login">/login</a> để đăng nhập</li>
            <li>Sử dụng: admin@example.com / 123456</li>
            <li>Sau khi đăng nhập sẽ vào dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestPage;