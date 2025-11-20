import React from 'react';

const PostCard = ({ post, onEdit, onDelete }) => {
  const isDraft = post.status === 'DRAFT';
  const date = new Date(post.createdAt).toLocaleString('vi-VN');
  const img = (post.imageUrl && post.imageUrl.startsWith('http')) 
    ? post.imageUrl 
    : 'https://via.placeholder.com/400x200?text=No+Image';

  return (
    <div className="col-md-6 col-lg-4">
      <div className={`card h-100 border-${isDraft ? 'warning' : 'success'} shadow-sm`}>
        <div className="position-relative">
          <img 
            src={img} 
            className="card-img-top" 
            style={{ height: '180px', objectFit: 'cover' }} 
            onError={(e) => e.target.src = 'https://via.placeholder.com/400x200'}
            alt={post.title}
          />
          <span className={`badge ${isDraft ? 'bg-warning text-dark' : 'bg-success'} status-label rounded-pill shadow-sm`}>
            {post.status}
          </span>
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold text-dark mb-2 text-truncate" title={post.title}>{post.title}</h6>
          <small className="text-muted mb-3"><i className="bi bi-clock"></i> {date}</small>
          
          <div className="mt-auto">
            {isDraft ? (
              <div className="d-flex gap-2">
                <button className="btn btn-primary w-100 fw-bold" onClick={() => onEdit(post)}>
                  <i className="bi bi-pencil-square"></i> BIÊN TẬP
                </button>
                <button className="btn btn-outline-danger px-3" onClick={() => onDelete(post._id)} title="Xóa bài viết">
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ) : (
              <a href={post.originalLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary w-100 btn-sm">
                <i className="bi bi-link-45deg"></i> Xem link gốc
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
