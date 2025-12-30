import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Programs.css';

const Programs = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/home');
        const content = response.data;
        // The data might be a stringified JSON array, so we ensure it's parsed.
        let programsData = [];
        if (typeof content.programs === 'string') {
          try {
            programsData = JSON.parse(content.programs);
          } catch (error) {
            console.error('Error parsing programs data:', error);
            programsData = [];
          }
        } else if (Array.isArray(content.programs)) {
          programsData = content.programs;
        }
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching homepage content:', error);
      }
    };

    fetchContent();
  }, []);

  const generateLinkPath = (title) => {
    if (!title) return '/';
    return `/${title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <section id="programs" className="programs-section">
      <h2 className="section-title">Our Programs</h2>
      <div className="programs-grid">
        {programs.map((program, index) => (
          <Link to={generateLinkPath(program.title)} key={index} className="program-card">
            <div className="program-image-wrapper">
              <img src={program.image} alt={program.title} />
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