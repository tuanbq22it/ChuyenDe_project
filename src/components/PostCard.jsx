import React from 'react';

const PostCard = ({ post, onEdit, onDelete }) => {
  const isDraft = post.status === 'DRAFT';
  const date = new Date(post.createdAt).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const img = (post.imageUrl && post.imageUrl.startsWith('http')) 
    ? post.imageUrl 
    : 'https://via.placeholder.com/400x200?text=No+Image';

  return (
    <div className="card h-100 shadow-sm border-0 hover-lift">
      <div className="position-relative">
        <img 
          src={img} 
          className="card-img-top" 
          style={{ height: '160px', objectFit: 'cover' }} 
          onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={post.title}
        />
        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-1 align-items-end">
          <span className={`badge ${isDraft ? 'bg-warning text-dark' : 'bg-success'} rounded-pill shadow-sm`}>
            {post.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'}
          </span>
          {(post.isLocal || post.isLocalApproved) && (
            <span className="badge bg-info rounded-pill shadow-sm" title="Chưa sync lên server">
              <i className="bi bi-cloud-slash" style={{fontSize: '0.7rem'}}></i> Local
            </span>
          )}
        </div>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <h6 className="card-title fw-bold mb-2 lh-sm" 
            style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5rem'
            }}
            title={post.title}>
          {post.title}
        </h6>
        
        {post.content && (
          <p className="card-text text-muted small flex-grow-1 mb-3" 
             style={{ 
               display: '-webkit-box',
               WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical',
               overflow: 'hidden',
               lineHeight: '1.4'
             }}>
            {post.content}
          </p>
        )}
        
        <div className="mt-auto">
          <small className="text-muted d-flex align-items-center mb-3">
            <i className="bi bi-clock me-1 flex-shrink-0"></i>
            <span className="text-truncate">{date}</span>
          </small>
          
          {isDraft ? (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary btn-sm flex-grow-1 fw-semibold d-flex align-items-center justify-content-center" 
                onClick={() => onEdit(post)}
              >
                <i className="bi bi-pencil-square me-1"></i> 
                <span className="d-none d-sm-inline">BIÊN TẬP</span>
                <span className="d-sm-none">SỬA</span>
              </button>
              <button 
                className="btn btn-outline-danger btn-sm px-2" 
                onClick={() => onDelete(post._id)}
                title="Xóa bài viết"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button 
                onClick={() => window.open(post.originalLink || '#', '_blank')}
                className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-link-45deg me-1"></i> 
                <span className="text-truncate">Xem link gốc</span>
              </button>
              <button 
                className="btn btn-outline-danger btn-sm px-2" 
                onClick={() => onDelete(post._id)}
                title="Xóa bài đã đăng (cả trên Facebook)"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
