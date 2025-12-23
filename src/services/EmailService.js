// Email Service - Gửi email trực tiếp từ code (không qua n8n)
// Sử dụng Nodemailer hoặc Email API

class EmailService {
  constructor() {
    // Cấu hình Gmail SMTP
    this.config = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: import.meta.env.VITE_GMAIL_USER || 'your-email@gmail.com',
        pass: import.meta.env.VITE_GMAIL_APP_PASSWORD || 'your-app-password'
      }
    };
    
    this.fromEmail = import.meta.env.VITE_GMAIL_USER || 'admin@buiquoctuan.id.vn';
    this.adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'tuanbq22it@gmail.com';
  }

  // Gửi email qua backend API (khuyến nghị)
  async sendEmailViaAPI(emailData) {
    try {
      console.log('📧 Sending email via API:', emailData);
      
      // Gọi backend API để gửi email
      const response = await fetch('https://api.buiquoctuan.id.vn/api/notifications/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email sent successfully:', result);
      return { success: true, data: result };

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  // Template: Bài viết mới được đăng
  async sendPostPublishedEmail(post) {
    const emailData = {
      type: 'post-published',
      data: {
        title: post.title || 'Untitled Post',
        message: post.content?.substring(0, 300) || 'No content',
        link: post.facebookPostId 
          ? `https://facebook.com/${post.facebookPostId}`
          : 'https://admin.buiquoctuan.id.vn/posts'
      }
    };

    return await this.sendEmailViaAPI(emailData);
  }

  // Template: Bài viết bị xóa
  async sendPostDeletedEmail(post) {
    const emailData = {
      type: 'post-deleted',
      data: {
        title: post.title || 'Untitled Post',
        reason: post.deleteReason || 'Bài viết bị xóa khỏi hệ thống'
      }
    };

    return await this.sendEmailViaAPI(emailData);
  }

  // Template: Comment vi phạm
  async sendSpamCommentAlert(comment) {
    const emailData = {
      type: 'spam-comment',
      data: {
        comment: comment.message || 'No content',
        user: comment.author || 'Unknown User',
        postTitle: comment.postTitle || 'Unknown Post'
      }
    };

    return await this.sendEmailViaAPI(emailData);
  }

  // Gửi test email
  async sendTestEmail() {
    const emailData = {
      to: this.adminEmail,
      subject: '🧪 Test Email from Admin Panel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #667eea;">✅ Email Service Working!</h1>
          <p>This is a test email from TT News Admin Panel.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('vi-VN')}</p>
        </div>
      `,
      type: 'test'
    };

    return await this.sendEmailViaAPI(emailData);
  }
}

// Export singleton instance
export default new EmailService();
