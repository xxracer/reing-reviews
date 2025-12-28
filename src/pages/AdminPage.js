import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import EditableSection from '../components/EditableSection';
import InstructorEditor from '../components/InstructorEditor';
import BlogEditor from '../components/BlogEditor';
import './AdminPage.css';

const AdminPage = () => {
  const { page } = useParams();

  const pages = [
    { name: 'home', title: 'Home Page' },
    { name: 'kids-program', title: 'Kids Program' },
    { name: 'homeschool-program', title: 'Homeschool Program' },
    { name: 'adult-program', title: 'Adult Program' },
    { name: 'fundamentals-program', title: 'Fundamentals Program' },
    { name: 'competition-training', title: 'Competition Training' },
    { name: 'wrestling-program', title: 'Wrestling Program' },
    { name: 'private-lessons', title: 'Private Lessons' },
    { name: 'schedule', title: 'Schedule' },
    { name: 'training-schedule', title: 'Training Schedule' },
    { name: 'instructors', title: 'Instructors' },
    { name: 'our-facility', title: 'Our Facility' },
    { name: 'affiliate-schools', title: 'Affiliate Schools' },
    { name: 'contact-page', title: 'Contact Page' },
    { name: 'about', title: 'About' },
    { name: 'blog', title: 'Blog' },
  ];

  const getPageFields = (pageName) => {
    // Field definitions remain the same as before
    const homePageFields = [
      { name: 'heroTitle', label: 'Hero Title', type: 'text' },
      { name: 'heroSubtitle', label: 'Hero Subtitle', type: 'text' },
      { name: 'heroVideo', label: 'Hero Video', type: 'file' },
      { name: 'welcomeTitle', label: 'Welcome Title', type: 'text' },
      { name: 'welcomeText', label: 'Welcome Text', type: 'textarea' },
      { name: 'welcomeImage', label: 'Welcome Image', type: 'file' },
      { name: 'programsTitle', label: 'Programs Title', type: 'text' },
      { name: 'programsText', label: 'Programs Text', type: 'textarea' },
      { name: 'programImages', label: 'Program Images', type: 'file', multiple: true },
      { name: 'facilityTitle', label: 'Facility Title', type: 'text' },
      { name: 'facilityText', label: 'Facility Text', type: 'textarea' },
      { name: 'facilityImages', label: 'Facility Images', type: 'file', multiple: true },
      { name: 'testimonialsTitle', label: 'Testimonials Title', type: 'text' },
      { name: 'callToActionTitle', label: 'Call to Action Title', type: 'text' },
      { name: 'callToActionText', label: 'Call to Action Text', type: 'textarea' },
      { name: 'contactUsTitle', label: 'Contact Us Title', type: 'text' },
      { name: 'instagramFeedTitle', label: 'Instagram Feed Title', type: 'text' },
    ];

    const programPageFields = [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'mainText', label: 'Main Text', type: 'textarea' },
      { name: 'mainImage', label: 'Main Image', type: 'file' },
      { name: 'benefits', label: 'Benefits (JSON)', type: 'textarea' },
      { name: 'galleryImage', label: 'Gallery Image', type: 'file' },
    ];

    const simplePageFields = [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'mainText', label: 'Main Text', type: 'textarea' },
      { name: 'mainImage', label: 'Main Image', type: 'file' },
    ];

    const instructorFields = [
      { name: 'instructors', label: 'Instructors', type: 'custom', component: InstructorEditor },
    ];

    const blogFields = [
      { name: 'posts', label: 'Blog Posts', type: 'custom', component: BlogEditor },
    ];

    switch (pageName) {
      case 'home': return { fields: homePageFields, title: 'Home Page' };
      case 'kids-program': return { fields: programPageFields, title: 'Kids Program' };
      case 'homeschool-program': return { fields: programPageFields, title: 'Homeschool Program' };
      case 'adult-program': return { fields: programPageFields, title: 'Adult Program' };
      case 'fundamentals-program': return { fields: programPageFields, title: 'Fundamentals Program' };
      case 'competition-training': return { fields: programPageFields, title: 'Competition Training' };
      case 'wrestling-program': return { fields: programPageFields, title: 'Wrestling Program' };
      case 'private-lessons': return { fields: simplePageFields, title: 'Private Lessons' };
      case 'schedule': return { fields: simplePageFields, title: 'Schedule' };
      case 'training-schedule': return { fields: simplePageFields, title: 'Training Schedule' };
      case 'instructors': return { fields: instructorFields, title: 'Instructors' };
      case 'our-facility': return { fields: simplePageFields, title: 'Our Facility' };
      case 'affiliate-schools': return { fields: simplePageFields, title: 'Affiliate Schools' };
      case 'contact-page': return { fields: simplePageFields, title: 'Contact Page' };
      case 'about': return { fields: simplePageFields, title: 'About' };
      case 'blog': return { fields: blogFields, title: 'Blog' };
      default: return { fields: [], title: 'Select a page to edit' };
    }
  };

  const { fields, title } = getPageFields(page);

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>Editable Pages</h3>
        <ul>
          {pages.map(p => (
            <li key={p.name}>
              <NavLink to={`/admin/${p.name}`} activeClassName="active">
                {p.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-content">
        {fields.length > 0 ? (
          <EditableSection pageName={page} sectionTitle={title} fields={fields} />
        ) : (
          <h1>{title}</h1>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
