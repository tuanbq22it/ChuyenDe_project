import React from 'react';

const Navbar = ({ onRefresh }) => {
  return (
    <nav className="navbar navbar-dark bg-dark shadow mb-4">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          <i className="bi bi-hdd-network me-2"></i> Admin Panel (Local)
        </a>
        <div className="d-flex align-items-center gap-3">
          <span className="text-light small opacity-75">
            <i className="bi bi-globe me-1"></i> Kết nối tới: api.buiquoctuan.id.vn
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={onRefresh}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
