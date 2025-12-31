import React from 'react';
import { Link } from 'react-router-dom';
import './Programs.css';

const defaultPrograms = [
    {
      title: 'Kids Program',
      path: '/kids-program',
      description: 'Confidence, discipline, and fun for children.',
      image: 'https://static.wixstatic.com/media/c5947c_ac4e41c0457d42fcbc4f4f070b3eb0b8~mv2.jpeg',
      alt: 'Kids class in session'
    },
    // ... other default programs
];

const Programs = ({ programs }) => {
  const programsData = programs && programs.length > 0 ? programs : defaultPrograms;

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
