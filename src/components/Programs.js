import React from 'react';
import { Link } from 'react-router-dom';
import './Programs.css';

const programsData = [
  {
    title: 'Kids Program',
    path: '/kids-program',
    description: 'Confidence, discipline, and fun for children.',
    image: 'https://static.wixstatic.com/media/c5947c_ac4e41c0457d42fcbc4f4f070b3eb0b8~mv2.jpeg',
    alt: 'Kids class in session'
  },
  {
    title: 'Homeschool Jiu Jitsu',
    path: '/homeschool-program',
    description: 'Daytime classes for homeschool families.',
    image: 'https://static.wixstatic.com/media/c5947c_16bfacad459d4e99a2c3732ec8c2eeaa~mv2.jpg',
    alt: 'Homeschool Jiu Jitsu class'
  },
  {
    title: 'Adult Jiu Jitsu',
    path: '/adult-program',
    description: 'For self-defense, fitness, and growth.',
    image: 'https://static.wixstatic.com/media/c5947c_63ee72fd97bd41cb9765007d3fcd2c03~mv2.webp',
    alt: 'Adults rolling on mats'
  },
  {
    title: 'Fundamentals Program',
    path: '/fundamentals-program',
    description: 'Perfect for new students.',
    image: 'https://static.wixstatic.com/media/c5947c_2bc197c9fc884db093709a7c485f4a10~mv2.jpeg',
    alt: 'Fundamentals class'
  },
  {
    title: 'Competition Training',
    path: '/competition-training',
    description: 'For athletes who want to test themselves on the mat.',
    image: 'https://static.wixstatic.com/media/c5947c_71fd2736ba3f44698abcaf1f97f5cfe4~mv2.png',
    alt: 'Competition highlight photo'
  },
  {
    title: 'Private Lessons',
    path: '/private-lessons',
    description: 'One-on-one coaching for faster progress.',
    image: 'https://static.wixstatic.com/media/c5947c_7a00dcaeef1c40db9ac17b3bd4bda321~mv2.jpg',
    alt: 'Private BJJ lesson'
  }
];

const Programs = () => {
  return (
    <section id="programs" className="programs-section">
      <h2 className="section-title">Our Programs</h2>
      <div className="programs-grid">
        {programsData.map((program, index) => (
          <Link to={program.path} key={index} className="program-card">
            <div className="program-image-wrapper">
              <img src={program.image} alt={program.alt} />
            </div>
            <div className="program-content">
              <h3 className="program-title">{program.title}</h3>
              <p className="program-description">{program.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Programs;