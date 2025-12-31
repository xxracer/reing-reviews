import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
    const pages = [
        'home',
        'about',
        'adult-program',
        'affiliate-schools',
        'blog',
        'competition-training',
        'contact',
        'fundamentals-program',
        'homeschool-program',
        'instructors',
        'kids-program',
        'our-facility',
        'private-lessons',
        'schedule',
        'testimonials',
        'wrestling-program',
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <nav>
                    <ul>
                        {pages.map(page => (
                            <li key={page}>
                                <NavLink
                                    to={`/admin/edit/${page}`}
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    Manage {page.replace(/-/g, ' ')}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
