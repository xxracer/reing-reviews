import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const pages = [
    { name: 'Home', path: '/admin/home' },
    { name: 'Kids Program', path: '/admin/kids-program' },
    { name: 'Homeschool Program', path: '/admin/homeschool-program' },
    { name: 'Adult Program', path: '/admin/adult-program' },
    { name: 'Fundamentals Program', path: '/admin/fundamentals-program' },
    { name: 'Competition Training', path: '/admin/competition-training' },
    { name: 'Wrestling Program', path: '/admin/wrestling-program' },
    { name: 'Private Lessons', path: '/admin/private-lessons' },
    { name: 'Schedule', path: '/admin/schedule' },
    { name: 'Training Schedule', path: '/admin/training-schedule' },
    { name: 'Instructors', path: '/admin/instructors' },
    { name: 'Our Facility', path: '/admin/our-facility' },
    { name: 'Affiliate Schools', path: '/admin/affiliate-schools' },
    { name: 'Contact Page', path: '/admin/contact-page' },
    { name: 'About', path: '/admin/about' },
    { name: 'Blog', path: '/admin/blog' },
  ];

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        {pages.map(page => (
          <NavLink key={page.path} to={page.path} className={({ isActive }) => (isActive ? 'active' : '')}>
            {page.name}
          </NavLink>
        ))}
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
