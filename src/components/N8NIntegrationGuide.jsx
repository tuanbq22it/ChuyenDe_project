import React, { useState } from 'react';

const N8NIntegrationGuide = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!show) return null;

  const tabs = [
    { id: 'overview', title: 'Tổng quan', icon: 'bi-info-circle' },
    { id: 'workflow', title: 'Quy trình', icon: 'bi-diagram-3' },
    { id: 'setup', title: 'Thiết lập', icon: 'bi-gear' },
    { id: 'testing', title: 'Test thử', icon: 'bi-play-circle' }
  ];

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-robot me-2"></i>
                Tích hợp n8n - Tự động đăng tin tự tạo
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
              ></button>
            </div>
            
            <div className="modal-body p-0">
              <div className="row g-0 h-100">
                {/* Tabs Navigation */}
                <div className="col-md-3 bg-light">
                  <div className="nav flex-column nav-pills p-3" style={{minHeight: '500px'}}>
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        className={`nav-link text-start mb-2 ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <i className={`${tab.icon} me-2`}></i>
                        {tab.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="col-md-9">
                  <div className="p-4">
                    
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <div>
                        <h4 className="text-primary mb-3">
                          <i className="bi bi-lightbulb me-2"></i>
                          Tại sao cần tích hợp n8n?
                        </h4>
                        
                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <div className="card border-warning">
                              <div className="card-header bg-warning bg-opacity-10">
                                <h6 className="mb-0 text-warning">
                                  <i className="bi bi-exclamation-triangle me-1"></i>
                                  Trước đây (Chỉ Auto)
                                </h6>
                              </div>
                              <div className="card-body">
                                <ul className="list-unstyled mb-0">
                                  <li><i className="bi bi-arrow-right text-muted me-2"></i>Chỉ tin từ VnExpress</li>
                                  <li><i className="bi bi-arrow-right text-muted me-2"></i>Không kiểm soát nội dung</li>
                                  <li><i className="bi bi-arrow-right text-muted me-2"></i>Phụ thuộc vào RSS feed</li>
                                  <li><i className="bi bi-arrow-right text-muted me-2"></i>AI tạo content tự động</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-md-6">
                            <div className="card border-success">
                              <div className="card-header bg-success bg-opacity-10">
                                <h6 className="mb-0 text-success">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Sau khi tích hợp (Hybrid)
                                </h6>
                              </div>
                              <div className="card-body">
                                <ul className="list-unstyled mb-0">
                                  <li><i className="bi bi-check text-success me-2"></i>Tự tạo tin + Auto tin</li>
                                  <li><i className="bi bi-check text-success me-2"></i>Kiểm soát 100% nội dung</li>
                                  <li><i className="bi bi-check text-success me-2"></i>Chỉnh sửa trước khi đăng</li>
                                  <li><i className="bi bi-check text-success me-2"></i>n8n vẫn tự động đăng</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="alert alert-info border-0">
                          <div className="d-flex">
                            <i className="bi bi-info-circle me-3 text-info fs-4"></i>
                            <div>
                              <h6 className="alert-heading mb-2">Luồng hoạt động mới</h6>
                              <p className="mb-0">
                                <strong>1. Tạo tin:</strong> Admin Panel → Tạo bài viết tự do<br/>
                                <strong>2. Duyệt:</strong> Chỉnh sửa nội dung và ấn "Duyệt"<br/>
                                <strong>3. Tự động:</strong> n8n nhận webhook → Đăng Facebook → Thông báo
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workflow Tab */}
                    {activeTab === 'workflow' && (
                      <div>
                        <h4 className="text-primary mb-3">
                          <i className="bi bi-diagram-3 me-2"></i>
                          Quy trình chi tiết
                        </h4>
                        
                        <div className="timeline">
                          <div className="timeline-item mb-4">
                            <div className="timeline-marker bg-primary">1</div>
                            <div className="timeline-content">
                              <h6 className="fw-bold text-primary">Tạo bài viết mới</h6>
                              <p className="text-muted mb-2">Click nút "Tạo bài viết" và điền form</p>
                              <div className="bg-light p-2 rounded small">
                                <code>Status: DRAFT | Source: MANUAL</code>
                              </div>
                            </div>
                          </div>
                          
                          <div className="timeline-item mb-4">
                            <div className="timeline-marker bg-info">2</div>
                            <div className="timeline-content">
                              <h6 className="fw-bold text-info">Duyệt và chỉnh sửa</h6>
                              <p className="text-muted mb-2">Click "BIÊN TẬP" để xem lại và chỉnh sửa nội dung</p>
                              <div className="bg-light p-2 rounded small">
                                <code>Có thể sửa: tiêu đề, nội dung Facebook, link ảnh</code>
                              </div>
                            </div>
                          </div>
                          
                          <div className="timeline-item mb-4">
                            <div className="timeline-marker bg-warning">3</div>
                            <div className="timeline-content">
                              <h6 className="fw-bold text-warning">Trigger n8n webhook</h6>
                              <p className="text-muted mb-2">Click "DUYỆT & ĐĂNG NGAY" → Gọi n8n webhook</p>
                              <div className="bg-light p-2 rounded small">
                                <code>POST: /webhook/manual-post-publish</code>
                              </div>
                            </div>
                          </div>
                          
                          <div className="timeline-item mb-4">
                            <div className="timeline-marker bg-success">4</div>
                            <div className="timeline-content">
                              <h6 className="fw-bold text-success">n8n xử lý và đăng</h6>
                              <p className="text-muted mb-2">n8n tải ảnh → Đăng Facebook → Cập nhật status</p>
                              <div className="bg-light p-2 rounded small">
                                <code>Status: PUBLISHED | Facebook Post ID saved</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Setup Tab */}
                    {activeTab === 'setup' && (
                      <div>
                        <h4 className="text-primary mb-3">
                          <i className="bi bi-gear me-2"></i>
                          Hướng dẫn thiết lập
                        </h4>
                        
                        <div className="accordion" id="setupAccordion">
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                                <i className="bi bi-1-circle me-2 text-primary"></i>
                                Import workflow vào n8n
                              </button>
                            </h2>
                            <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#setupAccordion">
                              <div className="accordion-body">
                                <p>Sao chép file workflow mới:</p>
                                <div className="bg-dark text-light p-3 rounded">
                                  <code>
                                    cp n8n-workflows/manual-posts-workflow.json /path/to/n8n/workflows/
                                  </code>
                                </div>
                                <p className="mt-2 mb-0">Sau đó import trong n8n interface.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                                <i className="bi bi-2-circle me-2 text-primary"></i>
                                Cấu hình Facebook API
                              </button>
                            </h2>
                            <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                              <div className="accordion-body">
                                <p>Cập nhật trong n8n workflow:</p>
                                <ul>
                                  <li><strong>Facebook Page ID:</strong> ID của trang Facebook</li>
                                  <li><strong>Access Token:</strong> Token có quyền đăng bài</li>
                                  <li><strong>Graph API Version:</strong> Khuyến nghị v18.0+</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                                <i className="bi bi-3-circle me-2 text-primary"></i>
                                Update webhook URL
                              </button>
                            </h2>
                            <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                              <div className="accordion-body">
                                <p>Sửa file <code>src/components/EditModal.jsx</code>:</p>
                                <div className="bg-light p-3 rounded">
                                  <code>
                                    const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/manual-post-publish';
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Testing Tab */}
                    {activeTab === 'testing' && (
                      <div>
                        <h4 className="text-primary mb-3">
                          <i className="bi bi-play-circle me-2"></i>
                          Test thử nghiệm
                        </h4>
                        
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="card border-primary">
                              <div className="card-header bg-primary bg-opacity-10">
                                <h6 className="mb-0 text-primary">
                                  <i className="bi bi-laptop me-1"></i>
                                  Demo Mode (Localhost)
                                </h6>
                              </div>
                              <div className="card-body">
                                <p className="card-text">Khi chạy trên localhost:</p>
                                <ul className="list-unstyled">
                                  <li><i className="bi bi-check text-success me-2"></i>Chỉ log ra console</li>
                                  <li><i className="bi bi-check text-success me-2"></i>Không gọi API thật</li>
                                  <li><i className="bi bi-check text-success me-2"></i>UI hoạt động bình thường</li>
                                </ul>
                                <button className="btn btn-outline-primary btn-sm">
                                  <i className="bi bi-eye me-1"></i>
                                  Xem console logs
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-md-6">
                            <div className="card border-success">
                              <div className="card-header bg-success bg-opacity-10">
                                <h6 className="mb-0 text-success">
                                  <i className="bi bi-cloud me-1"></i>
                                  Production Mode
                                </h6>
                              </div>
                              <div className="card-body">
                                <p className="card-text">Khi deploy production:</p>
                                <ul className="list-unstyled">
                                  <li><i className="bi bi-check text-success me-2"></i>Gọi n8n webhook thật</li>
                                  <li><i className="bi bi-check text-success me-2"></i>Đăng Facebook thật</li>
                                  <li><i className="bi bi-check text-success me-2"></i>Email notification</li>
                                </ul>
                                <button className="btn btn-outline-success btn-sm">
                                  <i className="bi bi-rocket me-1"></i>
                                  Deploy checklist
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="alert alert-warning mt-4">
                          <div className="d-flex">
                            <i className="bi bi-exclamation-triangle me-3 text-warning fs-4"></i>
                            <div>
                              <h6 className="alert-heading mb-2">Lưu ý quan trọng</h6>
                              <ul className="mb-0">
                                <li>Test kỹ trong demo mode trước khi deploy</li>
                                <li>Đảm bảo Facebook token có đủ quyền</li>
                                <li>Monitor n8n logs để debug lỗi</li>
                                <li>Backup workflow trước khi thay đổi</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer bg-light">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="text-muted small">
                  <i className="bi bi-github me-1"></i>
                  Tài liệu chi tiết: <code>docs/n8n-integration-guide.md</code>
                </div>
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  <i className="bi bi-check-lg me-1"></i>
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
      
      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #dee2e6;
        }
        
        .timeline-item {
          position: relative;
        }
        
        .timeline-marker {
          position: absolute;
          left: -22px;
          top: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .timeline-content {
          margin-left: 20px;
          padding: 10px 0;
        }
      `}</style>
    </>
  );
};

export default N8NIntegrationGuide;